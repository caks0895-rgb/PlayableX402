import type { LegalAction, Match, Player } from "@/lib/engine/types";

export type OrderSide = "bid" | "ask";

export interface BookLevel {
  price: number;
  size: number;
  ordersCount: number;
}

export interface TradeTick {
  id: string;
  price: number;
  size: number;
  side: OrderSide;
  maker?: string;
  taker?: string;
  ts: number;
}

export interface RaiderPortfolio {
  cashUsd: number;
  tokenBalance: number;
  inventoryValueUsd: number;
  totalEquityUsd: number;
  realizedPnlUsd: number;
  volumeUsd: number;
  activeBids: number;
  activeAsks: number;
  tradesExecuted: number;
  shieldActive: boolean;
  score: number;
}

export interface OrderBookState {
  currentTick: number; // 0..25
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  baseAsset: string;
  quoteAsset: string;
  midPrice: number;
  spreadBps: number;
  bids: BookLevel[];
  asks: BookLevel[];
  recentTrades: TradeTick[];
  portfolios: Record<string, RaiderPortfolio>;
  marketRegime: "HIGH_VOLATILITY_EXPANSION" | "ORDER_BOOK_SQUEEZE" | "FLASH_DUMP_RECOVERY" | "CONVERGENCE";
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
}

export interface OrderBookPublicState {
  currentTick: number;
  totalTicks: number;
  tickIntervalMs: number;
  windowEndsAt: number;
  baseAsset: string;
  quoteAsset: string;
  midPrice: number;
  spreadBps: number;
  bids: BookLevel[];
  asks: BookLevel[];
  recentTrades: TradeTick[];
  portfolios: Record<string, RaiderPortfolio>;
  marketRegime: string;
  actionLog: { ts: number; text: string; playerId: string }[];
  resolved: boolean;
  leaderboard: {
    playerId: string;
    totalEquityUsd: number;
    realizedPnlUsd: number;
    volumeUsd: number;
    score: number;
  }[];
}

export const RAIDER_TOTAL_TICKS = 25;
export const RAIDER_TICK_MS = 1400;
export const RAIDER_INITIAL_CASH = 25_000;
export const RAIDER_SHIELD_FEE = 15_000; // 0.015 USDC

export function createOrderBookState(players: Player[], seed: number = Date.now()): OrderBookState {
  const baseMid = 142.5 + ((seed % 100) - 50) * 0.1;
  const regimes = [
    "HIGH_VOLATILITY_EXPANSION",
    "ORDER_BOOK_SQUEEZE",
    "FLASH_DUMP_RECOVERY",
    "CONVERGENCE",
  ] as const;
  const marketRegime = regimes[Math.abs(seed) % regimes.length];

  const bids: BookLevel[] = [];
  const asks: BookLevel[] = [];

  for (let i = 1; i <= 6; i++) {
    bids.push({
      price: +(baseMid * (1 - i * 0.006)).toFixed(2),
      size: +(15 + (i * 8.5) + ((seed * i) % 10)).toFixed(1),
      ordersCount: 2 + (i % 3),
    });
    asks.push({
      price: +(baseMid * (1 + i * 0.006)).toFixed(2),
      size: +(12 + (i * 7.5) + (((seed + 7) * i) % 9)).toFixed(1),
      ordersCount: 2 + ((i + 1) % 3),
    });
  }

  const portfolios: Record<string, RaiderPortfolio> = {};
  for (const p of players) {
    portfolios[p.id] = {
      cashUsd: RAIDER_INITIAL_CASH,
      tokenBalance: 0,
      inventoryValueUsd: 0,
      totalEquityUsd: RAIDER_INITIAL_CASH,
      realizedPnlUsd: 0,
      volumeUsd: 0,
      activeBids: 0,
      activeAsks: 0,
      tradesExecuted: 0,
      shieldActive: false,
      score: 1000,
    };
  }

  return {
    currentTick: 0,
    totalTicks: RAIDER_TOTAL_TICKS,
    tickIntervalMs: RAIDER_TICK_MS,
    windowEndsAt: Date.now() + RAIDER_TOTAL_TICKS * RAIDER_TICK_MS,
    baseAsset: "FLX",
    quoteAsset: "USDC",
    midPrice: +baseMid.toFixed(2),
    spreadBps: 35,
    bids,
    asks,
    recentTrades: [],
    portfolios,
    marketRegime,
    actionLog: [],
    resolved: false,
  };
}

