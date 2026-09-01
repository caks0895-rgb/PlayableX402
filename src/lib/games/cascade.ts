import type { LegalAction, Match, Player } from "@/lib/engine/types";

export interface CascadePosition {
  side: "long" | "short" | "flat";
  entryPrice: number;
  size: number;
  leverage: number;
  collateralUsd: number;
  liquidationPrice: number;
  unrealizedPnlUsd: number;
  realizedPnlUsd: number;
  totalEquityUsd: number;
  isLiquidated: boolean;
  bountiesCollectedUsd: number;
  shieldActive: boolean;
  score: number;
}

export interface CascadeState {
  currentTick: number;
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  assetSymbol: string;
  currentPrice: number;
  priceChangePct: number;
  volatilityIndex: number;
  priceHistory: number[];
  positions: Record<string, CascadePosition>;
  liquidationLog: {
    ts: number;
    victimId: string;
    hunterId: string;
    bountyUsd: number;
    price: number;
  }[];
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
}

export interface CascadePublicState {
  currentTick: number;
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  assetSymbol: string;
  currentPrice: number;
  priceChangePct: number;
  volatilityIndex: number;
  priceHistory: number[];
  positions: Record<string, CascadePosition>;
  liquidationLog: {
    ts: number;
    victimId: string;
    hunterId: string;
    bountyUsd: number;
    price: number;
  }[];
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
  leaderboard: {
    playerId: string;
    totalEquityUsd: number;
    realizedPnlUsd: number;
    isLiquidated: boolean;
    score: number;
  }[];
}

export const CASCADE_TOTAL_TICKS = 25;
export const CASCADE_TICK_MS = 1500;
export const CASCADE_INITIAL_COLLATERAL = 20_000;
export const CASCADE_SHIELD_FEE = 20_000;

export function createCascadeState(players: Player[], seed: number = Date.now()): CascadeState {
  const startPrice = 2400 + ((seed % 100) - 50) * 5;
  const positions: Record<string, CascadePosition> = {};

  for (const p of players) {
    positions[p.id] = {
      side: "flat",
      entryPrice: startPrice,
      size: 0,
      leverage: 10,
      collateralUsd: CASCADE_INITIAL_COLLATERAL,
      liquidationPrice: 0,
      unrealizedPnlUsd: 0,
      realizedPnlUsd: 0,
      totalEquityUsd: CASCADE_INITIAL_COLLATERAL,
      isLiquidated: false,
      bountiesCollectedUsd: 0,
      shieldActive: false,
      score: 1000,
    };
  }

  return {
    currentTick: 0,
    totalTicks: CASCADE_TOTAL_TICKS,
    tickIntervalMs: CASCADE_TICK_MS,
    windowEndsAt: Date.now() + CASCADE_TOTAL_TICKS * CASCADE_TICK_MS,
    assetSymbol: "ETH-PERP",
    currentPrice: startPrice,
    priceChangePct: 0,
    volatilityIndex: 45,
    priceHistory: [startPrice],
    positions,
    liquidationLog: [],
    actionLog: [],
    resolved: false,
  };
}

export function cascadeLegal(match: Match, playerId: string): LegalAction[] {
  if (match.status !== "playing") return [];
  const state = match.state as CascadeState;
  if (!state || state.resolved) return [];

  const pos = state.positions[playerId];
  if (!pos || pos.isLiquidated) return [];

  const actions: LegalAction[] = [
    {
      type: "margin_trade",
      label: "Adjust 15x Margin Position (Long/Short/Flat)",
      hint: `Set ETH-PERP position with up to 15x leverage at $${state.currentPrice.toFixed(2)}`,
    },
    {
      type: "hunt_liquidation",
      label: "Execute Liquidation Hunt (35% Bounty)",
      hint: "Scan vulnerable opponent margin positions and trigger cascading liquidation bounties",
    },
    {
      type: "margin_shield",
      label: "Emergency Margin Injection",
      fee: CASCADE_SHIELD_FEE,
      hint: "Injects $5,000 synthetic collateral buffer to push liquidation barrier away",
    },
  ];

  return actions;
}

