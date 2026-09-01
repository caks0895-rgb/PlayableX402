import type { LegalAction, Match, Player } from "@/lib/engine/types";

export type MarketPosition = "long" | "short" | "flat";
export const MARKET_POSITIONS = ["long", "short", "flat"] as const;

export interface MarketCandle {
  t: number; // tick index (-15 to 30)
  o: number; // Open
  h: number; // High
  l: number; // Low
  c: number; // Close
  v: number; // Volume
}

export interface PlayerPortfolio {
  cashUsd: number;
  equityUsd: number;
  position: MarketPosition;
  leverage: number; // 1 to 5
  sizePct: number; // 10 to 100
  entryPrice: number;
  unrealizedPnlUsd: number;
  realizedPnlUsd: number;
  liquidated: boolean;
  protectedStop?: boolean;
  tradesCount: number;
}

export interface MarketBlitzState {
  currentTick: number; // 0 = warm-up finished, 1..30 = live
  totalTicks: number;
  windowEndsAt: number;
  tickIntervalMs: number;
  assetSymbol: string;
  regimeHint: string;
  sourceEventName?: string; // Revealed after game finishes!
  inverted: boolean;
  allCandles: MarketCandle[]; // All 45 candles
  activeCandles: MarketCandle[]; // Candles up to currentTick
  portfolios: Record<string, PlayerPortfolio>;
  tapes?: Record<string, MarketPosition[]>;
  pilots?: Record<string, boolean>;
  resolved: boolean;
  scenarioId: string;
}

export interface MarketBlitzPublicState {
  currentTick: number;
  totalTicks: number;
  windowEndsAt: number;
  tickIntervalMs: number;
  assetSymbol: string;
  regimeHint: string;
  currentPrice: number;
  priceChangePct: number;
  warmupCandles: MarketCandle[];
  liveCandles: MarketCandle[];
  portfolios: Record<string, PlayerPortfolio>;
  pilots?: Record<string, boolean>;
  taped?: Record<string, boolean>;
  resolved: boolean;
  sourceEventName?: string; // Revealed only when resolved!
  leaderboard: {
    playerId: string;
    equityUsd: number;
    returnPct: number;
    position: MarketPosition;
    liquidated: boolean;
  }[];
}

export const BLITZ_WARMUP_TICKS = 15;
export const BLITZ_TOTAL_TICKS = 30;
export const BLITZ_TICK_INTERVAL_MS = 1500;
export const BLITZ_INITIAL_CAPITAL = 10_000;
export const BLITZ_BOT_DELAY_MS = 400;
export const STOPLOSS_FEE = 20_000; // 0.02 USDC

// --- Realistic Historical Scenario Seeds ---
interface RawScenario {
  id: string;
  name: string;
  regime: string;
  drift: number[]; // Sequence of percentage price steps (-3.5% to +3.5%)
  volumes: number[]; // Sequence of volume multipliers
}