export function orderBookLegal(match: Match, playerId: string): LegalAction[] {
  if (match.status !== "playing") return [];
  const state = match.state as OrderBookState;
  if (!state || state.resolved) return [];

  const port = state.portfolios[playerId];
  if (!port) return [];

  const actions: LegalAction[] = [
    {
      type: "limit_bid",
      label: "Post Bid Liquidity",
      hint: `Provide liquidity on bid ladder at ${state.bids[0]?.price ?? (state.midPrice * 0.99).toFixed(2)}`,
    },
    {
      type: "limit_ask",
      label: "Post Ask Liquidity",
      hint: `Post sell inventory at ${state.asks[0]?.price ?? (state.midPrice * 1.01).toFixed(2)}`,
    },
    {
      type: "market_sweep",
      label: "Market Sweep",
      hint: "Cross spread to aggressively capture available depth and arbitrage points",
    },
    {
      type: "flash_arb",
      label: "Cross-DEX Arbitrage",
      hint: "Extract price delta against external AMM liquidity pool",
    },
    {
      type: "liquidity_shield",
      label: "Deploy Slippage Shield",
      fee: RAIDER_SHIELD_FEE,
      hint: "Prevents adverse selection and spread penalties for 3 rounds",
    },
  ];

  return actions;
}

export function applyOrderBookAction(
  state: OrderBookState,
  playerId: string,
  action: { type: string; powerup?: string; option?: string },
  players: Player[]
): { logText: string; scoreDelta: number } {
  const p = state.portfolios[playerId];
  const playerObj = players.find((pl) => pl.id === playerId);
  const pName = playerObj?.name ?? playerId;
  if (!p) return { logText: "", scoreDelta: 0 };

  let logText = "";
  let scoreDelta = 0;

  switch (action.type) {
    case "limit_bid": {
      const bestBid = state.bids[0]?.price ?? state.midPrice * 0.994;
      const orderSize = 40;
      const cost = bestBid * orderSize;
      if (p.cashUsd >= cost * 0.5) {
        p.activeBids += 1;
        p.tradesExecuted += 1;
        const reward = +(orderSize * 0.45).toFixed(2);
        p.realizedPnlUsd += reward;
        p.cashUsd += reward;
        p.volumeUsd += cost;
        p.score += 75;
        scoreDelta = 75;
        logText = `${pName} placed limit bid for 40 ${state.baseAsset} @ $${bestBid.toFixed(2)} (+75 pts)`;
      } else {
        logText = `${pName} attempted limit bid (insufficient liquidity reserves)`;
      }
      break;
    }

    case "limit_ask": {
      const bestAsk = state.asks[0]?.price ?? state.midPrice * 1.006;
      const orderSize = 35;
      const revenue = bestAsk * orderSize;
      p.activeAsks += 1;
      p.tradesExecuted += 1;
      const reward = +(orderSize * 0.52).toFixed(2);
      p.realizedPnlUsd += reward;
      p.cashUsd += reward;
      p.volumeUsd += revenue;
      p.score += 80;
      scoreDelta = 80;
      logText = `${pName} posted limit ask for 35 ${state.baseAsset} @ $${bestAsk.toFixed(2)} (+80 pts)`;
      break;
    }

    case "market_sweep": {
      const sweepPrice = state.asks[0]?.price ?? state.midPrice * 1.008;
      const slippage = p.shieldActive ? 0.001 : 0.008;
      const executedPrice = +(sweepPrice * (1 + slippage)).toFixed(2);
      const grossPnl = +((state.midPrice * 0.02) * 50).toFixed(2);
      p.tradesExecuted += 1;
      p.volumeUsd += executedPrice * 50;
      p.realizedPnlUsd += grossPnl;
      p.cashUsd += grossPnl;
      p.score += 110;
      scoreDelta = 110;
      logText = `${pName} executed Market Sweep of 50 ${state.baseAsset} @ $${executedPrice} (+$${grossPnl}, +110 pts)`;
      break;
    }

    case "flash_arb": {
      const arbSpread = +(Math.random() * 1.8 + 0.6).toFixed(2);
      const profit = +(arbSpread * 45).toFixed(2);
      p.realizedPnlUsd += profit;
      p.cashUsd += profit;
      p.volumeUsd += 45 * state.midPrice;
      p.tradesExecuted += 1;
      p.score += 125;
      scoreDelta = 125;
      logText = `${pName} captured Flash Arbitrage spread delta of ${arbSpread}% (+$${profit}, +125 pts)`;
      break;
    }

    case "liquidity_shield": {
      p.shieldActive = true;
      p.score += 40;
      scoreDelta = 40;
      logText = `${pName} activated Slippage & MEV Shield`;
      break;
    }

    default:
      logText = `${pName} held order book position`;
      break;
  }

  p.totalEquityUsd = +(p.cashUsd + (p.tokenBalance * state.midPrice)).toFixed(2);
  state.actionLog.unshift({
    ts: Date.now(),
    text: logText,
    playerId,
  });
  if (state.actionLog.length > 20) state.actionLog.pop();

  return { logText, scoreDelta };
}

