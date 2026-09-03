import { pendingMigrations } from "../../scripts/migration-plan.mjs";

/** Which database backend is active. */
export type DbSource = "neon" | "pglite";

// An empty/whitespace DATABASE_URL (an easy misconfig in deploy UIs) must mean
// "unset" — otherwise production would silently run on the PGLite fallback.
const rawDatabaseUrl =
  typeof process !== "undefined" ? process.env.DATABASE_URL : undefined;
const databaseUrl =
  rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : undefined;

/**
 * Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
 * sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
 * the app has a working database even with nothing configured — the live preview
 * included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
 */
export const dbSource: DbSource = databaseUrl ? "neon" : "pglite";

/**
 * Minimal shared SQL surface, satisfied by both Neon and PGLite. Both the
 * tagged-template and `.query()` forms resolve to an array of row objects:
 *
 *   const sql = await getSql();
 *   const rows = await sql`select * from todos where id = ${id}`; // parameterized
 *   const rows2 = await sql.query("select * from todos where id = $1", [id]);
 */
export interface Sql {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<T[]>;
}

/**
 * Init state lives on globalThis as promises: dev HMR creates new instances of
 * this module, and two instances racing module-level state would open a second
 * pool or run two concurrent PGLite migration passes (whose duplicate
 * `_migrations` insert rejects — and would get memoized, poisoning every later
 * `getSql()`). A failed init clears its slot so the next call retries.
 */
const globalRef = globalThis as typeof globalThis & {
  __pgSqlPromise__?: Promise<Sql>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
  __pgliteMigrateChain__?: Promise<void>;
};

/**
 * Result-type parity: Postgres sends every value as text plus a type OID — the
 * JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
 * int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
 * JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
 * production return identical, JSON-safe shapes:
 *   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
 *                                   `::text` if you ever need huge integers)
 *   date                         -> 'YYYY-MM-DD' string
 *   interval                     -> Postgres interval text
 * numeric already comes back as a string on both (arbitrary precision).
 */
const OID_INT8 = 20;
const OID_DATE = 1082;
const OID_INTERVAL = 1186;
const identity = (v: string) => v;

type Run = <T>(text: string, params: unknown[]) => Promise<T[]>;

/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run: Run): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    // Rebuild with $1, $2, … placeholders so values stay parameterized.
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return run<T>(text, values);
  }) as unknown as Sql;
  sql.query = <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    run<T>(text, params);
  return sql;
}

function createNeonSql(): Promise<Sql> {
  globalRef.__pgSqlPromise__ ??= (async () => {
    // Regular Postgres driver: node-postgres (`pg`) — works directly with Supabase,
    // Neon, or any PostgreSQL pooled endpoint. One pool per process; warm serverless instances reuse it.
    const { Pool, types } = await import("pg");
    types.setTypeParser(OID_INT8, Number);
    types.setTypeParser(OID_DATE, identity);
    types.setTypeParser(OID_INTERVAL, identity);
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl:
        databaseUrl?.includes("supabase.com") || databaseUrl?.includes("neon.tech") || databaseUrl?.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : undefined,
    });
    return toSql(async <T>(text: string, params: unknown[]) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    });
  })().catch((err) => {
    globalRef.__pgSqlPromise__ = undefined;
    throw err;
  });
  return globalRef.__pgSqlPromise__;
}

// In-memory table store fallback when neither Postgres nor PGLite WASM is available
interface MemStore {
  wallets: Map<string, any>;
  matches: Map<string, any>;
  ledger: any[];
  meta: Map<string, string>;
  migrations: Set<string>;
}

function getMemStore(): MemStore {
  const g = globalThis as typeof globalThis & { __pxMemDb?: MemStore };
  if (!g.__pxMemDb) {
    g.__pxMemDb = {
      wallets: new Map(),
      matches: new Map(),
      ledger: [],
      meta: new Map([["house_bots", "1"]]),
      migrations: new Set(),
    };
  }
  return g.__pxMemDb;
}