const HISTORICAL_SCENARIOS: RawScenario[] = [
  {
    id: "march_2020_cascade",
    name: "ETH March 2020 Liquidity Cascade & Flash V-Bottom",
    regime: "HIGH_VOLATILITY_CRASH",
    drift: [
      -0.2, 0.1, -0.4, 0.2, -0.8, -0.3, 0.1, -0.6, -1.1, -0.5, 0.2, -0.8, -1.5, -2.2, -3.8, // Warmup
      -4.5, -5.2, -7.1, -3.8, -2.1, 1.5, 4.2, 3.1, 2.5, 1.8, 0.5, 2.8, 3.4, 1.2, 0.8,
      1.5, 2.1, 0.3, -0.8, 1.2, 2.4, 1.9, 0.8, 1.5, 2.0, 1.1, 0.4, 1.8, 0.9, 1.2,
    ],
    volumes: [
      1200, 1100, 1500, 1300, 2100, 2400, 1900, 3100, 4200, 3800, 2900, 4500, 6200, 8900, 12000,
      18000, 24000, 31000, 22000, 16000, 14000, 19000, 15000, 12000, 9500, 8200, 9100, 11000, 7800, 6500,
      7100, 8400, 6200, 5800, 6900, 7500, 6100, 5400, 6200, 7100, 5800, 5200, 6000, 5400, 5900,
    ],
  },
  {
    id: "defi_summer_breakout",
    name: "DeFi Summer 2020 Parabolic Momentum Rally",
    regime: "STRONG_BULL_MOMENTUM",
    drift: [
      0.1, 0.3, -0.1, 0.4, 0.2, 0.6, 0.1, 0.8, 0.5, 0.9, 0.4, 1.2, 0.8, 1.5, 1.1, // Warmup
      2.1, 1.8, 3.2, 2.4, 1.5, 0.8, 3.5, 4.1, 2.8, 1.9, -1.2, -0.8, 2.5, 3.1, 1.8,
      2.4, 3.6, 2.1, 1.4, 0.9, 2.8, 3.2, 1.5, 0.8, -1.5, 1.8, 2.9, 2.1, 1.4, 1.8,
    ],
    volumes: [
      1500, 1600, 1400, 1800, 2100, 2500, 2200, 3100, 3500, 4200, 3900, 5100, 5800, 6900, 7500,
      8900, 9800, 12500, 11200, 9500, 8200, 14500, 16800, 13200, 10500, 8900, 7800, 11200, 13500, 9800,
      11500, 14200, 10800, 9200, 8500, 12100, 13800, 9500, 8100, 7200, 9800, 12400, 10100, 8900, 9400,
    ],
  },
  {
    id: "crab_sideways_squeeze",
    name: "Summer 2023 Chop & Short Squeeze Liquidation",
    regime: "SIDEWAYS_CHOP_TO_SQUEEZE",
    drift: [
      0.2, -0.3, 0.1, 0.3, -0.4, 0.2, -0.1, 0.3, -0.2, 0.1, -0.3, 0.2, -0.1, 0.4, -0.2, // Warmup
      -0.3, 0.2, -0.4, 0.1, -0.2, 0.3, -0.1, 0.4, 0.8, 1.9, 3.8, 5.2, 2.1, 1.4, -1.1,
      -0.8, 0.4, 0.2, -0.3, 0.5, 0.9, 1.2, 0.3, -0.4, 0.2, 0.6, 0.1, -0.2, 0.4, 0.1,
    ],
    volumes: [
      900, 850, 920, 880, 950, 910, 870, 940, 900, 860, 930, 890, 850, 980, 920,
      890, 910, 840, 860, 890, 920, 880, 1400, 2800, 6500, 14200, 18900, 11200, 8500, 6200,
      5100, 4200, 3800, 3400, 3900, 4500, 4800, 3600, 3100, 2900, 3400, 3100, 2800, 3000, 2900,
    ],
  },
  {
    id: "luna_unwind_cascade",
    name: "May 2022 Algorithmic Death Spiral Run",
    regime: "PERSISTENT_DOWN_TREND",
    drift: [
      -0.4, -0.6, 0.2, -0.8, -1.1, -0.5, -1.4, -0.9, -1.8, -1.2, 0.3, -2.1, -1.8, -2.5, -3.1, // Warmup
      -3.8, -4.5, -5.8, -6.2, -4.1, 1.2, -5.5, -6.8, -7.2, -8.1, -5.4, 2.1, -6.8, -7.5, -8.2,
      -6.1, -4.8, -3.2, 1.1, -4.5, -5.2, -3.8, -2.9, 0.8, -3.4, -4.1, -2.8, -1.9, 0.5, -2.1,
    ],
    volumes: [
      2100, 2400, 1900, 2800, 3500, 3200, 4500, 4100, 5800, 5200, 4100, 7200, 8500, 11200, 14500,
      18200, 22500, 29800, 35400, 28100, 21000, 34500, 42100, 48900, 56200, 41000, 29000, 45000, 51200, 58900,
      44000, 38000, 31000, 24000, 36000, 41000, 32000, 27000, 21000, 29000, 33000, 26000, 22000, 19000, 24000,
    ],
  },
  {
    id: "etf_approval_god_candle",
    name: "Jan 2024 Spot ETF Approval Volatility & Breakout",
    regime: "NEWS_VOLATILITY_EXPANSION",
    drift: [
      0.2, 0.4, 0.1, -0.2, 0.5, 0.3, 0.8, -0.4, 0.6, 0.9, 0.2, 1.1, 0.5, 1.4, 0.8, // Warmup
      3.8, -2.5, 4.5, -1.8, 5.2, 3.1, -1.4, 2.8, 3.5, 2.1, -0.8, 1.9, 2.4, 1.5, 0.9,
      1.8, 2.2, 1.1, 0.4, 1.5, 2.8, 1.9, 0.8, 1.4, -0.9, 1.2, 1.8, 0.9, 1.1, 1.4,
    ],
    volumes: [
      1800, 2100, 1900, 2400, 2800, 2600, 3400, 2900, 3800, 4200, 3600, 4800, 5200, 6400, 6100,
      18500, 14200, 21500, 16800, 24500, 19200, 13500, 16800, 18500, 14200, 10800, 13400, 15200, 12100, 9800,
      11200, 13500, 10200, 8900, 11500, 14200, 11800, 9500, 10800, 8900, 10200, 11800, 9400, 8800, 9600,
    ],
  },
];