export function stepOrderBook(state: OrderBookState): boolean {
  if (state.resolved) return true;
  state.currentTick += 1;

  // Simulate market drift and order book dynamics
  const volatility = state.marketRegime === "HIGH_VOLATILITY_EXPANSION" ? 0.018 : 0.009;
  const drift = (Math.random() - 0.48) * volatility * state.midPrice;
  state.midPrice = +(state.midPrice + drift).toFixed(2);

  // Update order book ladder
  for (let i = 0; i < state.bids.length; i++) {
    const depthStep = (i + 1) * 0.005;
    state.bids[i].price = +(state.midPrice * (1 - depthStep)).toFixed(2);
    state.bids[i].size = +(10 + Math.random() * 40).toFixed(1);

    state.asks[i].price = +(state.midPrice * (1 + depthStep)).toFixed(2);
    state.asks[i].size = +(10 + Math.random() * 40).toFixed(1);
  }

  // Generate simulated tape trade
  const tradeSide: OrderSide = Math.random() > 0.5 ? "bid" : "ask";
  const tradePrice = tradeSide === "bid" ? state.bids[0].price : state.asks[0].price;
  state.recentTrades.unshift({
    id: `tr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    price: tradePrice,
    size: +(5 + Math.random() * 30).toFixed(1),
    side: tradeSide,
    ts: Date.now(),
  });
  if (state.recentTrades.length > 15) state.recentTrades.pop();

  // Re-calculate portfolios total equity
  for (const pid of Object.keys(state.portfolios)) {
    const p = state.portfolios[pid];
    p.inventoryValueUsd = +(p.tokenBalance * state.midPrice).toFixed(2);
    p.totalEquityUsd = +(p.cashUsd + p.inventoryValueUsd).toFixed(2);
  }

  if (state.currentTick >= state.totalTicks) {
    state.resolved = true;
    return true;
  }
  return false;
}

export function botOrderBookAction(
  state: OrderBookState,
  botPlayerId: string
): { type: string; powerup?: string } {
  const p = state.portfolios[botPlayerId];
  if (!p) return { type: "limit_bid" };

  const rand = Math.random();
  if (rand < 0.35) {
    return { type: "flash_arb" };
  } else if (rand < 0.65) {
    return { type: "market_sweep" };
  } else if (rand < 0.85) {
    return { type: "limit_bid" };
  } else {
    return { type: "limit_ask" };
  }
}

export function publicOrderBookState(state: OrderBookState): OrderBookPublicState {
  const leaderboard = Object.entries(state.portfolios).map(([playerId, port]) => ({
    playerId,
    totalEquityUsd: port.totalEquityUsd,
    realizedPnlUsd: port.realizedPnlUsd,
    volumeUsd: port.volumeUsd,
    score: port.score,
  })).sort((a, b) => b.totalEquityUsd - a.totalEquityUsd);

  return {
    currentTick: state.currentTick,
    totalTicks: state.totalTicks,
    tickIntervalMs: state.tickIntervalMs,
    windowEndsAt: state.windowEndsAt,
    baseAsset: state.baseAsset,
    quoteAsset: state.quoteAsset,
    midPrice: state.midPrice,
    spreadBps: state.spreadBps,
    bids: state.bids,
    asks: state.asks,
    recentTrades: state.recentTrades,
    portfolios: state.portfolios,
    marketRegime: state.marketRegime,
    actionLog: state.actionLog,
    resolved: state.resolved,
    leaderboard,
  };
}
