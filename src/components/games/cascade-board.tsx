import { useMemo } from "react";
import type { Player } from "@/lib/engine/types";
import type { CascadePublicState } from "@/lib/games/cascade";
import { Token } from "@/components/player-chip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CascadeBoard({
  state,
  players,
}: {
  state: CascadePublicState;
  players: Player[];
}) {
  const {
    currentTick = 0,
    totalTicks = 25,
    assetSymbol = "ETH-PERP",
    currentPrice = 3200,
    priceChangePct = 0,
    priceHistory = [],
    positions = {},
    resolved = false,
    oracleSource,
    oracleBlockNumber,
    chainlinkPriceUsd,
  } = state;

  const initialPrice = priceHistory[0] ?? currentPrice;
  const minPrice = useMemo(() => Math.min(...priceHistory, currentPrice * 0.95), [priceHistory, currentPrice]);
  const maxPrice = useMemo(() => Math.max(...priceHistory, currentPrice * 1.05), [priceHistory, currentPrice]);

  const positionList = useMemo(() => {
    if (Array.isArray(positions)) return positions;
    return Object.entries(positions || {}).map(([playerId, pos]) => ({
      playerId,
      ...pos,
    }));
  }, [positions]);

  return (
    <div className="space-y-4" id="cascade-arena">
      {/* Header Margin Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-base border border-amber-500/20">
            15x
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-tight">
                {assetSymbol}
              </span>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                {oracleSource ?? "Chainlink Base L2 (ETH/USD)"}
              </Badge>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono bg-muted/40">
                High-Leverage Squeeze
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>Index: <strong className="text-foreground font-mono">${currentPrice.toFixed(2)}</strong></span>
              <span>•</span>
              <span className={cn("font-mono font-medium", priceChangePct >= 0 ? "text-emerald-400" : "text-rose-400")}>
                {priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%
              </span>
              <span>•</span>
              <span>Initial: <strong className="text-muted-foreground font-mono">${initialPrice.toFixed(2)}</strong></span>
              {chainlinkPriceUsd ? (
                <>
                  <span>•</span>
                  <span>Oracle Ref: <strong className="text-emerald-400 font-mono">${chainlinkPriceUsd.toFixed(2)}</strong></span>
                </>
              ) : null}
              {oracleBlockNumber ? (
                <>
                  <span>•</span>
                  <span className="text-[11px] text-muted-foreground font-mono">Block #{oracleBlockNumber}</span>
                </>
              ) : null}
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
              !resolved && "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
            )}
          >
            {resolved ? "SETTLED" : "MARGIN ARENA LIVE"}
          </Badge>
        </div>
      </div>

      {/* Sparkline & Price History Strip */}
      <div className="rounded-lg border border-border/70 bg-card/40 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="font-mono uppercase tracking-wider">Perp Index Trajectory</span>
          <span className="font-mono text-[11px]">Range: ${minPrice.toFixed(1)} – ${maxPrice.toFixed(1)}</span>
        </div>
        <div className="h-16 w-full flex items-end gap-1 pt-2">
          {priceHistory.map((p, i) => {
            const h = Math.max(10, Math.min(100, ((p - minPrice) / (maxPrice - minPrice || 1)) * 100));
            const isLatest = i === priceHistory.length - 1;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end items-center group relative"
              >
                <div
                  style={{ height: `${h}%` }}
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300",
                    isLatest
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                      : p >= initialPrice
                      ? "bg-emerald-500/60"
                      : "bg-rose-500/60"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Leveraged Margin Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {positionList.map((pos) => {
          const player = players.find((p) => p.id === pos.playerId);
          const pName = player?.name ?? pos.playerId;
          const collateral = pos.collateralUsd || 10000;
          const equity = pos.totalEquityUsd ?? (pos.isLiquidated ? 0 : collateral + (pos.unrealizedPnlUsd || 0));
          const healthRatio = pos.isLiquidated ? 0 : Math.max(0, +(equity / (collateral * 0.1 || 1)).toFixed(2));
          const isDanger = healthRatio < 1.35 && !pos.isLiquidated;
          const isLiq = Boolean(pos.isLiquidated);
          const liqPrice = pos.liquidationPrice ?? 0;
          const bounties = Math.floor((pos.bountiesCollectedUsd ?? 0) / 200);

          return (
            <div
              key={pos.playerId}
              className={cn(
                "rounded-lg border p-3.5 transition-all bg-card/50",
                isLiq
                  ? "border-rose-900/50 bg-rose-950/20 opacity-60"
                  : isDanger
                  ? "border-amber-500/60 bg-amber-950/15 ring-1 ring-amber-500/30"
                  : "border-border/70"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Token tint={player?.tint} name={pName} size="sm" />
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      {pName}
                      {player?.controller === "bot" && (
                        <span className="text-[10px] text-muted-foreground font-mono font-normal">(BOT)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      Liq Price: <span className="text-rose-400 font-semibold">${liqPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={isLiq ? "destructive" : pos.side === "long" ? "default" : pos.side === "short" ? "secondary" : "outline"}
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      pos.side === "long" && !isLiq && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                      pos.side === "short" && !isLiq && "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
                    )}
                  >
                    {isLiq ? "LIQUIDATED" : `${pos.leverage ?? 15}x ${pos.side ?? "flat"}`}
                  </Badge>
                  <div className="text-xs font-mono font-bold mt-1 text-foreground">
                    ${equity.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Health Bar */}
              {!isLiq && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span>Margin Health</span>
                    <span className={cn(
                      "font-semibold",
                      healthRatio < 1.2 ? "text-rose-400 animate-pulse" : healthRatio < 1.5 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {healthRatio.toFixed(2)}x
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        healthRatio < 1.2 ? "bg-rose-500" : healthRatio < 1.5 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, Math.max(0, (healthRatio / 2.5) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-3 pt-2 border-t border-border/40">
                <span>Unrealized PnL: <strong className={cn((pos.unrealizedPnlUsd ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {(pos.unrealizedPnlUsd ?? 0) >= 0 ? "+" : ""}${(pos.unrealizedPnlUsd ?? 0).toFixed(2)}
                </strong></span>
                <span>Bounties: <strong className="text-amber-400">{bounties}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
