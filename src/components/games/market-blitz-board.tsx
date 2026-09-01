import { useMemo } from "react";
import type { Player } from "@/lib/engine/types";
import type { MarketBlitzPublicState, MarketCandle } from "@/lib/games/marketblitz";
import { Token } from "@/components/player-chip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MarketBlitzBoard({
  state,
  players,
}: {
  state: MarketBlitzPublicState;
  players: Player[];
}) {
  const {
    currentTick,
    totalTicks,
    assetSymbol,
    regimeHint,
    currentPrice,
    priceChangePct,
    warmupCandles = [],
    liveCandles = [],
    portfolios = {},
    resolved,
    sourceEventName,
    leaderboard = [],
  } = state;

  const allVisibleCandles: MarketCandle[] = useMemo(() => {
    return [...warmupCandles, ...liveCandles];
  }, [warmupCandles, liveCandles]);

  // Chart scaling
  const chartMetrics = useMemo(() => {
    if (allVisibleCandles.length === 0) {
      return { minP: 90, maxP: 110, maxV: 1000 };
    }
    let minP = Infinity;
    let maxP = -Infinity;
    let maxV = 0;
    for (const c of allVisibleCandles) {
      if (c.l < minP) minP = c.l;
      if (c.h > maxP) maxP = c.h;
      if (c.v > maxV) maxV = c.v;
    }
    const pad = Math.max(0.5, (maxP - minP) * 0.08);
    return {
      minP: minP - pad,
      maxP: maxP + pad,
      maxV: Math.max(100, maxV),
    };
  }, [allVisibleCandles]);

  const width = 640;
  const height = 220;
  const priceAreaHeight = 160;
  const volumeAreaHeight = 45;
  const candleWidth = Math.max(4, Math.min(12, (width - 40) / Math.max(30, allVisibleCandles.length)));
  const gap = (width - 40) / Math.max(1, allVisibleCandles.length);

  const getY = (price: number) => {
    const range = chartMetrics.maxP - chartMetrics.minP || 1;
    const ratio = (price - chartMetrics.minP) / range;
    return priceAreaHeight - ratio * priceAreaHeight;
  };

  const getVolY = (vol: number) => {
    const ratio = vol / (chartMetrics.maxV || 1);
    return height - ratio * volumeAreaHeight;
  };

  const isUp = priceChangePct >= 0;
  const playerMap = useMemo(() => {
    return new Map(players.map((p) => [p.id, p]));
  }, [players]);

  return (
    <div className="flex flex-col gap-4">
      {/* Ticker Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-pool" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold tracking-wider text-fg">
                {assetSymbol || "SYNTH-ALPHA"}
              </span>
              <Badge variant="outline" className="text-[10px] tracking-wider uppercase opacity-80">
                {regimeHint?.replace(/_/g, " ") || "MARKET BLITZ"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted">Historical Seed Simulation (Normalized Base 100)</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-mono text-xl font-bold tabular-nums text-fg">
              ${currentPrice.toFixed(2)}
            </p>
            <p
              className={cn(
                "font-mono text-xs font-medium tabular-nums",
                isUp ? "text-live" : "text-danger",
              )}
            >
              {isUp ? "+" : ""}
              {priceChangePct.toFixed(2)}%
            </p>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
              Tick {currentTick} / {totalTicks}
            </span>
            <div className="mt-1 h-2 w-24 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full bg-pool transition-all duration-300"
                style={{ width: `${Math.min(100, (currentTick / totalTicks) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historical Event Reveal Banner */}
      {resolved && sourceEventName && (
        <div className="flex items-center gap-3 rounded-[14px] border border-pool/30 bg-pool/10 px-4 py-3 text-sm text-fg">
          <span className="text-lg">🏛️</span>
          <div>
            <p className="font-semibold text-pool">Historical Event Revealed</p>
            <p className="text-xs text-muted">{sourceEventName}</p>
          </div>
        </div>
      )}

      {/* Interactive Candlestick Chart Area */}
      <div className="relative overflow-hidden rounded-[16px] border border-border bg-bg p-3">
        <div className="absolute right-3 top-3 z-10 flex gap-2 text-[10px] font-mono text-muted">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-muted/40" /> Warmup (t &lt; 0)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-live" /> Live Ticks
          </span>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full touch-none select-none overflow-visible"
        >
          {/* Background Grid Lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1={0}
              y1={priceAreaHeight * pct}
              x2={width}
              y2={priceAreaHeight * pct}
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-border/40"
            />
          ))}

          {/* Volume Separator */}
          <line
            x1={0}
            y1={priceAreaHeight + 8}
            x2={width}
            y2={priceAreaHeight + 8}
            stroke="currentColor"
            className="text-border/50"
          />

          {/* Warmup / Live Boundary Marker */}
          {warmupCandles.length > 0 && (
            <line
              x1={20 + warmupCandles.length * gap}
              y1={0}
              x2={20 + warmupCandles.length * gap}
              y2={height}
              stroke="#eab308"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              opacity={0.6}
            />
          )}

          {/* Render Candlesticks & Volume Bars */}
          {allVisibleCandles.map((c, i) => {
            const x = 20 + i * gap;
            const isWarmup = c.t < 0;
            const candleUp = c.c >= c.o;
            const yOpen = getY(c.o);
            const yClose = getY(c.c);
            const yHigh = getY(c.h);
            const yLow = getY(c.l);
            const bodyY = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yOpen - yClose));
            const volY = getVolY(c.v);
            const volH = Math.max(1, height - volY);

            const colorClass = isWarmup
              ? "text-muted/50 fill-muted/30"
              : candleUp
                ? "text-emerald-400 fill-emerald-500/80"
                : "text-rose-500 fill-rose-500/80";

            return (
              <g key={i} className="transition-all duration-200">
                {/* Wick */}
                <line
                  x1={x}
                  y1={yHigh}
                  x2={x}
                  y2={yLow}
                  stroke="currentColor"
                  strokeWidth={1.2}
                  className={colorClass}
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyY}
                  width={candleWidth}
                  height={bodyH}
                  rx={1}
                  stroke="currentColor"
                  strokeWidth={1}
                  className={colorClass}
                />
                {/* Volume Bar */}
                <rect
                  x={x - candleWidth / 2}
                  y={volY}
                  width={candleWidth}
                  height={volH}
                  className={isWarmup ? "fill-muted/20" : candleUp ? "fill-emerald-500/30" : "fill-rose-500/30"}
                />
              </g>
            );
          })}

          {/* Current Price Marker */}
          <line
            x1={0}
            y1={getY(currentPrice)}
            x2={width}
            y2={getY(currentPrice)}
            stroke={isUp ? "#10b981" : "#f43f5e"}
            strokeDasharray="2 2"
            strokeWidth={1.5}
          />
        </svg>
      </div>

      {/* Leaderboard & Agent Positions */}
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Portfolios &amp; Market Positions
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {leaderboard.map((item, idx) => {
            const player = playerMap.get(item.playerId);
            const pf = portfolios[item.playerId];
            if (!pf) return null;

            const isLeader = idx === 0 && !item.liquidated;
            const retUp = item.returnPct >= 0;

            return (
              <div
                key={item.playerId}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[14px] border p-3 transition-colors",
                  item.liquidated
                    ? "border-danger/30 bg-danger/5 opacity-60"
                    : isLeader
                      ? "border-pool/40 bg-pool/5"
                      : "border-border bg-surface",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-muted">#{idx + 1}</span>
                  {player && <Token tint={player.tint} name={player.name} size="sm" />}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-fg">
                        {player?.name ?? "Agent"}
                      </span>
                      {player?.controller === "bot" && (
                        <Badge variant="outline" className="px-1 text-[9px]">
                          BOT
                        </Badge>
                      )}
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      {item.liquidated ? (
                        <span className="font-mono text-[11px] font-bold text-danger">
                          💀 LIQUIDATED
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase",
                            pf.position === "long"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : pf.position === "short"
                                ? "bg-rose-500/15 text-rose-400"
                                : "bg-muted/20 text-muted",
                          )}
                        >
                          {pf.position} {pf.position !== "flat" && `${pf.leverage}x`}
                        </span>
                      )}
                      {pf.protectedStop && (
                        <span className="text-[10px] text-pool">🛡️ Shield</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="text-sm font-semibold tabular-nums text-fg">
                    ${item.equityUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] font-medium tabular-nums",
                      retUp ? "text-live" : "text-danger",
                    )}
                  >
                    {retUp ? "+" : ""}
                    {item.returnPct.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
