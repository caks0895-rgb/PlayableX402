import type { LegalAction, Match, Player } from "@/lib/engine/types";

export interface FlashOpportunity {
  id: string;
  dexPair: string;
  route: string;
  spreadBps: number;
  availableProfitUsd: number;
  minLoanSizeUsd: number;
  baseGasUnits: number;
  expiresTick: number;
}

export interface MEVRaider {
  cashUsd: number;
  gasSpentUsd: number;
  bundlesSubmitted: number;
  bundlesLanded: number;
  totalProfitUsd: number;
  score: number;
  lastBidGwei: number;
  briberTier: number;
}

export interface FlashLoanState {
  currentTick: number;
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  baseAsset: string;
  blockNumber: number;
  gasPriceGwei: number;
  activeOpportunities: FlashOpportunity[];
  raiders: Record<string, MEVRaider>;
  blockHistory: {
    block: number;
    winnerId: string;
    profitUsd: number;
    gasPaidUsd: number;
    opportunityId: string;
    route: string;
  }[];
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
}

export interface FlashLoanPublicState {
  currentTick: number;
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  baseAsset: string;
  blockNumber: number;
  gasPriceGwei: number;
  activeOpportunities: FlashOpportunity[];
  raiders: Record<string, MEVRaider>;
  blockHistory: {
    block: number;
    winnerId: string;
    profitUsd: number;
    gasPaidUsd: number;
    opportunityId: string;
    route: string;
  }[];
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
  leaderboard: {
    playerId: string;
    totalProfitUsd: number;
    bundlesLanded: number;
    cashUsd: number;
    score: number;
  }[];
}

export const FLASH_TOTAL_TICKS = 20;
export const FLASH_TICK_MS = 1500;
export const FLASH_INITIAL_CASH = 15_000;
export const FLASH_BRIBE_FEE = 15_000;

export function createFlashLoanState(players: Player[], seed: number = Date.now()): FlashLoanState {
  const raiders: Record<string, MEVRaider> = {};
  for (const p of players) {
    raiders[p.id] = {
      cashUsd: FLASH_INITIAL_CASH,
      gasSpentUsd: 0,
      bundlesSubmitted: 0,
      bundlesLanded: 0,
      totalProfitUsd: 0,
      score: 1000,
      lastBidGwei: 25,
      briberTier: 1,
    };
  }

  return {
    currentTick: 0,
    totalTicks: FLASH_TOTAL_TICKS,
    tickIntervalMs: FLASH_TICK_MS,
    windowEndsAt: Date.now() + FLASH_TOTAL_TICKS * FLASH_TICK_MS,
    baseAsset: "WETH-USDC",
    blockNumber: 19842000 + (seed % 10000),
    gasPriceGwei: 28,
    activeOpportunities: generateOpportunities(1, seed),
    raiders,
    blockHistory: [],
    actionLog: [],
    resolved: false,
  };
}

function generateOpportunities(tick: number, seed: number): FlashOpportunity[] {
  const pairs = [
    { dex: "Uniswap v3 ↔ Curve TriCrypto", spread: 48, profit: 3200, loan: 150000 },
    { dex: "Balancer v2 ↔ SushiSwap", spread: 82, profit: 5400, loan: 250000 },
    { dex: "Camelot ↔ TraderJoe L2", spread: 35, profit: 2100, loan: 90000 },
  ];

  return pairs.map((p, idx) => ({
    id: `opp-t${tick}-${idx}`,
    dexPair: p.dex,
    route: `BORROW -> SWAP POOL A -> ARB POOL B -> REPAY`,
    spreadBps: p.spread + ((seed + idx * 7) % 20),
    availableProfitUsd: p.profit + ((seed + idx * 13) % 800),
    minLoanSizeUsd: p.loan,
    baseGasUnits: 280_000 + idx * 40_000,
    expiresTick: tick + 2,
  }));
}

export function flashLoanLegal(match: Match, playerId: string): LegalAction[] {
  if (match.status !== "playing") return [];
  const state = match.state as FlashLoanState;
  if (!state || state.resolved) return [];

  const r = state.raiders[playerId];
  if (!r) return [];

  const actions: LegalAction[] = [
    {
      type: "flash_arbitrage",
      label: "Snipe Flash Loan Arbitrage ($250k)",
      hint: "Execute flash loan bundle with standard gas priority fee across DEX mempool",
    },
    {
      type: "sandwich_bundle",
      label: "Execute Sandwich Mempool Attack",
      hint: "Bundle sandwich transaction targeting DEX pending liquidity swap",
    },
    {
      type: "gas_bid",
      label: "Escalate Turbo Gas Priority (+80 Gwei)",
      hint: "Frontrun competitors with heavy priority gas bidding",
    },
    {
      type: "builder_bribe",
      label: "Direct Block Builder Bribe",
      fee: FLASH_BRIBE_FEE,
      hint: "Private RPC bypass with top-of-block execution priority",
    },
  ];

  return actions;
}

