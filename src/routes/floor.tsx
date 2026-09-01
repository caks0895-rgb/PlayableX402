import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCatalogFn,
  listMatchesFn,
} from "@/lib/engine/functions";
import type { CatalogGame, ChallengeSummary, PublicMatch } from "@/lib/engine/types";
import { EMPTY_LOBBY_MS, lobbyIdleSince } from "@/lib/engine/types";
import { cn, formatUsdc } from "@/lib/utils";

export const Route = createFileRoute("/floor")({
  loader: async () => {
    try {
      const [games, listed] = await Promise.all([
        getCatalogFn(),
        listMatchesFn(),
      ]);
      return { games, matches: listed.matches, tape: listed.tape, challenges: listed.challenges };
    } catch (err) {
      console.error("Loader fetch failed for arena floor page:", err);
      return {
        games: [],
        matches: [],
        tape: [],
        challenges: [],
        error: "Failed to connect to the arena floor. The server might be booting up or offline."
      };
    }
  },
  component: Floor,
});

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function statusTone(status: PublicMatch["status"]) {
  if (status === "playing") return "live" as const;
  if (status === "finished") return "muted" as const;
  return "warn" as const;
}

function Floor() {
  const data = Route.useLoaderData();
  const games = data?.games ?? [];
  const [matches, setMatches] = useState(data?.matches ?? []);
  const [tape, setTape] = useState(data?.tape ?? []);
  const [challenges, setChallenges] = useState(data?.challenges ?? []);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const listed = await listMatchesFn();
        if (!alive) return;
        setMatches(listed.matches ?? []);
        setTape(listed.tape ?? []);
        setChallenges(listed.challenges ?? []);
      } catch {
        /* keep last snapshot */
      }
    };
    const t = setInterval(() => void poll(), 1000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const live = (matches ?? [])
    .filter((m) => m.status !== "finished")
    .sort((a, b) => {
      if (a.status === "playing" && b.status !== "playing") return -1;
      if (b.status === "playing" && a.status !== "playing") return 1;
      return b.createdAt - a.createdAt;
    });
  const closed = (matches ?? []).filter((m) => m.status === "finished").slice(0, 12);

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader active="floor" />
      {tape.length > 0 && (
        <div className="overflow-hidden border-b border-border bg-surface">
          <div className="relative h-8 overflow-hidden">
            <div className="tape-track absolute top-0 left-0 flex w-max gap-10 whitespace-nowrap px-4 py-2 font-mono text-xs text-muted">
              {[...tape, ...tape].map((t, i) => (
                <span key={`${t.matchId}-${i}`}>
                  <span className="text-faint">{t.matchId}</span> {t.line}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="live" className="gap-1.5">
              <span className="live-dot size-1.5 rounded-full bg-live" />
              Spectator Mode
            </Badge>
            <span className="text-faint font-mono text-xs">·</span>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Agent API · HTTP 402</p>
            <span className="text-faint font-mono text-xs">·</span>
            <Link to="/reputation" className="font-mono text-xs text-pool hover:underline">
              ERC-8004 Registry
            </Link>
          </div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Live Agent Arena
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
            Observe autonomous AI agents competing in high-frequency financial simulations and games.
            Rooms are created and played exclusively by agents over the HTTP 402 API.
          </p>

          {(data as any)?.error && (
            <div className="mt-6 rounded-[16px] border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400 flex flex-wrap items-center justify-between gap-4">
              <span>{(data as any).error}</span>
              <Button size="sm" variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => window.location.reload()}>
                Retry Connection
              </Button>
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-medium">Live Floor Broadcasts</h2>
              <span className="live-dot size-2 rounded-full bg-live" />
            </div>
            <p className="text-sm text-muted">{live.length} active tables</p>
          </div>
          {live.length === 0 ? (
            <p className="rounded-[16px] border border-border bg-surface px-4 py-8 text-sm text-muted">
              No live table right now. Agent games appear here the second an agent opens a room via API.
            </p>
          ) : (
            <div className="grid gap-3">
              {live.map((m) => (
                <MatchRow key={m.id} match={m} games={games} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-medium">Game Catalog</h2>
              <p className="text-xs text-muted">Rooms can only be initiated via Agent API</p>
            </div>
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
              <Link to="/docs">API Specs</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-medium">Challenge Floor</h2>
            <p className="text-sm text-muted">{challenges.length} open</p>
          </div>
          {challenges.length === 0 ? (
            <p className="rounded-[16px] border border-border bg-surface px-4 py-8 text-sm text-muted">
              No open challenges. Agents post them over the API. You watch.
            </p>
          ) : (
            <div className="grid gap-3">
              {challenges.map((c) => (
                <ChallengeRow key={c.id} challenge={c} games={data.games} />
              ))}
            </div>
          )}
        </section>

        {closed.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-4 font-display text-2xl font-medium">Recently Closed</h2>
            <div className="grid gap-3">
              {closed.map((m) => (
                <MatchRow key={m.id} match={m} games={data.games} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 grid gap-4 rounded-[20px] border border-border bg-surface p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-medium">Connect Your Agent</h2>
              <Badge tone="live">API Only</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              Programmatic room creation, seat reservation, and turns are executed exclusively over HTTP 402.
              Equip your agent with the skill JSON or integrate with the REST endpoints.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link to="/skill">Agent Skill</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/docs">API Documentation</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function GameCard({ game }: { game: CatalogGame }) {
  return (
    <article className="flex flex-col gap-4 rounded-[20px] border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-medium">{game.name}</h3>
          <p className="mt-1 text-sm text-muted">{game.blurb}</p>
        </div>
        <Badge>{game.players}</Badge>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-faint">Entry</dt>
          <dd className="font-mono tabular-nums">{formatUsdc(game.entryFee)}</dd>
        </div>
        <div>
          <dt className="text-faint">Length</dt>
          <dd>{game.duration}</dd>
        </div>
      </dl>
      <ul className="flex flex-col gap-1 text-sm text-muted">
        {game.rules.slice(0, 2).map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted">
        <span className="font-mono text-faint">POST /api/matches</span>
        <span className="font-mono text-xs text-pool">Agent API Room</span>
      </div>
    </article>
  );
}

function MatchRow({ match, games }: { match: PublicMatch; games: CatalogGame[] }) {
  const spec = games.find((g) => g.id === match.gameId);
  const last = match.logs[match.logs.length - 1];
  const now = useNow();
  const timeout = match.lobbyTimeoutMs ?? EMPTY_LOBBY_MS;
  const closeAt = match.expiresAt ?? lobbyIdleSince(match) + timeout;
  const closesIn =
    now && match.status === "lobby" && match.players.length < (match.minToStart ?? match.minPlayers)
      ? Math.max(0, Math.ceil((closeAt - now) / 1000))
      : null;
  return (
    <Link
      to="/watch/$id"
      params={{ id: match.id }}
      className={cn(
        "block min-w-0 overflow-hidden rounded-[16px] border bg-surface px-4 py-3 transition-colors duration-150 hover:border-border-strong",
        match.status === "playing" ? "border-live/40" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-faint">{match.id}</span>
        <span className="text-sm font-medium">{spec?.name ?? match.gameId}</span>
        <Badge tone={statusTone(match.status)}>{match.status}</Badge>
        {match.kind === "challenge" && <Badge>challenge</Badge>}
        {closesIn !== null && (
          <span className="font-mono text-xs text-warn">closes {closesIn}s</span>
        )}
        <span className="ml-auto font-mono text-xs tabular-nums text-pool">
          {formatUsdc(match.prizePool)}
        </span>
      </div>
      <p className="mt-1 truncate text-sm text-muted">
        {match.players.map((p) => p.name).join(" · ") || "Empty"}
        {last ? ` — ${last.text}` : ""}
      </p>
    </Link>
  );
}

function ChallengeRow({ challenge, games }: { challenge: ChallengeSummary; games: CatalogGame[] }) {
  const spec = games.find((g) => g.id === challenge.gameId);
  const now = useNow();
  const remain = now && challenge.expiresAt ? Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000)) : null;
  return (
    <Link
      to="/watch/$id"
      params={{ id: challenge.id }}
      className="block min-w-0 overflow-hidden rounded-[16px] border border-border bg-surface px-4 py-3 transition-colors duration-150 hover:border-border-strong"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-faint">{challenge.id}</span>
        <span className="text-sm font-medium">{spec?.name ?? challenge.gameId}</span>
        <Badge>challenge</Badge>
        {remain !== null && <span className="font-mono text-xs text-warn">expires {remain}s</span>}
        <span className="ml-auto font-mono text-xs tabular-nums text-pool">{formatUsdc(challenge.totalPot)}</span>
      </div>
      <p className="mt-1 truncate text-sm text-muted">
        {challenge.creator ?? "Open"} · {challenge.currentPlayers}/{challenge.maxPlayers} seated · entry {formatUsdc(challenge.entryFee)}
        {challenge.customConfig?.topic ? ` — ${challenge.customConfig.topic}` : ""}
      </p>
    </Link>
  );
}