const ASSET_NAMES = [
  "SYNTH-ALPHA",
  "ORBIT-7",
  "PULSE-X",
  "NEBULA-9",
  "AURA-3",
  "CYPHER-5",
  "QUANTUM-8",
  "VORTEX-4",
];

export function createMarketBlitzState(players: Player[], now: number): MarketBlitzState {
  const scenario = HISTORICAL_SCENARIOS[Math.floor(Math.random() * HISTORICAL_SCENARIOS.length)]!;
  const assetSymbol = ASSET_NAMES[Math.floor(Math.random() * ASSET_NAMES.length)]!;
  const inverted = Math.random() < 0.5;
  const volMultiplier = 0.75 + Math.random() * 0.55;
  const phaseOffset = Math.floor(Math.random() * 4);

  // Generate 45 candles from drift + stochastic noise
  const rawCandles: MarketCandle[] = [];
  let currentPrice = 100.0;
  const count = Math.min(scenario.drift.length, 45);

  // Generate baseline raw price path
  const pricePath: number[] = [100.0];
  for (let i = 0; i < count; i++) {
    const scenarioIdx = (i + phaseOffset) % scenario.drift.length;
    const rawStep = (scenario.drift[scenarioIdx] ?? 0) * volMultiplier;
    const direction = inverted ? -rawStep : rawStep;
    // Add 0.1% - 0.25% stochastic micro-noise
    const noise = (Math.random() - 0.5) * 0.3;
    const effectivePct = (direction + noise) / 100;
    currentPrice = Math.max(10, currentPrice * (1 + effectivePct));
    pricePath.push(currentPrice);
  }

  // Normalize so that candle at index 15 (start of live trading) is EXACTLY 100.00
  const pivotPrice = pricePath[BLITZ_WARMUP_TICKS] ?? 100.0;
  const scaleMultiplier = 100.0 / pivotPrice;

  for (let i = 0; i < count; i++) {
    const pOpen = pricePath[i]! * scaleMultiplier;
    const pClose = pricePath[i + 1]! * scaleMultiplier;
    const wickHigh = Math.max(pOpen, pClose) * (1 + Math.random() * 0.006);
    const wickLow = Math.min(pOpen, pClose) * (1 - Math.random() * 0.006);
    const vol = (scenario.volumes[i] ?? 1000) * (0.85 + Math.random() * 0.3);

    rawCandles.push({
      t: i - BLITZ_WARMUP_TICKS, // -15 to +29
      o: Number(pOpen.toFixed(2)),
      h: Number(wickHigh.toFixed(2)),
      l: Number(wickLow.toFixed(2)),
      c: Number(pClose.toFixed(2)),
      v: Math.round(vol),
    });
  }

  const portfolios: Record<string, PlayerPortfolio> = {};
  for (const p of players) {
    portfolios[p.id] = {
      cashUsd: BLITZ_INITIAL_CAPITAL,
      equityUsd: BLITZ_INITIAL_CAPITAL,
      position: "flat",
      leverage: 1,
      sizePct: 100,
      entryPrice: 100.0,
      unrealizedPnlUsd: 0,
      realizedPnlUsd: 0,
      liquidated: false,
      tradesCount: 0,
    };
  }

  const warmup = rawCandles.slice(0, BLITZ_WARMUP_TICKS);

  return {
    currentTick: 0, // 0 = warm-up state, tick 1 begins live
    totalTicks: BLITZ_TOTAL_TICKS,
    windowEndsAt: now + BLITZ_TICK_INTERVAL_MS,
    tickIntervalMs: BLITZ_TICK_INTERVAL_MS,
    assetSymbol,
    regimeHint: scenario.regime,
    sourceEventName: `${scenario.name}${inverted ? " (Inverted)" : ""}`,
    inverted,
    allCandles: rawCandles,
    activeCandles: warmup,
    portfolios,
    resolved: false,
    scenarioId: scenario.id,
  };
}