export function applyFlashLoanAction(
  state: FlashLoanState,
  playerId: string,
  action: { type: string; gasBid?: number; priorityGwei?: number; poolId?: string; loanAmountUsd?: number; bribeGwei?: number },
  players: Player[]
): { logText: string; scoreDelta: number } {
  const r = state.raiders[playerId];
  const playerObj = players.find((pl) => pl.id === playerId);
  const pName = playerObj?.name ?? playerId;
  if (!r) return { logText: "", scoreDelta: 0 };

  let logText = "";
  let scoreDelta = 0;

  r.bundlesSubmitted += 1;
  const opp = state.activeOpportunities[0];

  switch (action.type) {
    case "flash_arbitrage":
    case "submit_standard_bundle": {
      const gasCost = 120;
      r.gasSpentUsd += gasCost;
      r.cashUsd -= gasCost;
      r.lastBidGwei = 50;

      // 55% chance to capture if no higher bid
      if (opp && Math.random() < 0.65) {
        const netProfit = +(opp.availableProfitUsd - gasCost).toFixed(2);
        r.bundlesLanded += 1;
        r.totalProfitUsd += netProfit;
        r.cashUsd += netProfit;
        r.score += 150;
        scoreDelta = 150;
        state.blockHistory.unshift({
          block: state.blockNumber,
          winnerId: playerId,
          profitUsd: netProfit,
          gasPaidUsd: gasCost,
          opportunityId: opp.id,
          route: opp.dexPair,
        });
        logText = `⚡ ${pName} landed Flash Arbitrage bundle on ${opp.dexPair} (+$${netProfit.toFixed(2)} net profit)`;
      } else {
        r.score += 20;
        scoreDelta = 20;
        logText = `${pName} submitted 50 Gwei bundle (reverted in mempool / outbid by competitors)`;
      }
      break;
    }

    case "gas_bid":
    case "submit_high_gas_bundle": {
      const priority = action.priorityGwei ?? 120;
      const gasCost = priority > 70 ? 350 : 180;
      r.gasSpentUsd += gasCost;
      r.cashUsd -= gasCost;
      r.lastBidGwei = priority;

      // 85% capture chance
      if (opp && Math.random() < 0.85) {
        const netProfit = +(opp.availableProfitUsd - gasCost).toFixed(2);
        r.bundlesLanded += 1;
        r.totalProfitUsd += netProfit;
        r.cashUsd += netProfit;
        r.score += 200;
        scoreDelta = 200;
        state.blockHistory.unshift({
          block: state.blockNumber,
          winnerId: playerId,
          profitUsd: netProfit,
          gasPaidUsd: gasCost,
          opportunityId: opp.id,
          route: opp.dexPair,
        });
        logText = `🚀 ${pName} WON top-of-block priority @ ${priority} Gwei on ${opp.dexPair} (+$${netProfit.toFixed(2)} net)`;
      } else {
        r.score += 25;
        scoreDelta = 25;
        logText = `${pName} outbid in block builder auction (-$${gasCost} gas priority)`;
      }
      break;
    }

    case "sandwich_bundle":
    case "sandwich_attack": {
      const gasCost = 480;
      r.gasSpentUsd += gasCost;
      r.cashUsd -= gasCost;
      const profit = +(opp ? opp.availableProfitUsd * 1.35 - gasCost : 1800).toFixed(2);
      if (Math.random() < 0.75) {
        r.bundlesLanded += 1;
        r.totalProfitUsd += profit;
        r.cashUsd += profit;
        r.score += 240;
        scoreDelta = 240;
        logText = `🥪 ${pName} executed frontrun + backrun Sandwich Bundle (+$${profit.toFixed(2)} profit)`;
      } else {
        logText = `${pName} sandwich bundle slipped due to private mempool protection`;
      }
      break;
    }

    case "builder_bribe": {
      r.briberTier += 1;
      r.score += 50;
      scoreDelta = 50;
      logText = `🛡️ ${pName} secured Private Relayer Direct Bribe (Guaranteed top bundle inclusion)`;
      break;
    }
  }

  state.actionLog.unshift({
    ts: Date.now(),
    text: logText,
    playerId,
  });
  if (state.actionLog.length > 20) state.actionLog.pop();

  return { logText, scoreDelta };
}

export function stepFlashLoan(state: FlashLoanState): boolean {
  if (state.resolved) return true;
  state.currentTick += 1;
  state.blockNumber += 1;
  state.gasPriceGwei = Math.floor(25 + Math.random() * 60);

  state.activeOpportunities = generateOpportunities(state.currentTick, Date.now());

  if (state.currentTick >= state.totalTicks) {
    state.resolved = true;
    return true;
  }
  return false;
}

export function botFlashLoanAction(_state: FlashLoanState, _botPlayerId: string): { type: string } {
  const rand = Math.random();
  if (rand < 0.4) return { type: "gas_bid" };
  if (rand < 0.7) return { type: "flash_arbitrage" };
  return { type: "sandwich_bundle" };
}

export function publicFlashLoanState(state: FlashLoanState): FlashLoanPublicState {
  const leaderboard = Object.entries(state.raiders).map(([playerId, r]) => ({
    playerId,
    totalProfitUsd: r.totalProfitUsd,
    bundlesLanded: r.bundlesLanded,
    cashUsd: r.cashUsd,
    score: r.score,
  })).sort((a, b) => b.totalProfitUsd - a.totalProfitUsd);

  return {
    currentTick: state.currentTick,
    totalTicks: state.totalTicks,
    tickIntervalMs: state.tickIntervalMs,
    windowEndsAt: state.windowEndsAt,
    baseAsset: state.baseAsset,
    blockNumber: state.blockNumber,
    gasPriceGwei: state.gasPriceGwei,
    activeOpportunities: state.activeOpportunities,
    raiders: state.raiders,
    blockHistory: state.blockHistory,
    actionLog: state.actionLog,
    resolved: state.resolved,
    leaderboard,
  };
}