function createMemSql(): Sql {
  const store = getMemStore();
  const run: Run = async <T>(text: string, params: unknown[] = []): Promise<T[]> => {
    const q = text.trim().toLowerCase();

    if (q.includes("create table") || q.includes("create index")) {
      return [] as T[];
    }

    if (q.includes("select name from _migrations")) {
      return Array.from(store.migrations).map((name) => ({ name })) as unknown as T[];
    }

    if (q.includes("insert into _migrations")) {
      if (params[0]) store.migrations.add(String(params[0]));
      return [] as T[];
    }

    if (q.includes("from meta")) {
      if (q.includes("where key =")) {
        const key = params[0] !== undefined ? String(params[0]) : (text.match(/key\s*=\s*'([^']+)'/)?.[1] ?? "");
        const val = store.meta.get(key);
        return (val !== undefined ? [{ value: val }] : []) as unknown as T[];
      }
      return [] as T[];
    }

    if (q.includes("into meta")) {
      const match = text.match(/values\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/i);
      const key = params[0] !== undefined ? String(params[0]) : (match ? match[1] : "");
      const val = params[1] !== undefined ? String(params[1]) : (match ? match[2] : "");
      if (key) store.meta.set(key, val);
      return [] as T[];
    }

    if (q.includes("from wallets")) {
      if (q.includes("where id =")) {
        const id = String(params[0] ?? "");
        const w = store.wallets.get(id);
        return (w ? [w] : []) as unknown as T[];
      }
      return Array.from(store.wallets.values()) as unknown as T[];
    }

    if (q.includes("into wallets")) {
      const [id, name, balance, created_at] = params;
      if (id) {
        store.wallets.set(String(id), {
          id: String(id),
          name: String(name),
          balance: Number(balance),
          created_at: Number(created_at),
        });
      }
      return [] as T[];
    }

    if (q.includes("delete from wallets")) {
      const id = String(params[0] ?? "");
      store.wallets.delete(id);
      return [] as T[];
    }

    if (q.includes("from matches")) {
      if (q.includes("where id =")) {
        const id = String(params[0] ?? "");
        const m = store.matches.get(id);
        return (m ? [{ id, payload: m.payload }] : []) as unknown as T[];
      }
      return Array.from(store.matches.values()).map((m) => ({
        id: m.id,
        payload: m.payload,
      })) as unknown as T[];
    }

    if (q.includes("into matches")) {
      const [id, game_id, status, created_at, updated_at, payload] = params;
      if (id) {
        store.matches.set(String(id), {
          id: String(id),
          game_id: String(game_id),
          status: String(status),
          created_at: Number(created_at),
          updated_at: Number(updated_at),
          payload: typeof payload === "string" ? JSON.parse(payload) : payload,
        });
      }
      return [] as T[];
    }

    if (q.includes("delete from matches")) {
      const id = String(params[0] ?? "");
      store.matches.delete(id);
      return [] as T[];
    }

    if (q.includes("from ledger")) {
      return store.ledger.slice(0, 400) as unknown as T[];
    }

    if (q.includes("into ledger")) {
      const [id, ts, from_id, to_id, amount, kind, match_id, note] = params;
      if (id) {
        store.ledger.unshift({
          id: String(id),
          ts: Number(ts),
          from_id: String(from_id),
          to_id: String(to_id),
          amount: Number(amount),
          kind: String(kind),
          match_id: match_id ? String(match_id) : null,
          note: String(note ?? ""),
        });
      }
      return [] as T[];
    }

    return [] as T[];
  };

  return toSql(run);
}