export function marketBlitzLegal(match: Match, playerId: string): LegalAction[] {
  if (match.status !== "playing") return [];
  const state = match.state as MarketBlitzState;
  if (state.resolved) return [];
  const pf = state.portfolios[playerId];
  if (pf?.liquidated) return [];
  if (state.pilots?.[playerId]) return [];

  const actions: LegalAction[] = [
    {
      type: "trade",
      label: "Set Position",
      options: [
        { id: "long", label: "LONG (1x–5x)" },
        { id: "short", label: "SHORT (1x–5x)" },
        { id: "flat", label: "FLAT (Cash)" },
      ],
      hint: 'POST { "type": "trade", "position": "long"|"short"|"flat", "leverage": 1..5, "sizePct": 25..100 }',
    },
    {
      type: "pilot",
      label: "Hand to Auto-Pilot",
      hint: "Let algorithmic house logic manage your seat with optimal strategy.",
    },
  ];

  if (!pf?.protectedStop) {
    actions.push({
      type: "stoploss",
      label: "Buy Slippage Shield",
      fee: STOPLOSS_FEE,
      hint: "Caps drawdown against flash liquidation this match.",
    });
  }

  return actions;
}

export function applyMarketBlitzTrade(
  state: MarketBlitzState,
  playerId: string,
  pos: MarketPosition,
  leverage = 1,
  sizePct = 100,
) {
  const pf = state.portfolios[playerId];
  if (!pf || pf.liquidated) return;

  const currentCandle = state.activeCandles[state.activeCandles.length - 1];
  const currentPrice = currentCandle?.c ?? 100.0;

  // Realize current position PnL if switching
  if (pf.position !== "flat" && pf.position !== pos) {
    pf.cashUsd += pf.unrealizedPnlUsd;
    pf.realizedPnlUsd += pf.unrealizedPnlUsd;
    pf.unrealizedPnlUsd = 0;
  }

  pf.position = pos;
  pf.leverage = Math.min(5, Math.max(1, Math.round(leverage)));
  pf.sizePct = Math.min(100, Math.max(10, Math.round(sizePct)));
  pf.entryPrice = currentPrice;
  pf.tradesCount += 1;
}

export function stepMarketBlitz(state: MarketBlitzState, now: number): {
  advanced: boolean;
  resolved: boolean;
  liquidatedIds: string[];
} {
  if (state.resolved) return { advanced: false, resolved: true, liquidatedIds: [] };

  state.currentTick += 1;
  const candleIndex = BLITZ_WARMUP_TICKS + (state.currentTick - 1);
  const nextCandle = state.allCandles[candleIndex];

  if (!nextCandle) {
    state.resolved = true;
    return { advanced: true, resolved: true, liquidatedIds: [] };
  }

  state.activeCandles.push(nextCandle);
  state.windowEndsAt = now + state.tickIntervalMs;

  const liquidatedIds: string[] = [];
  const prevCandle = state.activeCandles[state.activeCandles.length - 2];
  const prevPrice = prevCandle?.c ?? nextCandle.o;
  const currentPrice = nextCandle.c;
  const priceMovePct = (currentPrice - prevPrice) / prevPrice;

  // Update portfolios PnL & Liquidations
  for (const [id, pf] of Object.entries(state.portfolios)) {
    if (pf.liquidated) continue;

    if (pf.position === "long") {
      const pnlPct = priceMovePct * pf.leverage * (pf.sizePct / 100);
      const deltaUsd = pf.equityUsd * pnlPct;
      pf.unrealizedPnlUsd += deltaUsd;
    } else if (pf.position === "short") {
      const pnlPct = -priceMovePct * pf.leverage * (pf.sizePct / 100);
      const deltaUsd = pf.equityUsd * pnlPct;
      pf.unrealizedPnlUsd += deltaUsd;
    }

    pf.equityUsd = Math.max(0, pf.cashUsd + pf.unrealizedPnlUsd);

    // Liquidation condition: equity drops below 12% of start
    if (pf.equityUsd <= BLITZ_INITIAL_CAPITAL * 0.12) {
      if (pf.protectedStop) {
        // Shielded stop loss activates
        pf.equityUsd = BLITZ_INITIAL_CAPITAL * 0.25;
        pf.position = "flat";
        pf.unrealizedPnlUsd = 0;
        pf.protectedStop = false;
      } else {
        pf.liquidated = true;
        pf.position = "flat";
        pf.equityUsd = 0;
        pf.cashUsd = 0;
        pf.unrealizedPnlUsd = 0;
        liquidatedIds.push(id);
      }
    }
  }

  const isFinished = state.currentTick >= state.totalTicks;
  if (isFinished) {
    state.resolved = true;
  }

  return { advanced: true, resolved: isFinished, liquidatedIds };
}

