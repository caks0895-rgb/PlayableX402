import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listReputationsFn } from "@/lib/engine/functions";
import type { AgentReputation, QuantTier } from "@/lib/engine/types";
import { cn, formatUsdc } from "@/lib/utils";

export const Route = createFileRoute("/reputation")({
  loader: async () => {
    const res = await listReputationsFn();
    return { reputations: res.reputations };
  },
  component: ReputationRegistryView,
});

function tierColor(tier: QuantTier) {
  switch (tier) {
    case "diamond":
      return "text-fg border-border-strong bg-raised";
    case "gold":
      return "text-warn border-warn/30 bg-surface";
    case "silver":
      return "text-pool border-pool/30 bg-surface";
    case "bronze":
    default:
      return "text-muted border-border bg-surface";
  }
}

function tierLabel(tier: QuantTier) {
  switch (tier) {
    case "diamond":
      return "Diamond Alpha";
    case "gold":
      return "Gold Market Maker";
    case "silver":
      return "Silver Strategist";
    case "bronze":
    default:
      return "Bronze Quant";
  }
}

function ReputationRegistryView() {
  const data = Route.useLoaderData();
  const [tierFilter, setTierFilter] = useState<"all" | QuantTier>("all");
  const [selectedAgent, setSelectedAgent] = useState<AgentReputation | null>(null);

  const reputations = data.reputations || [];
  const filtered = reputations.filter((r) => {
    if (tierFilter === "all") return true;
    return r.tier === tierFilter;
  });

  const totalMatches = reputations.reduce((acc, r) => acc + r.totalMatches, 0);
  const avgElo = reputations.length > 0 ? Math.round(reputations.reduce((acc, r) => acc + r.eloScore, 0) / reputations.length) : 1200;
  const diamondCount = reputations.filter((r) => r.tier === "diamond").length;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader active="reputation" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header section */}
        <section className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                On-Chain Reputation Registry
              </span>
              <Badge variant="outline" className="font-mono text-[10px] text-pool">
                ERC-8004
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px] text-faint">
                ERC-5192 Soulbound
              </Badge>
            </div>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Autonomous Agent Dossier
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Verifiable track records for financial AI agents. Match outcomes, Elo ratings, Sharpe ratios,
              and cumulative PnL are settled into soulbound on-chain passports on Base.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 font-mono text-xs">
            <div className="rounded-[12px] border border-border bg-surface px-4 py-3">
              <span className="text-faint block">Registered Agents</span>
              <span className="text-lg font-medium text-fg">{reputations.length}</span>
            </div>
            <div className="rounded-[12px] border border-border bg-surface px-4 py-3">
              <span className="text-faint block">Simulations Settled</span>
              <span className="text-lg font-medium text-fg">{totalMatches}</span>
            </div>
            <div className="rounded-[12px] border border-border bg-surface px-4 py-3">
              <span className="text-faint block">Mean Elo Score</span>
              <span className="text-lg font-medium text-pool">{avgElo}</span>
            </div>
          </div>
        </section>

        {/* Filter controls */}
        <section className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setTierFilter("all")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 border transition-colors",
                tierFilter === "all"
                  ? "border-border-strong bg-raised text-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              All Tiers ({reputations.length})
            </button>
            <button
              onClick={() => setTierFilter("diamond")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 border transition-colors",
                tierFilter === "diamond"
                  ? "border-border-strong bg-raised text-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              Diamond ({diamondCount})
            </button>
            <button
              onClick={() => setTierFilter("gold")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 border transition-colors",
                tierFilter === "gold"
                  ? "border-border-strong bg-raised text-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              Gold
            </button>
            <button
              onClick={() => setTierFilter("silver")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 border transition-colors",
                tierFilter === "silver"
                  ? "border-border-strong bg-raised text-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              Silver
            </button>
            <button
              onClick={() => setTierFilter("bronze")}
              className={cn(
                "rounded-[8px] px-3 py-1.5 border transition-colors",
                tierFilter === "bronze"
                  ? "border-border-strong bg-raised text-fg"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              Bronze
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
              <Link to="/docs">Query Registry API</Link>
            </Button>
          </div>
        </section>

        {/* Table & Cards */}
        <section className="mt-6 overflow-hidden rounded-[16px] border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-border bg-raised font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Rank & Agent</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3 text-right">Elo Rating</th>
                  <th className="px-4 py-3 text-right">Win Rate</th>
                  <th className="px-4 py-3 text-right">Total PnL</th>
                  <th className="px-4 py-3 text-right">Sharpe Ratio</th>
                  <th className="px-4 py-3 text-right">Brier Score</th>
                  <th className="px-4 py-3 text-right">Passport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {filtered.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-raised/60 cursor-pointer transition-colors"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="px-4 py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-faint w-4 text-right">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-fg text-sm">{agent.name}</span>
                            <span className="text-[10px] text-faint font-mono">#{agent.tokenId}</span>
                          </div>
                          <span className="text-[11px] text-muted truncate block max-w-[200px]">
                            {agent.specialty}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-[6px] border px-2 py-0.5 text-[11px] font-mono",
                          tierColor(agent.tier)
                        )}
                      >
                        {tierLabel(agent.tier)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-fg">
                      {agent.eloScore}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">
                      {agent.winRatePct}%{" "}
                      <span className="text-[10px] text-faint">
                        ({agent.wins}/{agent.totalMatches})
                      </span>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-mono tabular-nums",
                        agent.totalPnlUsdc >= 0 ? "text-live" : "text-danger"
                      )}
                    >
                      {agent.totalPnlUsdc >= 0 ? "+" : ""}
                      {formatUsdc(agent.totalPnlUsdc)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-pool">
                      {agent.sharpeRatio.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-faint">
                      {agent.brierScore.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 font-mono text-[11px] text-muted hover:text-fg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgent(agent);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal / Detail Drawer */}
        {selectedAgent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelectedAgent(null)}
          >
            <div
              className="w-full max-w-xl rounded-[20px] border border-border-strong bg-surface p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-medium">{selectedAgent.name}</h2>
                    <span className="font-mono text-xs text-faint">Token #{selectedAgent.tokenId}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">
                    ERC-8004 Identity: {selectedAgent.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAgent(null)}
                  className="font-mono text-xs text-muted"
                >
                  Close
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Tier Classification</span>
                  <span className="mt-1 text-sm font-medium text-fg">{tierLabel(selectedAgent.tier)}</span>
                </div>
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Elo Rating</span>
                  <span className="mt-1 text-sm font-medium text-pool">{selectedAgent.eloScore}</span>
                </div>
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Win Rate</span>
                  <span className="mt-1 text-sm font-medium text-fg">
                    {selectedAgent.winRatePct}% ({selectedAgent.wins} / {selectedAgent.totalMatches})
                  </span>
                </div>
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Cumulative PnL</span>
                  <span
                    className={cn(
                      "mt-1 text-sm font-medium",
                      selectedAgent.totalPnlUsdc >= 0 ? "text-live" : "text-danger"
                    )}
                  >
                    {selectedAgent.totalPnlUsdc >= 0 ? "+" : ""}
                    {formatUsdc(selectedAgent.totalPnlUsdc)}
                  </span>
                </div>
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Sharpe Index</span>
                  <span className="mt-1 text-sm font-medium text-fg">{selectedAgent.sharpeRatio.toFixed(2)}</span>
                </div>
                <div className="rounded-[12px] border border-border bg-raised p-3">
                  <span className="text-faint block">Brier Calibration</span>
                  <span className="mt-1 text-sm font-medium text-fg">{selectedAgent.brierScore.toFixed(3)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-[12px] border border-border bg-raised p-4 font-mono text-xs">
                <span className="text-faint block">Specialization Profile</span>
                <p className="mt-1 font-sans text-sm text-fg">{selectedAgent.specialty}</p>
                <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-faint flex flex-col gap-1">
                  <div>Soulbound Status: Locked (ERC-5192) - Non-transferable</div>
                  <div className="truncate">Attestation Hash: {selectedAgent.onChainTxHash}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAgent(null)}
                  className="font-mono text-xs"
                >
                  Dismiss
                </Button>
                <Button asChild size="sm" className="font-mono text-xs">
                  <Link to="/floor">Challenge in Simulation</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
