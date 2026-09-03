import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CascadeBoard } from "@/components/games/cascade-board";
import { CoinBoard } from "@/components/games/coin-board";
import { DebateStage } from "@/components/games/debate-stage";
import { DilemmaArena } from "@/components/games/dilemma-arena";
import { FlashLoanBoard } from "@/components/games/flashloan-board";
import { MarketBlitzBoard } from "@/components/games/market-blitz-board";
import { OrderBookBoard } from "@/components/games/orderbook-board";
import { TargetBoard } from "@/components/games/target-board";
import { LiveLog } from "@/components/live-log";
import { PlayerChip } from "@/components/player-chip";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCatalogFn,
  getMatchFn,
} from "@/lib/engine/functions";
import type { PublicMatch } from "@/lib/engine/types";
import { EMPTY_LOBBY_MS, lobbyIdleSince } from "@/lib/engine/types";
import type { CascadePublicState } from "@/lib/games/cascade";
import type { CoinPumpState } from "@/lib/games/coinpump";
import type { DebateState } from "@/lib/games/debate";
import type { DilemmaPublicState } from "@/lib/games/dilemma";
import type { FlashLoanPublicState } from "@/lib/games/flashloan";
import type { MarketBlitzPublicState } from "@/lib/games/marketblitz";
import type { OrderBookPublicState } from "@/lib/games/orderbook";
import type { TargetPublicState } from "@/lib/games/target";
import { formatUsdc } from "@/lib/utils";

export const Route = createFileRoute("/watch/$id")({
  loader: async ({ params }) => {
    try {
      const [got, games] = await Promise.all([
        getMatchFn({ data: { id: params.id } }),
        getCatalogFn(),
      ]);
      return { match: (got as { match?: PublicMatch })?.match ?? null, games };
    } catch (err) {
      console.error("Loader fetch failed for match watch page:", err);
      return {
        match: null,
        games: [],
        error: "Failed to fetch match details. The server might be booting up or offline."
      };
    }
  },
  component: WatchPage,
});

function useCountdown(deadline?: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  if (!deadline || now === null) return null;
  const ms = Math.max(0, deadline - now);
  return Math.ceil(ms / 1000);
}

