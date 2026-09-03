import { useMemo } from "react";
import type { Player } from "@/lib/engine/types";
import type { FlashLoanPublicState } from "@/lib/games/flashloan";
import { Token } from "@/components/player-chip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FlashLoanBoard({
  state,
  players,
}: {
  state: FlashLoanPublicState;
  players: Player[];
}) {
  const {
    currentTick = 0,
    totalTicks = 20,
    blockNumber = 19482000,
    gasPriceGwei = 45,
    activeOpportunities = [],
    blockHistory = [],
    leaderboard = [],
    resolved = false,
  } = state;

  const currentRound = (state as unknown as { currentRound?: number }).currentRound ?? currentTick;
  const totalRounds = (state as unknown as { totalRounds?: number }).totalRounds ?? totalTicks;

  const poolList = useMemo(() => {
    if (activeOpportunities && activeOpportunities.length > 0) {
      return activeOpportunities.map((opp) => {
        const rawPair = opp.dexPair || "";
        const parts = rawPair.includes("↔")
          ? rawPair.split("↔").map((s) => s.trim())
          : rawPair.includes("-")
          ? rawPair.split("-").map((s) => s.trim())
          : ["Uniswap V3", "Curve"];

        const dexA = parts[0] || "Uniswap V3";
        const dexB = parts[1] || "Curve";

        return {
          id: opp.id,
          pair: opp.dexPair || "ETH / USDC",
          dexA,
          dexB,
          priceSpreadBps: opp.spreadBps ?? 45,
          estProfitUsd: opp.availableProfitUsd ?? 1500,
          requiredLoanUsd: opp.minLoanSizeUsd ?? 250000,
        };
      });
    }
    return [
      {
        id: "univ3-crv-eth",
        pair: "ETH / USDC",
        dexA: "Uniswap V3",
        dexB: "Curve",
        priceSpreadBps: 42,
        estProfitUsd: 1450,
        requiredLoanUsd: 250000,
      },
      {
        id: "sushi-bal-wbtc",
        pair: "WBTC / USDT",
        dexA: "Sushiswap",
        dexB: "Balancer",
        priceSpreadBps: 38,
        estProfitUsd: 2180,
        requiredLoanUsd: 500000,
      },
      {
        id: "pancake-univ3-arb",
        pair: "ARB / ETH",
        dexA: "PancakeSwap",
        dexB: "Uniswap V3",
        priceSpreadBps: 55,
        estProfitUsd: 890,
        requiredLoanUsd: 100000,
      },
    ];
  }, [activeOpportunities]);

  return (
    <div className="space-y-4" id="flashloan-arena">
      {/* Header MEV Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 font-mono font-bold text-base border border-purple-500/20">
            MEV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground tracking-tight">
                Block #{blockNumber}
              </span>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                Base Mainnet (8453)
              </Badge>
              <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-mono bg-muted/40">
                Flash Loan Arb
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span>Base L2 Gas: <strong className="text-blue-400 font-mono">{gasPriceGwei} Gwei</strong></span>
              <span>•</span>
              <span>Active Pools: <strong className="text-foreground font-mono">{poolList.length}</strong></span>
              <span>•</span>
              <span>Landed Bundles: <strong className="text-amber-400 font-mono">{blockHistory.length}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Block Round</div>
            <div className="font-mono text-sm font-bold text-foreground">
              {currentRound} / {totalRounds}
            </div>
          </div>
          <div className="h-8 w-px bg-border/60 mx-1" />
          <Badge
            variant={resolved ? "secondary" : "default"}
            className={cn(
              "font-mono text-xs px-2.5 py-1",
              !resolved && "bg-purple-500/15 text-purple-400 border border-purple-500/30 animate-pulse"
            )}
          >
            {resolved ? "BLOCKS SEALED" : "MEV MEMPOOL LIVE"}
          </Badge>
        </div>
      </div>

      {/* Cross-DEX Arbitrage Opportunities */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">Cross-DEX Arbitrage Pools</span>
          <span className="text-[11px]">Deploy $100k-$500k Flash Loans</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {poolList.map((pool) => (
            <div
              key={pool.id}
              className="rounded-lg border border-border/70 bg-card/40 p-3 hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-semibold text-sm text-foreground">{pool.pair}</span>
                <Badge variant="outline" className="text-[10px] font-mono text-purple-400 bg-purple-950/20 border-purple-800/40">
                  {pool.dexA} ↔ {pool.dexB}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground font-mono space-y-0.5">
                <div className="flex justify-between">
                  <span>Price Spread:</span>
                  <span className="text-emerald-400 font-semibold">{pool.priceSpreadBps} bps</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Extracted Profit:</span>
                  <span className="text-foreground font-bold">${(pool.estProfitUsd ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block History & Mempool Bundle Landings */}
      {blockHistory.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-wider">Recent Block Landings & MEV Extraction</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {blockHistory.slice(0, 4).map((tx, idx) => {
              const p = players.find((pl) => pl.id === tx.winnerId);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Block #{tx.block}</span>
                    <Badge variant="outline" className="text-[10px] text-foreground">
                      {tx.route}
                    </Badge>
                    <span className="text-emerald-400 font-medium">{p?.name ?? tx.winnerId}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">+${(tx.profitUsd ?? 0).toFixed(2)}</div>
                    <div className="text-[10px] text-muted-foreground">Gas: ${tx.gasPaidUsd ?? 0}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MEV Raiders Leaderboard */}
      <div className="rounded-lg border border-border/70 bg-card/40 p-3 space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          MEV Arbitrage Extractors
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {leaderboard.map((r, rank) => {
            const player = players.find((p) => p.id === r.playerId);
            const pName = player?.name ?? r.playerId;
            return (
              <div
                key={r.playerId}
                className="flex items-center justify-between p-2.5 rounded-md border border-border/60 bg-card/70"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-muted-foreground w-4">#{rank + 1}</span>
                  <Token tint={player?.tint} name={pName} size="sm" />
                  <div>
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                      {pName}
                      {player?.controller === "bot" && (
                        <span className="text-[9px] text-muted-foreground font-mono">(BOT)</span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {r.bundlesLanded ?? 0} bundles landed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-emerald-400">
                    +${(r.totalProfitUsd ?? 0).toFixed(2)}
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
