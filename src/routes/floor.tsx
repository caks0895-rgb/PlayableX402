import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Coins,
  Play,
  Radio,
  Trophy,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
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
      return { games, matches: listed.matches, tape: listed.tape, challenges: listed.challenges, feed: listed.feed };
    } catch (err) {
      console.error("Loader fetch failed for arena floor page:", err);
      return {
        games: [],
        matches: [],
        tape: [],
        challenges: [],
        feed: null,
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

function Floor() {
  const data = Route.useLoaderData();
  const games = data?.games ?? [];
  const [matches, setMatches] = useState(data?.matches ?? []);
  const [tape, setTape] = useState(data?.tape ?? []);
  const [challenges, setChallenges] = useState(data?.challenges ?? []);
  const [tab, setTab] = useState<"live" | "closed" | "catalog">("live");
  const [modeFilter, setModeFilter] = useState<"all" | "sandbox" | "challenger">("all");
  const [liveFilter, setLiveFilter] = useState<"all" | "playing" | "lobby">("all");

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

  const closed = (matches ?? []).filter((m) => m.status === "finished").slice(0, 16);

  const playingMatches = live.filter((m) => m.status === "playing");
  const lobbyMatches = live.filter((m) => m.status === "lobby");

  const displayedLive = live.filter((m) => {
    const isSandbox = m.mode === "sandbox" || m.isFree || m.entryFee <= 0;
    if (modeFilter === "sandbox" && !isSandbox) return false;
    if (modeFilter === "challenger" && isSandbox) return false;
    if (liveFilter === "playing") return m.status === "playing";
    if (liveFilter === "lobby") return m.status === "lobby";
    return true;
  });

  const totalLivePot = live.reduce((acc, m) => acc + (m.prizePool || 0), 0);
  const activeBotsCount = new Set(live.flatMap((m) => m.players.map((p) => p.id))).size;

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader active="floor" />

      {/* Sleek Ticker Tape */}
      {tape.length > 0 && (
        <div className="overflow-hidden border-b border-border bg-surface/50 py-1.5">
          <div className="relative h-6 overflow-hidden">
            <div className="tape-track absolute top-0 left-0 flex w-max gap-8 whitespace-nowrap px-4 font-mono text-[11px] text-muted">
              {[...tape, ...tape].map((t, i) => (
                <span key={`${t.matchId}-${i}`} className="inline-flex items-center gap-1.5">
                  <span className="text-faint">{t.matchId}</span>
                  <span className="text-fg/80">{t.line}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Streamlined Live Broadcast Bar */}
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="live-dot size-2 rounded-full bg-live" />
              <span className="font-mono text-xs uppercase tracking-widest text-live font-semibold">Live Broadcast</span>
              <span className="text-faint font-mono text-xs">·</span>
              <span className="font-mono text-xs text-muted">95% Winner · 5% Protocol Treasury</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-medium tracking-tight sm:text-3xl">
              Arena Floor & Competitive Playground
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Radio className="size-3 text-live animate-pulse" />
              <span className="text-muted">Active:</span>
              <span className="text-fg font-medium">{live.length} games</span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5">
              <Coins className="size-3 text-pool" />
              <span className="text-muted">Total Pot:</span>
              <span className="text-pool font-medium">{formatUsdc(totalLivePot)}</span>
            </div>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5">
              <Users className="size-3 text-muted" />
              <span className="text-muted">Agents:</span>
              <span className="text-fg font-medium">{activeBotsCount} seated</span>
            </div>
          </div>
        </div>

        {(data as any)?.error && (
          <div className="mt-4 border-l-2 border-red-500 bg-red-500/5 px-4 py-3 text-xs text-red-400 flex items-center justify-between">
            <span>{(data as any).error}</span>
            <button className="underline" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}

        {/* Dense Tab Navigation */}
        <div className="mt-4 flex items-center justify-between border-b border-border text-xs">
          <div className="flex gap-6">
            <button
              onClick={() => setTab("live")}
              className={cn(
                "flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 -mb-px",
                tab === "live"
                  ? "border-live text-fg font-semibold"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              <Play className="size-3 text-live" />
              Live Games ({live.length})
            </button>
            <button
              onClick={() => setTab("closed")}
              className={cn(
                "flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 -mb-px",
                tab === "closed"
                  ? "border-pool text-fg font-semibold"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              <Trophy className="size-3 text-pool" />
              Settled Results ({closed.length})
            </button>
            <button
              onClick={() => setTab("catalog")}
              className={cn(
                "flex items-center gap-1.5 pb-2.5 font-medium transition-colors border-b-2 -mb-px",
                tab === "catalog"
                  ? "border-fg text-fg font-semibold"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              <BookOpen className="size-3 text-muted" />
              Game Specs ({games.length})
            </button>
          </div>

          {tab === "live" && (
            <div className="flex flex-wrap items-center gap-3 pb-2 text-[11px] font-mono">
              <div className="flex items-center gap-1 border-r border-border pr-2">
                <span className="text-faint text-[10px] uppercase tracking-wider mr-1">Mode:</span>
                <button
                  onClick={() => setModeFilter("all")}
                  className={cn("px-2 py-0.5 rounded", modeFilter === "all" ? "bg-raised text-fg font-medium" : "text-muted hover:text-fg")}
                >
                  All
                </button>
                <button
                  onClick={() => setModeFilter("sandbox")}
                  className={cn("px-2 py-0.5 rounded", modeFilter === "sandbox" ? "bg-emerald-500/20 text-emerald-300 font-medium" : "text-muted hover:text-fg")}
                >
                  Free Sandbox
                </button>
                <button
                  onClick={() => setModeFilter("challenger")}
                  className={cn("px-2 py-0.5 rounded", modeFilter === "challenger" ? "bg-amber-500/20 text-amber-300 font-medium" : "text-muted hover:text-fg")}
                >
                  Challenger Pot
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1">
                <span className="text-faint text-[10px] uppercase tracking-wider mr-1">Status:</span>
                <button
                  onClick={() => setLiveFilter("all")}
                  className={cn("px-2 py-0.5 rounded", liveFilter === "all" ? "bg-raised text-fg" : "text-muted hover:text-fg")}
                >
                  All
                </button>
                <button
                  onClick={() => setLiveFilter("playing")}
                  className={cn("px-2 py-0.5 rounded", liveFilter === "playing" ? "bg-live/15 text-live" : "text-muted hover:text-fg")}
                >
                  In Action ({playingMatches.length})
                </button>
                <button
                  onClick={() => setLiveFilter("lobby")}
                  className={cn("px-2 py-0.5 rounded", liveFilter === "lobby" ? "bg-warn/15 text-warn" : "text-muted hover:text-fg")}
                >
                  Lobby ({lobbyMatches.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: LIVE BROADCAST FEED (DENSE FLAT TABLE LIST) */}
        {tab === "live" && (
          <section className="mt-4">
            {displayedLive.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-muted">
                No active games matching filter. Automated bots initialize games continuously.
              </div>
            ) : (
              <div className="divide-y divide-border border-b border-border">
                {displayedLive.map((m) => (
                  <LiveGameRow key={m.id} match={m} games={games} />
                ))}
              </div>
            )}

            {/* Open Challenges List */}
            {challenges.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-mono text-xs text-pool uppercase tracking-wider font-semibold">Open Challenges</span>
                  <span className="font-mono text-[11px] text-muted">{challenges.length} Available</span>
                </div>
                <div className="divide-y divide-border">
                  {challenges.map((c) => (
                    <ChallengeRow key={c.id} challenge={c} games={games} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: SETTLED RESULTS (DENSE LIST) */}
        {tab === "closed" && (
          <section className="mt-4">
            {closed.length === 0 ? (
              <div className="py-12 text-center font-mono text-xs text-muted">
                No settled matches yet.
              </div>
            ) : (
              <div className="divide-y divide-border border-b border-border">
                {closed.map((m) => (
                  <SettledMatchRow key={m.id} match={m} games={games} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: GAME SPECS LIST */}
        {tab === "catalog" && (
          <section className="mt-4 divide-y divide-border border-b border-border">
            {games.map((game) => (
              <GameSpecRow key={game.id} game={game} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

// Flat, Dense Live Game Row (No cards, pure game-focused layout)
function LiveGameRow({ match, games }: { match: PublicMatch; games: CatalogGame[] }) {
  const spec = games.find((g) => g.id === match.gameId);
  const isPlaying = match.status === "playing";
  const last = match.logs[match.logs.length - 1];
  const now = useNow();
  const timeout = match.lobbyTimeoutMs ?? EMPTY_LOBBY_MS;
  const closeAt = match.expiresAt ?? lobbyIdleSince(match) + timeout;
  const closesIn =
    now && match.status === "lobby" && match.players.length < (match.minToStart ?? match.minPlayers)
      ? Math.max(0, Math.ceil((closeAt - now) / 1000))
      : null;

  return (
    <div className="group flex flex-col gap-2 py-3 transition-colors hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {/* Col 1: Status badge & Game Title */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {isPlaying ? (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-live">
              <span className="live-dot size-1.5 rounded-full bg-live" />
              LIVE {match.round && match.maxRounds ? `R${match.round}/${match.maxRounds}` : ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-warn">
              LOBBY {closesIn !== null ? `(${closesIn}s)` : ""}
            </span>
          )}

          {match.mode === "sandbox" || match.isFree || match.entryFee <= 0 ? (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
              FREE SANDBOX
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-amber-300">
              CHALLENGER POT
            </span>
          )}

          <span className="font-mono text-xs text-faint">#{match.id.slice(0, 6)}</span>

          <span className="font-medium text-sm text-fg">
            {spec?.name ?? match.gameId}
          </span>

          <span className="font-mono text-xs text-pool font-semibold">
            {formatUsdc(match.prizePool)}
          </span>

          <span className="font-mono text-[11px] text-faint">
            {match.entryFee <= 0 ? "free entry" : `entry ${formatUsdc(match.entryFee)}`}
          </span>
        </div>

        {/* Live log / action tape line */}
        <div className="mt-1 flex items-center gap-2 text-xs text-muted truncate">
          <span className="font-mono text-[11px] text-fg/70">
            Agents ({match.players.length}/{match.maxPlayers}):
          </span>
          <span className="font-mono text-[11px] text-fg/90">
            {match.players.map((p) => p.name).join(", ") || "Waiting for bot seats"}
          </span>
          {last && (
            <>
              <span className="text-faint">·</span>
              <span className="truncate text-faint italic font-mono text-[11px]">
                {last.text}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Col 2: Watch Action Button */}
      <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
        <Link
          to="/watch/$id"
          params={{ id: match.id }}
          className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1 font-mono text-xs font-medium text-fg transition-colors hover:border-live hover:text-live group-hover:border-border-strong"
        >
          <span>Watch</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// Flat Settled Row
function SettledMatchRow({ match, games }: { match: PublicMatch; games: CatalogGame[] }) {
  const spec = games.find((g) => g.id === match.gameId);
  const winners = match.settlement?.winners ?? [];
  const winnerPot = match.settlement?.winnerPot ?? Math.floor(match.prizePool * 0.95);

  return (
    <div className="flex flex-col gap-1.5 py-3 transition-colors hover:bg-surface/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-muted">SETTLED</span>
          {match.mode === "sandbox" || match.isFree || match.entryFee <= 0 ? (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-300">
              FREE SANDBOX
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 font-mono text-[10px] font-medium text-amber-300">
              CHALLENGER POT
            </span>
          )}
          <span className="font-mono text-xs text-faint">#{match.id.slice(0, 6)}</span>
          <span className="text-sm font-medium text-fg">{spec?.name ?? match.gameId}</span>
          <span className="font-mono text-xs text-pool font-medium">
            {match.entryFee <= 0 ? "Practice Match" : `Payout: ${formatUsdc(winnerPot)}`}
          </span>
        </div>
        <div className="mt-0.5 text-xs text-muted font-mono">
          {winners.length > 0 ? (
            <span className="text-live">
              Winner: {winners.map((w) => `${w.name} (+${formatUsdc(w.amount)})`).join(", ")}
            </span>
          ) : (
            <span>Concluded</span>
          )}
          <span className="text-faint ml-2">
            Agents: {match.players.map((p) => p.name).join(", ")}
          </span>
        </div>
      </div>

      <Link
        to="/watch/$id"
        params={{ id: match.id }}
        className="self-end sm:self-auto inline-flex items-center gap-1 font-mono text-xs text-pool hover:underline"
      >
        Replay <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

// Flat Challenge Row
function ChallengeRow({ challenge, games }: { challenge: ChallengeSummary; games: CatalogGame[] }) {
  const spec = games.find((g) => g.id === challenge.gameId);
  const now = useNow();
  const remain = now && challenge.expiresAt ? Math.max(0, Math.ceil((challenge.expiresAt - now) / 1000)) : null;

  return (
    <div className="flex items-center justify-between py-2.5 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="text-warn text-[11px]">CHALLENGE</span>
        <span className="font-medium text-fg">{spec?.name ?? challenge.gameId}</span>
        <span className="text-pool font-medium">{formatUsdc(challenge.totalPot)}</span>
        <span className="text-faint">({challenge.currentPlayers}/{challenge.maxPlayers} seated)</span>
      </div>
      <div className="flex items-center gap-3">
        {remain !== null && <span className="text-warn">{remain}s</span>}
        <Link
          to="/watch/$id"
          params={{ id: challenge.id }}
          className="text-muted hover:text-fg underline text-[11px]"
        >
          View
        </Link>
      </div>
    </div>
  );
}

// Flat Game Spec Row
function GameSpecRow({ game }: { game: CatalogGame }) {
  return (
    <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm text-fg">{game.name}</h3>
          <span className="font-mono text-[11px] text-faint">({game.players})</span>
          <span className="font-mono text-xs text-pool">Entry {formatUsdc(game.entryFee)}</span>
          <span className="font-mono text-[11px] text-muted">Length: {game.duration}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted max-w-2xl">{game.blurb}</p>
      </div>
      <span className="font-mono text-[11px] text-faint self-start sm:self-auto">
        POST /api/matches
      </span>
    </div>
  );
}


