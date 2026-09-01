import { l as safeBalance, o as TREASURY, s as USDC_BASE } from "./types-B4Cm2iRZ.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/pay.server-DcxlzbMU.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatUsdc(micros) {
	const sign = micros < 0 ? "-" : "";
	const abs = Math.abs(micros);
	const whole = Math.floor(abs / 1e6);
	const frac = abs % 1e6;
	if (frac === 0) return `${sign}${whole} USDC`;
	return `${sign}${whole}.${frac.toString().padStart(6, "0").replace(/0+$/, "")} USDC`;
}
function formatClock(ts) {
	const d = new Date(ts);
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
function initials(name) {
	if (!name || typeof name !== "string") return "AG";
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "AG";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return ((parts[0][0] ?? "") + (parts[1][0] ?? "")).toUpperCase() || "AG";
}
var _0002_floor_default = "-- Durable floor: wallets, matches, ledger. Unowned (no user_id) — world-readable.\ncreate table if not exists wallets (\n  id         text primary key,\n  name       text not null,\n  balance    integer not null,\n  created_at bigint not null\n);\n\ncreate table if not exists matches (\n  id         text primary key,\n  game_id    text not null,\n  status     text not null,\n  created_at bigint not null,\n  updated_at bigint not null,\n  payload    jsonb not null\n);\n\ncreate index if not exists matches_status_idx on matches (status);\ncreate index if not exists matches_created_idx on matches (created_at desc);\n\ncreate table if not exists ledger (\n  id       text primary key,\n  ts       bigint not null,\n  from_id  text not null,\n  to_id    text not null,\n  amount   integer not null,\n  kind     text not null,\n  match_id text,\n  note     text not null\n);\n\ncreate index if not exists ledger_ts_idx on ledger (ts desc);\n";
var _0003_meta_default = "-- Floor flags (unowned). house_bots defaults on.\ncreate table if not exists meta (\n  key   text primary key,\n  value text not null\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
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
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({
			connectionString: databaseUrl,
			ssl: databaseUrl?.includes("supabase.com") || databaseUrl?.includes("neon.tech") || databaseUrl?.includes("sslmode=require") ? { rejectUnauthorized: false } : void 0
		});
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({
			"/migrations/0002_floor.sql": _0002_floor_default,
			"/migrations/0003_meta.sql": _0003_meta_default
		});
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
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
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function asMatch(raw) {
	if (typeof raw === "string") return JSON.parse(raw);
	return raw;
}
async function ensureMeta(sql) {
	await sql.query(`create table if not exists meta (
      key   text primary key,
      value text not null
    )`);
}
async function loadAll() {
	const sql = await getSql();
	await ensureMeta(sql);
	const walletRows = await sql`
    select id, name, balance, created_at from wallets order by name
  `;
	const matchRows = await sql`
    select id, payload from matches order by created_at desc limit 80
  `;
	const ledgerRows = await sql`
    select id, ts, from_id, to_id, amount, kind, match_id, note from ledger order by ts desc limit 400
  `;
	const raw = (await sql`
    select value from meta where key = 'house_bots'
  `)[0]?.value;
	return {
		wallets: walletRows.map((r) => ({
			id: r.id,
			name: r.name,
			balance: safeBalance(r.balance),
			createdAt: Number(r.created_at)
		})),
		matches: matchRows.map((r) => asMatch(r.payload)),
		ledger: ledgerRows.map((r) => ({
			id: r.id,
			ts: Number(r.ts),
			from: r.from_id,
			to: r.to_id,
			amount: Number(r.amount),
			kind: r.kind,
			matchId: r.match_id ?? void 0,
			note: r.note
		})),
		houseBots: raw == null ? true : raw !== "0" && raw !== "false"
	};
}
async function loadMatch(id) {
	const row = (await (await getSql())`
    select id, payload from matches where id = ${id} limit 1
  `)[0];
	return row ? asMatch(row.payload) : void 0;
}
async function loadMatches() {
	return (await (await getSql())`
    select id, payload from matches order by created_at desc limit 80
  `).map((r) => asMatch(r.payload));
}
async function loadWallet(id) {
	const r = (await (await getSql())`
    select id, name, balance, created_at from wallets where id = ${id} limit 1
  `)[0];
	if (!r) return void 0;
	return {
		id: r.id,
		name: r.name,
		balance: safeBalance(r.balance),
		createdAt: Number(r.created_at)
	};
}
async function loadWallets() {
	return (await (await getSql())`
    select id, name, balance, created_at from wallets order by name
  `).map((r) => ({
		id: r.id,
		name: r.name,
		balance: safeBalance(r.balance),
		createdAt: Number(r.created_at)
	}));
}
async function saveHouseBots(on) {
	await saveMeta("house_bots", on ? "1" : "0");
}
async function loadMeta(key) {
	const sql = await getSql();
	await ensureMeta(sql);
	return (await sql`
    select value from meta where key = ${key} limit 1
  `)[0]?.value;
}
async function saveMeta(key, value) {
	const sql = await getSql();
	await ensureMeta(sql);
	await sql.query(`insert into meta (key, value) values ($1, $2)
     on conflict (key) do update set value = excluded.value`, [key, value]);
}
async function saveWallet(wallet) {
	await (await getSql()).query(`insert into wallets (id, name, balance, created_at)
     values ($1, $2, $3, $4)
     on conflict (id) do update set
       name = excluded.name,
       balance = excluded.balance`, [
		wallet.id,
		wallet.name,
		wallet.balance,
		wallet.createdAt
	]);
}
async function saveMatch(match) {
	await (await getSql()).query(`insert into matches (id, game_id, status, created_at, updated_at, payload)
     values ($1, $2, $3, $4, $5, $6::jsonb)
     on conflict (id) do update set
       game_id = excluded.game_id,
       status = excluded.status,
       updated_at = excluded.updated_at,
       payload = excluded.payload`, [
		match.id,
		match.gameId,
		match.status,
		match.createdAt,
		Date.now(),
		JSON.stringify(match)
	]);
}
async function saveLedger(entry) {
	await (await getSql()).query(`insert into ledger (id, ts, from_id, to_id, amount, kind, match_id, note)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do nothing`, [
		entry.id,
		entry.ts,
		entry.from,
		entry.to,
		entry.amount,
		entry.kind,
		entry.matchId ?? null,
		entry.note
	]);
}
async function deleteMatch(id) {
	await (await getSql()).query(`delete from matches where id = $1`, [id]);
}
async function deleteWallet(id) {
	await (await getSql()).query(`delete from wallets where id = $1`, [id]);
}
var pay_server_exports = /* @__PURE__ */ __exportAll({
	PayError: () => PayError,
	checkSecret: () => checkSecret,
	credit: () => credit,
	debit: () => debit,
	initWalletSeed: () => initWalletSeed,
	parsePaymentHeader: () => parsePaymentHeader,
	paymentAccept: () => paymentAccept,
	walletSecret: () => walletSecret
});
function paymentAccept(opts) {
	return {
		scheme: "exact",
		network: "base",
		maxAmountRequired: String(opts.amount),
		resource: opts.resource,
		description: opts.description,
		mimeType: "application/json",
		payTo: TREASURY,
		maxTimeoutSeconds: 60,
		asset: USDC_BASE,
		extra: {
			name: "USD Coin",
			version: "2",
			kind: opts.kind
		}
	};
}
var walletSeed = null;
async function initWalletSeed() {
	if (walletSeed) return;
	const existing = await loadMeta("wallet_seed");
	if (existing && existing.length >= 32) {
		walletSeed = existing;
		return;
	}
	walletSeed = randomBytes(32).toString("hex");
	await saveMeta("wallet_seed", walletSeed);
}
function walletSecret(walletId) {
	if (!walletSeed) throw new Error("Wallet seed not ready");
	return createHmac("sha256", walletSeed).update(walletId).digest("base64url").slice(0, 24);
}
function checkSecret(walletId, secret) {
	if (!secret || typeof secret !== "string") return false;
	const expect = walletSecret(walletId);
	const a = Buffer.from(secret);
	const b = Buffer.from(expect);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}
function parsePaymentHeader(header, bodyWalletId, bodySecret) {
	let walletId = typeof bodyWalletId === "string" ? bodyWalletId.trim() : "";
	let secret = typeof bodySecret === "string" ? bodySecret.trim() : "";
	if (header) {
		const raw = header.trim();
		try {
			const decoded = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
			const parsed = JSON.parse(decoded);
			if (!walletId && typeof parsed.walletId === "string") walletId = parsed.walletId;
			if (!walletId && typeof parsed.from === "string") walletId = parsed.from;
			if (!secret && typeof parsed.secret === "string") secret = parsed.secret;
			if (!secret && typeof parsed.token === "string") secret = parsed.token;
		} catch {}
	}
	if (!walletId || !secret) return null;
	if (!checkSecret(walletId, secret)) return null;
	return {
		walletId,
		secret
	};
}
function debit(wallet, amount) {
	if (wallet.balance < amount) throw new PayError(`Insufficient balance: ${wallet.name} has ${formatUsdc(wallet.balance)}, needs ${formatUsdc(amount)}`);
	wallet.balance -= amount;
}
function credit(wallet, amount) {
	wallet.balance += amount;
}
var PayError = class extends Error {
	constructor(message) {
		super(message);
	}
};
//#endregion
export { initials as C, formatUsdc as S, saveLedger as _, parsePaymentHeader as a, cn as b, walletSecret as c, loadAll as d, loadMatch as f, saveHouseBots as g, loadWallets as h, initWalletSeed as i, deleteMatch as l, loadWallet as m, credit as n, pay_server_exports as o, loadMatches as p, debit as r, paymentAccept as s, checkSecret as t, deleteWallet as u, saveMatch as v, __exportAll as w, formatClock as x, saveWallet as y };
