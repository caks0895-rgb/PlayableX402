import { useMemo } from "react";
import type { Player } from "@/lib/engine/types";
import type { OrderBookPublicState } from "@/lib/games/orderbook";
import { Token } from "@/components/player-chip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function OrderBookBoard({
  state,
  players,
}: {
  state: OrderBookPublicState;
  players: Player[];
}) {
  const {
    currentTick = 0,
    totalTicks = 25,
    baseAsset = "RAID",
    quoteAsset = "USDC",
    midPrice = 100,
    spreadBps = 15,
    bids = [],
    asks = [],
    recentTrades = [],
    marketRegime = "ORDER_BOOK_SQUEEZE",
    leaderboard = [],
    resolved = false,
  } = state;

  const maxBidVol = useMemo(() => Math.max(...bids.map((b) => b.size ?? 10), 100), [bids]);
  const maxAskVol = useMemo(() => Math.max(...asks.map((a) => a.size ?? 10), 100), [asks]);

  const bestBid = bids[0]?.price ?? midPrice;
  const bestAsk = asks[0]?.price ?? midPrice;

  return (
    <div className="space-y-4" id="orderbook-arena">
      {/* Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-base border border-emerald-500/20">
            {baseAsset.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-tight">
                {baseAsset} / {quoteAsset}
              </span>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono bg-muted/40">
                {marketRegime.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>Mid: <strong className="text-foreground font-mono">${midPrice.toFixed(2)}</strong></span>
              <span>•</span>
              <span>Spread: <strong className="text-amber-400 font-mono">{spreadBps} bps</strong></span>
              <span>•</span>
              <span>Best Bid: <strong className="text-emerald-400 font-mono">${bestBid.toFixed(2)}</strong></span>
              <span>•</span>
              <span>Best Ask: <strong className="text-rose-400 font-mono">${bestAsk.toFixed(2)}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tick Clock</div>
            <div className="font-mono text-sm font-bold text-foreground">
              {currentTick} / {totalTicks}
            </div>
          </div>
          <div className="h-8 w-px bg-border/60 mx-1" />
          <Badge
            variant={resolved ? "secondary" : "default"}
            className={cn(
              "font-mono text-xs px-2.5 py-1",
              !resolved && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse"
            )}
          >
            {resolved ? "SETTLED" : "ORDER BOOK LIVE"}
          </Badge>
        </div>
      </div>

      {/* Main Grid: Depth Ladder (Left) + Trade Tape & Arb Scanner (Right) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Order Book Depth Ladder */}
        <div className="lg:col-span-7 rounded-lg border border-border/70 bg-card/40 p-4">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Level 2 Depth Ladder
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Depth Ratio: {((bids.reduce((a, b) => a + (b.size ?? 0), 0) / Math.max(1, asks.reduce((a, b) => a + (b.size ?? 0), 0)))).toFixed(2)}x
            </span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            {/* Header */}
            <div className="grid grid-cols-4 text-[10px] font-sans uppercase text-muted-foreground px-2 py-1">
              <span>Price ($)</span>
              <span className="text-right">Size ({baseAsset})</span>
              <span className="text-right">Total ($)</span>
              <span className="text-right">Orders</span>
            </div>

            {/* Asks (Red / Sell Orders) - Inverted order so lowest ask is closest to spread */}
            <div className="space-y-0.5">
              {[...asks].reverse().slice(0, 5).map((ask, i) => {
                const size = ask.size ?? 10;
                const depthPct = Math.min(100, Math.round((size / maxAskVol) * 100));
                return (
                  <div
                    key={`ask-${i}-${ask.price}`}
                    className="relative grid grid-cols-4 items-center px-2 py-1 rounded bg-rose-500/5 text-rose-300 overflow-hidden"
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none transition-all duration-300"
                      style={{ width: `${depthPct}%` }}
                    />
                    <span className="font-semibold text-rose-400 relative z-10">${ask.price.toFixed(2)}</span>
                    <span className="text-right relative z-10">{size.toFixed(0)}</span>
                    <span className="text-right text-muted-foreground relative z-10">
                      ${(ask.price * size).toFixed(0)}
                    </span>
                    <span className="text-right text-[10px] text-muted-foreground relative z-10 truncate pl-2">
                      {ask.ordersCount ?? 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Spread Divider */}
            <div className="my-2 py-1.5 px-3 rounded bg-muted/40 border border-border/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-sans">Spread Delta</span>
              <span className="font-bold text-amber-400">
                ${(bestAsk - bestBid).toFixed(2)} ({spreadBps} bps)
              </span>
              <span className="text-muted-foreground text-[10px]">Mid: ${midPrice.toFixed(2)}</span>
            </div>

            {/* Bids (Green / Buy Orders) */}
            <div className="space-y-0.5">
              {bids.slice(0, 5).map((bid, i) => {
                const size = bid.size ?? 10;
                const depthPct = Math.min(100, Math.round((size / maxBidVol) * 100));
                return (
                  <div
                    key={`bid-${i}-${bid.price}`}
                    className="relative grid grid-cols-4 items-center px-2 py-1 rounded bg-emerald-500/5 text-emerald-300 overflow-hidden"
                  >
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none transition-all duration-300"
                      style={{ width: `${depthPct}%` }}
                    />
                    <span className="font-semibold text-emerald-400 relative z-10">${bid.price.toFixed(2)}</span>
                    <span className="text-right relative z-10">{size.toFixed(0)}</span>
                    <span className="text-right text-muted-foreground relative z-10">
                      ${(bid.price * size).toFixed(0)}
                    </span>
                    <span className="text-right text-[10px] text-muted-foreground relative z-10 truncate pl-2">
                      {bid.ordersCount ?? 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Trades & Arbitrage Flash Scanner */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Flash Arbitrage Opportunities */}
          <div className="rounded-lg border border-border/70 bg-card/40 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Flash DEX Arbitrage
              </span>
              <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                L2 Cross-Route
              </Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/40">
                <div>
                  <div className="font-mono text-foreground font-semibold">DEX-A ↔ DEX-B Divergence</div>
                  <div className="text-[10px] text-muted-foreground">Route: BUY DEX-A / SELL DEX-B</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-emerald-400 font-bold">+{((spreadBps * 1.8) / 100).toFixed(2)}%</div>
                  <div className="text-[10px] text-muted-foreground">Net Yield</div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground leading-tight">
                Send action <code className="text-emerald-400 font-mono">market_buy</code> or <code className="text-emerald-400 font-mono">market_sell</code> to capture momentum and cross the spread.
              </div>
            </div>
          </div>

          {/* Recent Trade Tape */}
          <div className="rounded-lg border border-border/70 bg-card/40 p-4 flex-1">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Match Trade Tape
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
            </div>

            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 font-mono text-xs">
              {recentTrades.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-xs font-sans">
                  Awaiting order matches...
                </div>
              ) : (
                recentTrades.slice(-6).reverse().map((trade) => {
                  const size = trade.size ?? (trade as unknown as { amount?: number }).amount ?? 10;
                  const isBuy = trade.side === "bid" || (trade.side as string) === "buy";
                  return (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between py-1 px-2 rounded bg-muted/20 border border-border/20 text-[11px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isBuy ? "bg-emerald-400" : "bg-rose-400"
                          )}
                        />
                        <span className={isBuy ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                          {isBuy ? "BUY" : "SELL"}
                        </span>
                        <span className="text-foreground">${trade.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{size.toFixed(0)} {baseAsset}</span>
                        <span className="text-[10px] opacity-70">
                          {new Date(trade.ts || Date.now()).toLocaleTimeString([], { second: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Raider Portfolio Leaderboard */}
      <div className="rounded-lg border border-border/70 bg-card/40 p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Raider Portfolios & Equity Standings
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Initial Capital: $25,000.00
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {leaderboard.map((item, idx) => {
            const player = players.find((p) => p.id === item.playerId);
            const pName = player?.name ?? item.playerId;
            const pnl = item.realizedPnlUsd ?? 0;
            const isProfit = pnl >= 0;
            const rank = idx + 1;
            const equity = item.totalEquityUsd ?? 25000;

            return (
              <div
                key={item.playerId}
                className={cn(
                  "p-3 rounded-lg border transition-all",
                  rank === 1
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                    : "border-border/60 bg-card/60"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-mono font-bold text-foreground">
                      #{rank}
                    </span>
                    <Token tint={player?.tint ?? "p1"} name={pName} size="sm" />
                    <span className="font-semibold text-sm text-foreground truncate max-w-[120px]">
                      {pName}
                    </span>
                  </div>
                  {player?.controller === "bot" && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                      BOT
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-sans">Total Equity:</span>
                    <span className="font-bold text-foreground">
                      ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-sans">Realized PnL:</span>
                    <span className={cn("font-semibold", isProfit ? "text-emerald-400" : "text-rose-400")}>
                      {isProfit ? "+" : ""}${pnl.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                    <span>Vol: ${(item.volumeUsd ?? 0).toLocaleString()}</span>
                    <span>Score: {item.score ?? 1000}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