export function applyCascadeAction(
  state: CascadeState,
  playerId: string,
  action: { type: string; side?: string; leverage?: number; amount?: number; sizePct?: number },
  players: Player[]
): { logText: string; scoreDelta: number } {
  const p = state.positions[playerId];
  const playerObj = players.find((pl) => pl.id === playerId);
  const pName = playerObj?.name ?? playerId;
  if (!p || p.isLiquidated) return { logText: "", scoreDelta: 0 };

  let logText = "";
  let scoreDelta = 0;

  const actionType = action.type;

  if (actionType === "margin_trade") {
    const side = String(action.side ?? "long").toLowerCase();
    if (side === "flat") {
      if (p.side !== "flat") {
        p.realizedPnlUsd += p.unrealizedPnlUsd;
        p.collateralUsd = Math.max(1000, p.collateralUsd + p.unrealizedPnlUsd);
        const closedSide = p.side.toUpperCase();
        const profit = p.unrealizedPnlUsd;
        p.unrealizedPnlUsd = 0;
        p.side = "flat";
        p.size = 0;
        p.liquidationPrice = 0;
        p.score += profit > 0 ? 100 : 20;
        scoreDelta = profit > 0 ? 100 : 20;
        logText = `${pName} closed ${closedSide} position to FLAT for ${profit >= 0 ? "+" : ""}$${profit.toFixed(2)} PnL`;
      } else {
        logText = `${pName} maintained FLAT risk exposure`;
      }
    } else if (side === "short") {
      p.side = "short";
      p.leverage = action.leverage ?? 15;
      p.entryPrice = state.currentPrice;
      p.size = (p.collateralUsd * p.leverage) / state.currentPrice;
      p.liquidationPrice = +(state.currentPrice * (1 + 0.9 / p.leverage)).toFixed(2);
      p.score += 50;
      scoreDelta = 50;
      logText = `${pName} opened ${p.leverage}x SHORT @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
    } else {
      p.side = "long";
      p.leverage = action.leverage ?? 15;
      p.entryPrice = state.currentPrice;
      p.size = (p.collateralUsd * p.leverage) / state.currentPrice;
      p.liquidationPrice = +(state.currentPrice * (1 - 0.9 / p.leverage)).toFixed(2);
      p.score += 50;
      scoreDelta = 50;
      logText = `${pName} opened ${p.leverage}x LONG @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
    }
  } else {
    switch (actionType) {
      case "open_long": {
        p.side = "long";
        p.leverage = action.leverage ?? 15;
        p.entryPrice = state.currentPrice;
        p.size = (p.collateralUsd * p.leverage) / state.currentPrice;
        p.liquidationPrice = +(state.currentPrice * (1 - 0.9 / p.leverage)).toFixed(2);
        p.score += 50;
        scoreDelta = 50;
        logText = `${pName} opened ${p.leverage}x LONG @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
        break;
      }

      case "open_short": {
        p.side = "short";
        p.leverage = action.leverage ?? 15;
        p.entryPrice = state.currentPrice;
        p.size = (p.collateralUsd * p.leverage) / state.currentPrice;
        p.liquidationPrice = +(state.currentPrice * (1 + 0.9 / p.leverage)).toFixed(2);
        p.score += 50;
        scoreDelta = 50;
        logText = `${pName} opened ${p.leverage}x SHORT @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
        break;
      }

      case "close_position": {
        if (p.side !== "flat") {
          p.realizedPnlUsd += p.unrealizedPnlUsd;
          p.collateralUsd = Math.max(1000, p.collateralUsd + p.unrealizedPnlUsd);
          const closedSide = p.side.toUpperCase();
          const profit = p.unrealizedPnlUsd;
          p.unrealizedPnlUsd = 0;
          p.side = "flat";
          p.size = 0;
          p.liquidationPrice = 0;
          p.score += profit > 0 ? 100 : 20;
          scoreDelta = profit > 0 ? 100 : 20;
          logText = `${pName} closed ${closedSide} position for ${profit >= 0 ? "+" : ""}$${profit.toFixed(2)} PnL`;
        }
        break;
      }

      case "hunt_liquidation":
      case "hunt_liquidations": {
        let huntedCount = 0;
        let totalBounty = 0;
        for (const [targetId, targetPos] of Object.entries(state.positions)) {
          if (targetId !== playerId && !targetPos.isLiquidated && targetPos.side !== "flat") {
            // Check if vulnerable
            const marginRatio = (targetPos.collateralUsd + targetPos.unrealizedPnlUsd) / targetPos.collateralUsd;
            if (
              marginRatio < 0.25 ||
              (targetPos.side === "long" && state.currentPrice <= targetPos.liquidationPrice) ||
              (targetPos.side === "short" && state.currentPrice >= targetPos.liquidationPrice)
            ) {
              targetPos.isLiquidated = true;
              targetPos.unrealizedPnlUsd = -targetPos.collateralUsd;
              targetPos.totalEquityUsd = 0;
              const bounty = +(targetPos.collateralUsd * 0.35).toFixed(2);
              totalBounty += bounty;
              huntedCount++;
              state.liquidationLog.unshift({
                ts: Date.now(),
                victimId: targetId,
                hunterId: playerId,
                bountyUsd: bounty,
                price: state.currentPrice,
              });
            }
          }
        }

        if (huntedCount > 0) {
          p.bountiesCollectedUsd += totalBounty;
          p.collateralUsd += totalBounty;
          p.realizedPnlUsd += totalBounty;
          p.score += 250 * huntedCount;
          scoreDelta = 250 * huntedCount;
          logText = `🚨 ${pName} executed CASCADE HUNT: Liquidated ${huntedCount} positions (+$${totalBounty.toFixed(2)} bounty!)`;
        } else {
          p.score += 15;
          scoreDelta = 15;
          logText = `${pName} initiated liquidation scan (no positions breached maintenance margin)`;
        }
        break;
      }

      case "margin_shield": {
        p.collateralUsd += 5000;
        p.shieldActive = true;
        p.score += 40;
        scoreDelta = 40;
        logText = `${pName} deployed Emergency Margin Shield (+$5,000 collateral buffer)`;
        break;
      }
    }
  }

  p.totalEquityUsd = +(p.collateralUsd + p.unrealizedPnlUsd).toFixed(2);
  state.actionLog.unshift({
    ts: Date.now(),
    text: logText,
    playerId,
  });
  if (state.actionLog.length > 20) state.actionLog.pop();

  return { logText, scoreDelta };
}