async function createPgliteSql(): Promise<Sql> {
  try {
    globalRef.__pgliteInstance__ ??= (async () => {
      const { PGlite } = await import("@electric-sql/pglite");
      const pg = new PGlite({
        parsers: {
          [OID_INT8]: Number,
          [OID_DATE]: identity,
          [OID_INTERVAL]: identity,
        },
      });
      await pg.waitReady;
      await pg.exec(
        "create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())",
      );
      return pg;
    })().catch((err) => {
      globalRef.__pgliteInstance__ = undefined;
      console.warn("[db] PGLite init failed, falling back to memory store:", err?.message || err);
      return undefined as any;
    });

    const pg = await globalRef.__pgliteInstance__;
    if (!pg) {
      return createMemSql();
    }

    const migrate = async (): Promise<void> => {
      try {
        const migrations = import.meta.glob("/migrations/*.sql", {
          query: "?raw",
          import: "default",
          eager: true,
        }) as Record<string, string>;
        const doneRows = await pg.query<{ name: string }>(
          "select name from _migrations",
        );
        const done = doneRows.rows.map((r) => r.name);
        for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) {
          await pg.transaction(async (tx) => {
            await tx.exec(migrations[path]);
            await tx.query("insert into _migrations (name) values ($1)", [name]);
          });
        }
      } catch (mErr) {
        console.warn("[db] Migration check skipped:", mErr);
      }
    };

    const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve())
      .catch(() => undefined)
      .then(migrate);
    globalRef.__pgliteMigrateChain__ = pass;
    await pass;

    return toSql(async <T>(text: string, params: unknown[]) => {
      const result = await pg.query<T>(text, params);
      return result.rows;
    });
  } catch (err) {
    console.warn("[db] PGLite failed, using in-memory store:", err);
    return createMemSql();
  }
}

let sqlPromise: Promise<Sql> | null = null;

async function createSql(): Promise<Sql> {
  if (typeof window !== "undefined") {
    throw new Error(
      "@/lib/db is server-only — call getSql() from a createServerFn handler " +
        "or a server route loader, never from client code.",
    );
  }
  return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}

/**
 * Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
 * otherwise the local PGLite fallback. Memoized — safe to call per request.
 *
 * Schema comes from `migrations/*.sql`, auto-applied before the first query on
 * both backends — define tables there, never inline in server functions.
 */
export function getSql(): Promise<Sql> {
  sqlPromise ??= createSql().catch((err) => {
    sqlPromise = null; // don't memoize failures — let the next call retry
    throw err;
  });
  return sqlPromise;
}

/**
 * The shared PGLite instance (preview only), with `migrations/*.sql` applied.
 * Lets Better Auth persist to the SAME embedded DB as app data in preview (via a
 * Kysely dialect). Throws when `DATABASE_URL` is set (that path uses Neon).
 */
export async function getPglite(): Promise<import("@electric-sql/pglite").PGlite> {
  if (dbSource !== "pglite") {
    throw new Error("getPglite() is only available on the PGLite fallback (no DATABASE_URL)");
  }
  await getSql();
  const pg = await globalRef.__pgliteInstance__;
  if (!pg) throw new Error("PGLite instance failed to initialize");
  return pg;
}

/**
 * Finish DB bootstrap before the server handles traffic.
 *
 * - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
 *   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
 * - **Neon**: no-op (pool is created lazily on first query).
 *
 * Vite `configureServer` awaits this at dev startup; production imports of this
 * module kick it off immediately (see bottom of file).
 */
export function ensureDbReady(): Promise<void> {
  if (dbSource !== "pglite") return Promise.resolve();
  return getSql().then(() => undefined);
}

// Server-only eager start: kick PGLite bootstrap as soon as this module loads in
// Node. Client bundles never hit this path (`getSql` throws in the browser).
const globalBoot = globalThis as typeof globalThis & {
  __pgBootstrapPromise__?: Promise<void>;
};
if (typeof window === "undefined" && dbSource === "pglite") {
  globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
    globalBoot.__pgBootstrapPromise__ = undefined;
    console.warn("[db] PGLite bootstrap warning (using fallback memory store if needed):", err?.message || err);
  });
}
