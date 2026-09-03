import type { AgentReputation, QuantTier } from "./types";
import { BOT_NAMES } from "./catalog";

// In-memory reputation registry backed by deterministic seeds and live updates
const agentReputations = new Map<string, AgentReputation>();

const SPECIALTIES: Record<string, string> = {
  Nova: "Statistical Arbitrage & Momentum",
  Atlas: "High-Leverage Perp Hedging",
  Mira: "Orderbook Microstructure & Toxic Flow",
  Hex: "Concentrated Liquidity Optimization",
  Drift: "Trend Following & Volatility Breakout",
  Quill: "Sentiment & Prediction Market Alpha",
  Vesper: "Cross-Venue Spread Capture",
  Nim: "Mean Reversion Scalper",
  Apex: "Deep Orderbook Front-Running",
  Echo: "Macro Regime Detection",
  Flux: "Automated Dynamic Hedger",
  Cipher: "Cryptographic Game Theory & Defection",
};

export function getTierFromElo(elo: number): QuantTier {
  if (elo >= 2000) return "diamond";
  if (elo >= 1600) return "gold";
  if (elo >= 1300) return "silver";
  return "bronze";
}

function initializeBaseReputations() {
  if (agentReputations.size > 0) return;

  BOT_NAMES.forEach((name, index) => {
    const id = name.toLowerCase();
    // Deterministic realistic base stats based on bot index
    const baseElo = 1150 + ((index * 53 + 7) % 950);
    const matches = 24 + ((index * 17) % 80);
    const winRate = 0.42 + (((index * 13) % 40) / 100);
    const wins = Math.round(matches * winRate);
    const pnlUsdc = Math.round((wins * 450_000) - ((matches - wins) * 180_000));
    const sharpe = +(1.2 + ((index * 0.17) % 2.2)).toFixed(2);
    const brier = +(0.15 + ((index * 0.03) % 0.35)).toFixed(3);

    agentReputations.set(id, {
      id,
      name,
      tokenId: index + 1,
      eloScore: baseElo,
      tier: getTierFromElo(baseElo),
      totalMatches: matches,
      wins,
      winRatePct: Math.round((wins / matches) * 100),
      totalPnlUsdc: pnlUsdc,
      sharpeRatio: sharpe,
      brierScore: brier,
      specialty: SPECIALTIES[name] || "Multi-Strategy Quantitative Execution",
      isSoulbound: true,
      registeredAt: Date.now() - (30 * 86400_000) + (index * 86400_000),
      lastActiveAt: Date.now() - ((index * 120_000) % 3600_000),
      onChainTxHash: `0x${Array.from({ length: 64 }, (_, i) => ((i * 7 + index * 13) % 16).toString(16)).join("")}`,
      attestationStandard: "ERC-8004",
    });
  });
}

export function getOrCreateAgentReputation(agentId: string, name: string): AgentReputation {
  initializeBaseReputations();
  const existing = agentReputations.get(agentId);
  if (existing) return existing;

  const tokenId = agentReputations.size + 1;
  const newRep: AgentReputation = {
    id: agentId,
    name,
    tokenId,
    eloScore: 1200,
    tier: "bronze",
    totalMatches: 0,
    wins: 0,
    winRatePct: 0,
    totalPnlUsdc: 0,
    sharpeRatio: 1.0,
    brierScore: 0.5,
    specialty: "Autonomous Market Participant",
    isSoulbound: true,
    registeredAt: Date.now(),
    lastActiveAt: Date.now(),
    onChainTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    attestationStandard: "ERC-8004",
  };

  agentReputations.set(agentId, newRep);
  return newRep;
}

export function recordMatchReputationUpdate(
  agentId: string,
  agentName: string,
  won: boolean,
  pnlUsdc: number,
  avgOpponentElo: number = 1350,
  isRated: boolean = true,
): AgentReputation {
  const rep = getOrCreateAgentReputation(agentId, agentName);

  if (!isRated) {
    // Sandbox / Practice Match vs House Bots:
    rep.sandboxMatches = (rep.sandboxMatches || 0) + 1;
    if (won) rep.sandboxWins = (rep.sandboxWins || 0) + 1;
    rep.lastActiveAt = Date.now();
    agentReputations.set(agentId, rep);
    return rep;
  }

  // Rated Challenger Match (Real Pot Stakes):
  rep.totalMatches += 1;
  if (won) rep.wins += 1;
  rep.totalPnlUsdc += pnlUsdc;
  rep.winRatePct = Math.round((rep.wins / rep.totalMatches) * 100);
  rep.lastActiveAt = Date.now();

  // Elo rating update calculation
  const expectedWinProb = 1 / (1 + Math.pow(10, (avgOpponentElo - rep.eloScore) / 400));
  const actualScore = won ? 1 : 0;
  const kFactor = rep.totalMatches < 20 ? 32 : 20;
  const eloDelta = Math.round(kFactor * (actualScore - expectedWinProb));

  rep.eloScore = Math.max(100, rep.eloScore + eloDelta);
  rep.tier = getTierFromElo(rep.eloScore);

  // Sharpe ratio adjustment
  const currentSharpe = rep.sharpeRatio;
  const targetSharpe = won ? Math.min(3.8, currentSharpe + 0.05) : Math.max(0.4, currentSharpe - 0.04);
  rep.sharpeRatio = +targetSharpe.toFixed(2);

  agentReputations.set(agentId, rep);
  return rep;
}

export function listAllAgentReputations(): AgentReputation[] {
  initializeBaseReputations();
  return Array.from(agentReputations.values()).sort((a, b) => b.eloScore - a.eloScore);
}

export function getAgentReputationById(id: string): AgentReputation | null {
  initializeBaseReputations();
  return agentReputations.get(id) || null;
}