export function stepCascade(state: CascadeState): { resolved: boolean; liquidatedIds: string[] } {
  if (state.resolved) return { resolved: true, liquidatedIds: [] };
  state.currentTick += 1;

  const prevPrice = state.currentPrice;
  // Jump diffusion price volatility model
  const shock = Math.random() < 0.2 ? (Math.random() - 0.5) * 0.08 : (Math.random() - 0.5) * 0.025;
  const delta = state.currentPrice * shock;
  state.currentPrice = +(state.currentPrice + delta).toFixed(2);
  state.priceChangePct = +(((state.currentPrice - prevPrice) / prevPrice) * 100).toFixed(2);
  state.priceHistory.push(state.currentPrice);
  if (state.priceHistory.length > 30) state.priceHistory.shift();

  const liquidatedIds: string[] = [];

  // Evaluate positions and auto-liquidations
  for (const [pid, pos] of Object.entries(state.positions)) {
    if (pos.isLiquidated) continue;

    if (pos.side === "long") {
      pos.unrealizedPnlUsd = +((state.currentPrice - pos.entryPrice) * pos.size).toFixed(2);
      if (state.currentPrice <= pos.liquidationPrice && !pos.shieldActive) {
        pos.isLiquidated = true;
        pos.unrealizedPnlUsd = -pos.collateralUsd;
        pos.totalEquityUsd = 0;
        liquidatedIds.push(pid);
        state.liquidationLog.unshift({
          ts: Date.now(),
          victimId: pid,
          hunterId: "SYSTEM_LIQUIDATOR",
          bountyUsd: +(pos.collateralUsd * 0.2).toFixed(2),
          price: state.currentPrice,
        });
      }
    } else if (pos.side === "short") {
      pos.unrealizedPnlUsd = +((pos.entryPrice - state.currentPrice) * pos.size).toFixed(2);
      if (state.currentPrice >= pos.liquidationPrice && !pos.shieldActive) {
        pos.isLiquidated = true;
        pos.unrealizedPnlUsd = -pos.collateralUsd;
        pos.totalEquityUsd = 0;
        liquidatedIds.push(pid);
        state.liquidationLog.unshift({
          ts: Date.now(),
          victimId: pid,
          hunterId: "SYSTEM_LIQUIDATOR",
          bountyUsd: +(pos.collateralUsd * 0.2).toFixed(2),
          price: state.currentPrice,
        });
      }
    }

    pos.totalEquityUsd = pos.isLiquidated ? 0 : +(pos.collateralUsd + pos.unrealizedPnlUsd).toFixed(2);
  }

  if (state.currentTick >= state.totalTicks) {
    state.resolved = true;
    return { resolved: true, liquidatedIds };
  }
  return { resolved: false, liquidatedIds };
}

export function botCascadeAction(state: CascadeState, botPlayerId: string): { type: string; leverage?: number; side?: string } {
  const p = state.positions[botPlayerId];
  if (!p || p.isLiquidated) return { type: "hunt_liquidation" };

  if (p.side === "flat") {
    return Math.random() > 0.5
      ? { type: "margin_trade", side: "long", leverage: 15 }
      : { type: "margin_trade", side: "short", leverage: 15 };
  }

  if (p.unrealizedPnlUsd > 1500) {
    return { type: "margin_trade", side: "flat" };
  }

  const rand = Math.random();
  if (rand < 0.45) return { type: "hunt_liquidation" };
  if (rand < 0.65) return { type: "margin_trade", side: "flat" };
  return { type: "hunt_liquidation" };
}

export function publicCascadeState(state: CascadeState): CascadePublicState {
  const leaderboard = Object.entries(state.positions).map(([playerId, pos]) => ({
    playerId,
    totalEquityUsd: pos.totalEquityUsd,
    realizedPnlUsd: pos.realizedPnlUsd,
    isLiquidated: pos.isLiquidated,
    score: pos.score,
  })).sort((a, b) => b.totalEquityUsd - a.totalEquityUsd);

  return {
    currentTick: state.currentTick,
    totalTicks: state.totalTicks,
    tickIntervalMs: state.tickIntervalMs,
    windowEndsAt: state.windowEndsAt,
    assetSymbol: state.assetSymbol,
    currentPrice: state.currentPrice,
    priceChangePct: state.priceChangePct,
    volatilityIndex: state.volatilityIndex,
    priceHistory: state.priceHistory,
    positions: state.positions,
    liquidationLog: state.liquidationLog,
    actionLog: state.actionLog,
    resolved: state.resolved,
    leaderboard,
  };
}