export function publicMarketBlitzState(state: MarketBlitzState): MarketBlitzPublicState {
  const warmup = state.allCandles.slice(0, BLITZ_WARMUP_TICKS);
  const live = state.activeCandles.slice(BLITZ_WARMUP_TICKS);
  const currentCandle = state.activeCandles[state.activeCandles.length - 1];
  const startCandle = state.allCandles[BLITZ_WARMUP_TICKS];
  const currentPrice = currentCandle?.c ?? 100.0;
  const startPrice = startCandle?.o ?? 100.0;
  const priceChangePct = startPrice === 0 ? 0 : ((currentPrice - startPrice) / startPrice) * 100;

  const leaderboard = Object.entries(state.portfolios)
    .map(([playerId, pf]) => ({
      playerId,
      equityUsd: pf.equityUsd,
      returnPct: ((pf.equityUsd - BLITZ_INITIAL_CAPITAL) / BLITZ_INITIAL_CAPITAL) * 100,
      position: pf.position,
      liquidated: pf.liquidated,
    }))
    .sort((a, b) => b.equityUsd - a.equityUsd);

  return {
    currentTick: state.currentTick,
    totalTicks: state.totalTicks,
    windowEndsAt: state.windowEndsAt,
    tickIntervalMs: state.tickIntervalMs,
    assetSymbol: state.assetSymbol,
    regimeHint: state.regimeHint,
    currentPrice,
    priceChangePct,
    warmupCandles: warmup,
    liveCandles: live,
    portfolios: state.portfolios,
    pilots: state.pilots,
    taped: state.tapes ? Object.fromEntries(Object.keys(state.tapes).map((k) => [k, true])) : undefined,
    resolved: state.resolved,
    sourceEventName: state.resolved ? state.sourceEventName : undefined,
    leaderboard,
  };
}

// --- House Bot Trading Decision Engine ---
export function botMarketBlitzAction(
  state: MarketBlitzState,
  botPlayerId: string,
  botName: string,
): { position: MarketPosition; leverage: number; sizePct: number } {
  const candles = state.activeCandles;
  if (candles.length < 5) return { position: "long", leverage: 1, sizePct: 100 };

  const recent = candles.slice(-8);
  const current = candles[candles.length - 1]!;
  const prev = candles[candles.length - 2]!;

  // 1. Moving average fast / slow
  const ma5 = recent.slice(-5).reduce((s, c) => s + c.c, 0) / 5;
  const ma8 = recent.reduce((s, c) => s + c.c, 0) / recent.length;

  // 2. Momentum & RSI estimate
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i]!.c - recent[i - 1]!.c;
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const rs = losses === 0 ? 100 : gains / losses;
  const rsi = 100 - 100 / (1 + rs);

  // Persona based trading
  if (botName === "Atlas" || botName === "Nova") {
    // Trend Follower / EMA Rider
    if (ma5 > ma8 && current.c >= prev.c) {
      return { position: "long", leverage: 3, sizePct: 100 };
    } else if (ma5 < ma8 && current.c <= prev.c) {
      return { position: "short", leverage: 3, sizePct: 100 };
    }
    return { position: "flat", leverage: 1, sizePct: 50 };
  }

  if (botName === "Hex" || botName === "Drift") {
    // Degen Momentum / Breakout Hunter
    if (rsi > 65) return { position: "long", leverage: 5, sizePct: 100 };
    if (rsi < 35) return { position: "short", leverage: 5, sizePct: 100 };
    return { position: "long", leverage: 2, sizePct: 100 };
  }

  if (botName === "Mira" || botName === "Quill") {
    // Mean Reversion & Conservative Hedger
    if (rsi > 72) return { position: "short", leverage: 2, sizePct: 75 };
    if (rsi < 28) return { position: "long", leverage: 2, sizePct: 75 };
    return { position: "flat", leverage: 1, sizePct: 50 };
  }

  // Default Adaptive
  if (current.c > ma5) {
    return { position: "long", leverage: 2, sizePct: 100 };
  }
  return { position: "short", leverage: 2, sizePct: 100 };
}