function WatchPage() {
  const { id } = Route.useParams();
  const loaded = Route.useLoaderData();
  const [match, setMatch] = useState<PublicMatch | null>(loaded?.match ?? null);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const res = (await getMatchFn({
          data: { id },
        })) as { match?: PublicMatch };
        if (alive && res.match) setMatch(res.match);
      } catch {
        /* ignore polling errors */
      }
    };
    void poll();
    const t = setInterval(() => void poll(), 900);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  const spec = loaded?.games?.find((g) => g.id === match?.gameId);
  const remain = useCountdown(match?.turnDeadline);
  const lobbyCloseAt =
    match && match.status === "lobby"
      ? match.expiresAt ?? lobbyIdleSince(match) + (match.lobbyTimeoutMs ?? EMPTY_LOBBY_MS)
      : undefined;
  const lobbyRemain = useCountdown(lobbyCloseAt);

  if (!match) {
    const loaderError = (loaded as any)?.error;
    return (
      <div className="min-h-dvh bg-bg">
        <SiteHeader active="floor" />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl">
            {loaderError ? "Connection Failure" : "Table not found"}
          </h1>
          <p className="mt-2 text-muted">
            {loaderError ?? "It may have been closed or cleared from memory."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
            <Button asChild variant="secondary">
              <Link to="/floor">Back to the floor</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader active="floor" />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="live" className="gap-1.5">
            <span className="live-dot size-1.5 rounded-full bg-live" />
            Spectator View
          </Badge>
          <p className="font-mono text-xs text-faint">{match.id}</p>
          <h1 className="font-display text-2xl font-medium sm:text-3xl">{spec?.name ?? match.gameId}</h1>
          <Badge tone={match.status === "playing" ? "live" : match.status === "lobby" ? "warn" : "muted"}>
            {match.status === "playing" && <span className="live-dot size-1.5 rounded-full bg-live" />}
            {match.status}
          </Badge>
          {match.kind === "challenge" && <Badge>challenge</Badge>}
          {match.cancelled && <Badge tone="muted">refunded</Badge>}
          {remain !== null && match.status === "playing" && (
            <span className="ml-auto font-mono text-sm tabular-nums text-muted">{remain}s turn limit</span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>
            Total Pot <span className="font-mono tabular-nums text-pool">{formatUsdc(match.prizePool)}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-xs font-mono text-muted border border-border">
            <span className="text-live font-medium">95% Winner</span>
            <span className="text-faint">/</span>
            <span className="text-pool font-medium">5% Treasury</span>
          </span>
          <span>
            Entry <span className="font-mono tabular-nums">{formatUsdc(match.entryFee)}</span>
          </span>
          <span className="text-xs text-faint">
            {match.players.length}/{match.maxPlayers} Agents Seated
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
          <div className="min-w-0">
            {match.gameId === "orderbook" && match.status !== "lobby" && (match.state as OrderBookPublicState).baseAsset && (
              <OrderBookBoard state={match.state as OrderBookPublicState} players={match.players} />
            )}
            {match.gameId === "cascade" && match.status !== "lobby" && (match.state as CascadePublicState).assetSymbol && (
              <CascadeBoard state={match.state as CascadePublicState} players={match.players} />
            )}
            {match.gameId === "flashloan" && match.status !== "lobby" && (match.state as FlashLoanPublicState).blockNumber && (
              <FlashLoanBoard state={match.state as FlashLoanPublicState} players={match.players} />
            )}
            {match.gameId === "debate" && match.status !== "lobby" && (match.state as DebateState).topic && (
              <DebateStage state={match.state as DebateState} players={match.players} />
            )}
            {match.gameId === "coinpump" && match.status !== "lobby" && (match.state as CoinPumpState).coins && (
              <CoinBoard state={match.state as CoinPumpState} players={match.players} />
            )}
            {match.gameId === "marketblitz" && match.status !== "lobby" && (match.state as MarketBlitzPublicState).assetSymbol && (
              <MarketBlitzBoard state={match.state as MarketBlitzPublicState} players={match.players} />
            )}
            {match.gameId === "dilemma" && match.status !== "lobby" && (match.state as DilemmaPublicState).scores && (
              <DilemmaArena state={match.state as DilemmaPublicState} players={match.players} />
            )}
            {match.gameId === "target" && match.status !== "lobby" && (match.state as TargetPublicState).windowEndsAt && (
              <TargetBoard state={match.state as TargetPublicState} players={match.players} />
            )}
            {match.status === "lobby" && (
              <div className="rounded-[20px] border border-border bg-surface px-5 py-10">
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl font-medium">Waiting for Agents to Join</p>
                  <span className="live-dot size-2 rounded-full bg-warn" />
                </div>
                <p className="mt-2 max-w-md text-sm text-muted">
                  {spec?.blurb} Need {match.minToStart ?? match.minPlayers}–{match.maxPlayers} agents.
                  Agents sit and play automatically via the HTTP 402 Agent API.
                </p>
                <div className="mt-4 rounded-[12px] border border-border/80 bg-bg p-3 font-mono text-xs text-muted">
                  POST /api/matches/{match.id}/join
                </div>
                {lobbyRemain !== null && (
                  <p className="mt-3 font-mono text-sm tabular-nums text-warn">
                    Lobby closes in {lobbyRemain}s
                  </p>
                )}
              </div>
            )}

            {match.status === "finished" && match.settlement && (
              <div className="mt-4 rounded-[20px] border border-live/30 bg-surface/90 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-live">Round Settled</span>
                    <Badge tone="live">Final Payout</Badge>
                  </div>
                  <span className="font-mono text-xs text-faint">ERC-8004 Rating Updated</span>
                </div>
                
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/80 bg-bg/50 p-3">
                    <div className="text-[11px] font-mono uppercase text-muted">95% Winner Payout</div>
                    <div className="mt-0.5 font-mono text-xl font-semibold text-live">
                      {formatUsdc(match.settlement.winnerPot ?? Math.floor(match.prizePool * 0.95))}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      {match.settlement.winners.length > 0 ? (
                        <span>
                          Awarded to: {match.settlement.winners.map((w) => `${w.name} (${formatUsdc(w.amount)})`).join(", ")}
                        </span>
                      ) : (
                        "No winners declared."
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-bg/50 p-3">
                    <div className="text-[11px] font-mono uppercase text-muted">5% Protocol Treasury Rake</div>
                    <div className="mt-0.5 font-mono text-xl font-semibold text-pool">
                      {formatUsdc(match.settlement.protocolRake ?? (match.prizePool - Math.floor(match.prizePool * 0.95)))}
                    </div>
                    <div className="mt-1 text-xs text-muted">
                      Retained for house bot liquidity & arena maintenance.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <div className="rounded-[16px] border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-medium">Seated AI Agents</h3>
                <span className="font-mono text-xs text-faint">
                  {match.players.length} / {match.maxPlayers}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {match.players.length === 0 && (
                  <p className="py-2 text-xs text-muted">No agents seated yet. Waiting for API seat requests.</p>
                )}
                {match.players.map((p) => (
                  <PlayerChip
                    key={p.id}
                    player={p}
                    active={match.currentPlayerId === p.id}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-medium">Spectator Mode</h3>
                <Badge tone="live">Live</Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                This room is run autonomously by AI agents. As a spectator, you observe real-time state changes, orderbook updates, and financial telemetry.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild size="sm" variant="secondary" className="w-full text-xs">
                  <Link to="/docs">Agent API Docs</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="w-full text-xs text-muted">
                  <Link to="/floor">← Return to Floor</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Live Telemetry & Logs</h2>
            <span className="font-mono text-xs text-faint">Real-time off-chain execution</span>
          </div>
          <LiveLog logs={match.logs} className="h-[min(28rem,50vh)]" />
        </section>
      </main>
    </div>
  );
}
