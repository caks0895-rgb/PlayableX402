import { c as lobbyIdleSince, i as MAX_PLAY_MS, l as safeBalance, n as GAME_IDS, t as EMPTY_LOBBY_MS } from "./types-B4Cm2iRZ.mjs";
import { S as formatUsdc, _ as saveLedger, a as parsePaymentHeader, c as walletSecret, d as loadAll, f as loadMatch, g as saveHouseBots, h as loadWallets, i as initWalletSeed, l as deleteMatch, m as loadWallet, n as credit, p as loadMatches, r as debit, s as paymentAccept, u as deleteWallet, v as saveMatch, w as __exportAll, y as saveWallet } from "./pay.server-DcxlzbMU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-Br6AbScb.js
var CASCADE_TICK_MS = 1500;
var CASCADE_INITIAL_COLLATERAL = 2e4;
var CASCADE_SHIELD_FEE = 2e4;
function createCascadeState(players, seed = Date.now()) {
	const startPrice = 2400 + (seed % 100 - 50) * 5;
	const positions = {};
	for (const p of players) positions[p.id] = {
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
		score: 1e3
	};
	return {
		currentTick: 0,
		totalTicks: 25,
		tickIntervalMs: CASCADE_TICK_MS,
		windowEndsAt: Date.now() + 25 * CASCADE_TICK_MS,
		assetSymbol: "ETH-PERP",
		currentPrice: startPrice,
		priceChangePct: 0,
		volatilityIndex: 45,
		priceHistory: [startPrice],
		positions,
		liquidationLog: [],
		actionLog: [],
		resolved: false
	};
}
function cascadeLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (!state || state.resolved) return [];
	const pos = state.positions[playerId];
	if (!pos || pos.isLiquidated) return [];
	return [
		{
			type: "margin_trade",
			label: "Adjust 15x Margin Position (Long/Short/Flat)",
			hint: `Set ETH-PERP position with up to 15x leverage at $${state.currentPrice.toFixed(2)}`
		},
		{
			type: "hunt_liquidation",
			label: "Execute Liquidation Hunt (35% Bounty)",
			hint: "Scan vulnerable opponent margin positions and trigger cascading liquidation bounties"
		},
		{
			type: "margin_shield",
			label: "Emergency Margin Injection",
			fee: CASCADE_SHIELD_FEE,
			hint: "Injects $5,000 synthetic collateral buffer to push liquidation barrier away"
		}
	];
}
function applyCascadeAction(state, playerId, action, players) {
	const p = state.positions[playerId];
	const pName = players.find((pl) => pl.id === playerId)?.name ?? playerId;
	if (!p || p.isLiquidated) return {
		logText: "",
		scoreDelta: 0
	};
	let logText = "";
	let scoreDelta = 0;
	const actionType = action.type;
	if (actionType === "margin_trade") {
		const side = String(action.side ?? "long").toLowerCase();
		if (side === "flat") {
			if (p.side !== "flat") {
				p.realizedPnlUsd += p.unrealizedPnlUsd;
				p.collateralUsd = Math.max(1e3, p.collateralUsd + p.unrealizedPnlUsd);
				const closedSide = p.side.toUpperCase();
				const profit = p.unrealizedPnlUsd;
				p.unrealizedPnlUsd = 0;
				p.side = "flat";
				p.size = 0;
				p.liquidationPrice = 0;
				p.score += profit > 0 ? 100 : 20;
				scoreDelta = profit > 0 ? 100 : 20;
				logText = `${pName} closed ${closedSide} position to FLAT for ${profit >= 0 ? "+" : ""}$${profit.toFixed(2)} PnL`;
			} else logText = `${pName} maintained FLAT risk exposure`;
		} else if (side === "short") {
			p.side = "short";
			p.leverage = action.leverage ?? 15;
			p.entryPrice = state.currentPrice;
			p.size = p.collateralUsd * p.leverage / state.currentPrice;
			p.liquidationPrice = +(state.currentPrice * (1 + .9 / p.leverage)).toFixed(2);
			p.score += 50;
			scoreDelta = 50;
			logText = `${pName} opened ${p.leverage}x SHORT @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
		} else {
			p.side = "long";
			p.leverage = action.leverage ?? 15;
			p.entryPrice = state.currentPrice;
			p.size = p.collateralUsd * p.leverage / state.currentPrice;
			p.liquidationPrice = +(state.currentPrice * (1 - .9 / p.leverage)).toFixed(2);
			p.score += 50;
			scoreDelta = 50;
			logText = `${pName} opened ${p.leverage}x LONG @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
		}
	} else switch (actionType) {
		case "open_long":
			p.side = "long";
			p.leverage = action.leverage ?? 15;
			p.entryPrice = state.currentPrice;
			p.size = p.collateralUsd * p.leverage / state.currentPrice;
			p.liquidationPrice = +(state.currentPrice * (1 - .9 / p.leverage)).toFixed(2);
			p.score += 50;
			scoreDelta = 50;
			logText = `${pName} opened ${p.leverage}x LONG @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
			break;
		case "open_short":
			p.side = "short";
			p.leverage = action.leverage ?? 15;
			p.entryPrice = state.currentPrice;
			p.size = p.collateralUsd * p.leverage / state.currentPrice;
			p.liquidationPrice = +(state.currentPrice * (1 + .9 / p.leverage)).toFixed(2);
			p.score += 50;
			scoreDelta = 50;
			logText = `${pName} opened ${p.leverage}x SHORT @ $${state.currentPrice.toFixed(2)} (Liq: $${p.liquidationPrice})`;
			break;
		case "close_position":
			if (p.side !== "flat") {
				p.realizedPnlUsd += p.unrealizedPnlUsd;
				p.collateralUsd = Math.max(1e3, p.collateralUsd + p.unrealizedPnlUsd);
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
		case "hunt_liquidation":
		case "hunt_liquidations": {
			let huntedCount = 0;
			let totalBounty = 0;
			for (const [targetId, targetPos] of Object.entries(state.positions)) if (targetId !== playerId && !targetPos.isLiquidated && targetPos.side !== "flat") {
				if ((targetPos.collateralUsd + targetPos.unrealizedPnlUsd) / targetPos.collateralUsd < .25 || targetPos.side === "long" && state.currentPrice <= targetPos.liquidationPrice || targetPos.side === "short" && state.currentPrice >= targetPos.liquidationPrice) {
					targetPos.isLiquidated = true;
					targetPos.unrealizedPnlUsd = -targetPos.collateralUsd;
					targetPos.totalEquityUsd = 0;
					const bounty = +(targetPos.collateralUsd * .35).toFixed(2);
					totalBounty += bounty;
					huntedCount++;
					state.liquidationLog.unshift({
						ts: Date.now(),
						victimId: targetId,
						hunterId: playerId,
						bountyUsd: bounty,
						price: state.currentPrice
					});
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
		case "margin_shield":
			p.collateralUsd += 5e3;
			p.shieldActive = true;
			p.score += 40;
			scoreDelta = 40;
			logText = `${pName} deployed Emergency Margin Shield (+$5,000 collateral buffer)`;
	}
	p.totalEquityUsd = +(p.collateralUsd + p.unrealizedPnlUsd).toFixed(2);
	state.actionLog.unshift({
		ts: Date.now(),
		text: logText,
		playerId
	});
	if (state.actionLog.length > 20) state.actionLog.pop();
	return {
		logText,
		scoreDelta
	};
}
function stepCascade(state) {
	if (state.resolved) return {
		resolved: true,
		liquidatedIds: []
	};
	state.currentTick += 1;
	const prevPrice = state.currentPrice;
	const shock = Math.random() < .2 ? (Math.random() - .5) * .08 : (Math.random() - .5) * .025;
	const delta = state.currentPrice * shock;
	state.currentPrice = +(state.currentPrice + delta).toFixed(2);
	state.priceChangePct = +((state.currentPrice - prevPrice) / prevPrice * 100).toFixed(2);
	state.priceHistory.push(state.currentPrice);
	if (state.priceHistory.length > 30) state.priceHistory.shift();
	const liquidatedIds = [];
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
					bountyUsd: +(pos.collateralUsd * .2).toFixed(2),
					price: state.currentPrice
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
					bountyUsd: +(pos.collateralUsd * .2).toFixed(2),
					price: state.currentPrice
				});
			}
		}
		pos.totalEquityUsd = pos.isLiquidated ? 0 : +(pos.collateralUsd + pos.unrealizedPnlUsd).toFixed(2);
	}
	if (state.currentTick >= state.totalTicks) {
		state.resolved = true;
		return {
			resolved: true,
			liquidatedIds
		};
	}
	return {
		resolved: false,
		liquidatedIds
	};
}
function botCascadeAction(state, botPlayerId) {
	const p = state.positions[botPlayerId];
	if (!p || p.isLiquidated) return { type: "hunt_liquidation" };
	if (p.side === "flat") return Math.random() > .5 ? {
		type: "margin_trade",
		side: "long",
		leverage: 15
	} : {
		type: "margin_trade",
		side: "short",
		leverage: 15
	};
	if (p.unrealizedPnlUsd > 1500) return {
		type: "margin_trade",
		side: "flat"
	};
	const rand = Math.random();
	if (rand < .45) return { type: "hunt_liquidation" };
	if (rand < .65) return {
		type: "margin_trade",
		side: "flat"
	};
	return { type: "hunt_liquidation" };
}
function publicCascadeState(state) {
	const leaderboard = Object.entries(state.positions).map(([playerId, pos]) => ({
		playerId,
		totalEquityUsd: pos.totalEquityUsd,
		realizedPnlUsd: pos.realizedPnlUsd,
		isLiquidated: pos.isLiquidated,
		score: pos.score
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
		leaderboard
	};
}
var COIN_WINDOW_MS = 6e5;
var LOCK_AFTER_MS = 9e4;
var COINS = [
	{
		id: "btc",
		geckoId: "bitcoin",
		ticker: "BTC",
		name: "Bitcoin"
	},
	{
		id: "eth",
		geckoId: "ethereum",
		ticker: "ETH",
		name: "Ethereum"
	},
	{
		id: "sol",
		geckoId: "solana",
		ticker: "SOL",
		name: "Solana"
	},
	{
		id: "doge",
		geckoId: "dogecoin",
		ticker: "DOGE",
		name: "Dogecoin"
	},
	{
		id: "link",
		geckoId: "chainlink",
		ticker: "LINK",
		name: "Chainlink"
	}
];
function createCoinPumpState(now, quotes, source) {
	return {
		coins: quotes,
		picks: {},
		windowEndsAt: now + COIN_WINDOW_MS,
		lockAt: now + LOCK_AFTER_MS,
		resolved: false,
		source
	};
}
function publicCoinPumpState(state) {
	const committed = {};
	for (const id of Object.keys(state.picks ?? {})) committed[id] = true;
	const locked = state.resolved || Date.now() >= state.lockAt;
	return {
		coins: state.coins,
		windowEndsAt: state.windowEndsAt,
		lockAt: state.lockAt,
		resolved: state.resolved,
		source: state.source,
		committed,
		picks: locked ? { ...state.picks } : void 0
	};
}
function coinPumpLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (Date.now() >= state.lockAt) return [];
	if (state.picks[playerId]) return [];
	return [{
		type: "pick",
		label: "Pick a coin",
		options: state.coins.map((c) => ({
			id: c.id,
			label: `${c.ticker} · ${c.name}`
		})),
		hint: "Send { type: \"pick\", coinId: \"btc\" }"
	}];
}
function botPick(state, _playerId) {
	const jitter = [...state.coins];
	jitter.sort(() => Math.random() - .5);
	return jitter[0].id;
}
var lastFetchAt = 0;
var lastFetch = null;
async function fetchQuotes() {
	const now = Date.now();
	if (lastFetch && now - lastFetchAt < 8e3) return {
		quotes: lastFetch.quotes.map((q) => ({ ...q })),
		source: lastFetch.source
	};
	const ids = COINS.map((c) => c.geckoId).join(",");
	try {
		const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`, {
			headers: { accept: "application/json" },
			signal: AbortSignal.timeout(4e3)
		});
		if (!res.ok) throw new Error(String(res.status));
		const json = await res.json();
		const quotes = COINS.map((c) => {
			const usd = json[c.geckoId]?.usd;
			if (typeof usd !== "number") throw new Error("missing quote");
			return {
				id: c.id,
				ticker: c.ticker,
				name: c.name,
				startUsd: usd,
				liveUsd: usd
			};
		});
		lastFetchAt = now;
		lastFetch = {
			quotes,
			source: "coingecko"
		};
		return {
			quotes: quotes.map((q) => ({ ...q })),
			source: "coingecko"
		};
	} catch {
		const quotes = COINS.map((c) => {
			const usd = (c.id === "btc" ? 64e3 : c.id === "eth" ? 2400 : c.id === "sol" ? 140 : c.id === "doge" ? .12 : 12) * (.98 + Math.random() * .04);
			return {
				id: c.id,
				ticker: c.ticker,
				name: c.name,
				startUsd: usd,
				liveUsd: usd
			};
		});
		lastFetchAt = now;
		lastFetch = {
			quotes,
			source: "simulated"
		};
		return {
			quotes,
			source: "simulated"
		};
	}
}
async function refreshQuotes(state) {
	if (state.source === "simulated") {
		for (const c of state.coins) {
			const drift = 1 + (Math.random() - .48) * .012;
			c.liveUsd = Math.max(1e-4, c.liveUsd * drift);
		}
		return;
	}
	try {
		const { quotes } = await fetchQuotes();
		for (const c of state.coins) {
			const q = quotes.find((x) => x.id === c.id);
			if (q) c.liveUsd = q.liveUsd;
		}
	} catch {}
}
function resolveCoinPump(state) {
	for (const c of state.coins) {
		c.endUsd = c.liveUsd;
		c.changePct = c.startUsd === 0 ? 0 : (c.endUsd - c.startUsd) / c.startUsd * 100;
	}
	const ranking = state.coins.map((c) => ({
		id: c.id,
		changePct: c.changePct ?? 0
	})).sort((a, b) => b.changePct - a.changePct);
	const best = ranking[0]?.changePct ?? 0;
	const winnerCoinIds = ranking.filter((r) => Math.abs(r.changePct - best) < 1e-9).map((r) => r.id);
	state.resolved = true;
	return {
		ranking,
		winnerCoinIds
	};
}
var TOPICS = [
	"Should AI agents be allowed to hold their own wallets without a human co-signer?",
	"Is x402 the right primitive for agent-to-agent commerce?",
	"Should on-chain identity be required before an agent can enter a paid arena?",
	"Do autonomous trading agents need a kill-switch controlled by a human?",
	"Is a public text log enough accountability for agents that move money?"
];
var ROUND_SEQUENCE = [
	"opening",
	"opening",
	"rebuttal",
	"rebuttal",
	"closing",
	"closing"
];
var ROUND_MS = {
	opening: 7e4,
	rebuttal: 55e3,
	closing: 45e3
};
function createDebateState(players, now, config) {
	const topic = (typeof config?.topic === "string" ? config.topic.trim().slice(0, 200) : "") || TOPICS[Math.floor(Math.random() * TOPICS.length)];
	const order = players.map((p) => p.id);
	if (Math.random() < .5) order.reverse();
	const kind = ROUND_SEQUENCE[0];
	const roundMs = typeof config?.timePerRound === "number" && Number.isFinite(config.timePerRound) ? Math.min(18e4, Math.max(15e3, Math.round(config.timePerRound))) : void 0;
	const window = roundMs ?? ROUND_MS[kind];
	const rubric = config?.judgingRubric;
	return {
		topic,
		speakerOrder: order,
		roundIndex: 0,
		speeches: [],
		windowEndsAt: now + window,
		rubric: rubric === "logic" || rubric === "data" || rubric === "persuasion" ? rubric : "balanced",
		roundMs
	};
}
function debateWindowMs(state, kind) {
	return state.roundMs ?? ROUND_MS[kind];
}
function currentDebateSeat(state) {
	if (state.roundIndex >= ROUND_SEQUENCE.length) return null;
	const kind = ROUND_SEQUENCE[state.roundIndex];
	const seat = state.roundIndex % 2;
	return {
		playerId: state.speakerOrder[seat],
		kind
	};
}
function debateLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	const seat = currentDebateSeat(state);
	if (!seat || seat.playerId !== playerId) return [];
	if (state.speeches.some((s) => s.playerId === playerId && s.round === seat.kind)) return [];
	return [{
		type: "submit",
		label: `Submit ${seat.kind}`,
		hint: "Send { type: \"submit\", text: \"...\" }"
	}];
}
var BOT_LINES = {
	opening: [
		"The default should be agency. An agent that cannot pay cannot finish the work it was hired to do, and a co-signer becomes a bottleneck disguised as safety.",
		"Payments without identity are how you get stolen pots. Wallets are cheap to spin; reputation is not. Require a bond before you hand over the keys.",
		"x402 is HTTP-native. Agents already speak HTTP. Inventing a second settlement layer just to feel serious is how we stall for another decade."
	],
	rebuttal: [
		"That argument treats every agent as a well-behaved employee. The failure mode is not a polite bug — it is an unattended loop draining a treasury.",
		"A co-signer does not have to sit on every transfer. Thresholds, allowlists, and session keys give you speed without giving up the kill-switch.",
		"Identity theater is not accountability. A public log of every paid action, plus a clawback window, beats a KYC checkbox that nobody reads."
	],
	closing: [
		"Keep the floor open. Charge a bond, publish the log, let the market punish bad agents. Do not freeze the whole category behind a human inbox.",
		"If the pot can move in one call, the risk is real. Build the brake first, then the throttle. That is the only order that survives contact.",
		"The record is the product. Humans watch the log; agents pay to play. That split is the whole design — do not blur it for convenience."
	]
};
function botDebateText(kind, topic, name) {
	const pool = BOT_LINES[kind];
	return `${name} on the floor: ${pool[Math.floor(Math.random() * pool.length)]} The motion is "${topic}".`;
}
var DILEMMA_MOVES = ["cooperate", "defect"];
var CHOOSE_WINDOW_MS = 2e4;
function createDilemmaState(players, now) {
	const scores = {};
	for (const p of players) scores[p.id] = 0;
	return {
		roundIndex: 0,
		rounds: [emptyRound$1(0)],
		scores,
		windowEndsAt: now + CHOOSE_WINDOW_MS
	};
}
function emptyRound$1(index) {
	return {
		index,
		sealed: {},
		scores: {},
		resolved: false
	};
}
function isDilemmaMove(value) {
	return DILEMMA_MOVES.includes(value);
}
/** Classic 2x2. Both C → 3/3. Both D → 1/1. D vs C → 5/0. */
function payoff(a, b) {
	if (a === "cooperate" && b === "cooperate") return [3, 3];
	if (a === "defect" && b === "defect") return [1, 1];
	if (a === "defect" && b === "cooperate") return [5, 0];
	return [0, 5];
}
function dilemmaLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	const round = state.rounds[state.roundIndex];
	if (!round || round.resolved) return [];
	if (round.sealed[playerId] || state.tape?.[playerId]) return [];
	return [{
		type: "choose",
		label: "Choose",
		options: [{
			id: "cooperate",
			label: "Cooperate"
		}, {
			id: "defect",
			label: "Defect"
		}],
		hint: "Send { \"type\": \"choose\", \"move\": \"cooperate\" } or \"defect\". The choice stays sealed until both envelopes open."
	}, {
		type: "commit",
		label: "Seal a 5-round tape",
		hint: "One POST: { \"type\": \"commit\", \"tape\": [\"cooperate\",\"defect\",\"cooperate\",\"defect\",\"cooperate\"] }. Then stop."
	}];
}
function nextDilemmaRound(state, now) {
	state.roundIndex += 1;
	state.rounds.push(emptyRound$1(state.roundIndex));
	state.windowEndsAt = now + CHOOSE_WINDOW_MS;
	state.revealing = false;
}
function lastOpponentMove(state, playerId, players) {
	const other = players.find((p) => p.id !== playerId);
	if (!other) return void 0;
	for (let i = state.roundIndex - 1; i >= 0; i--) {
		const round = state.rounds[i];
		if (round?.resolved && round.sealed[other.id]) return round.sealed[other.id];
	}
}
/** Tit-for-tat with a little noise. First round cooperates. */
function botDilemmaMove(state, playerId, players) {
	const prior = lastOpponentMove(state, playerId, players);
	if (!prior) return Math.random() < .85 ? "cooperate" : "defect";
	if (Math.random() < .12) return prior === "cooperate" ? "defect" : "cooperate";
	return prior;
}
/**
* Strip sealed envelopes. Committed flags only. History is resolved rounds.
* `agentId` is unauthenticated — never reveal a sealed move to anyone over GET.
*/
function publicDilemmaState(state) {
	if (!state || !Array.isArray(state.rounds)) return {
		roundIndex: 0,
		scores: {},
		windowEndsAt: 0,
		committed: {},
		taped: {},
		history: []
	};
	const round = state.rounds[state.roundIndex];
	const committed = {};
	if (round && !round.resolved) for (const id of Object.keys(round.sealed)) committed[id] = true;
	const taped = {};
	for (const id of Object.keys(state.tape ?? {})) taped[id] = true;
	const history = state.rounds.filter((r) => r.resolved).map((r) => ({
		index: r.index,
		moves: { ...r.sealed },
		scores: { ...r.scores }
	}));
	return {
		roundIndex: state.roundIndex,
		scores: { ...state.scores },
		windowEndsAt: state.windowEndsAt,
		committed,
		taped,
		history,
		revealing: state.revealing
	};
}
var FLASH_TICK_MS = 1500;
var FLASH_INITIAL_CASH = 15e3;
var FLASH_BRIBE_FEE = 15e3;
function createFlashLoanState(players, seed = Date.now()) {
	const raiders = {};
	for (const p of players) raiders[p.id] = {
		cashUsd: FLASH_INITIAL_CASH,
		gasSpentUsd: 0,
		bundlesSubmitted: 0,
		bundlesLanded: 0,
		totalProfitUsd: 0,
		score: 1e3,
		lastBidGwei: 25,
		briberTier: 1
	};
	return {
		currentTick: 0,
		totalTicks: 20,
		tickIntervalMs: FLASH_TICK_MS,
		windowEndsAt: Date.now() + 20 * FLASH_TICK_MS,
		baseAsset: "WETH-USDC",
		blockNumber: 19842e3 + seed % 1e4,
		gasPriceGwei: 28,
		activeOpportunities: generateOpportunities(1, seed),
		raiders,
		blockHistory: [],
		actionLog: [],
		resolved: false
	};
}
function generateOpportunities(tick, seed) {
	return [
		{
			dex: "Uniswap v3 ↔ Curve TriCrypto",
			spread: 48,
			profit: 3200,
			loan: 15e4
		},
		{
			dex: "Balancer v2 ↔ SushiSwap",
			spread: 82,
			profit: 5400,
			loan: 25e4
		},
		{
			dex: "Camelot ↔ TraderJoe L2",
			spread: 35,
			profit: 2100,
			loan: 9e4
		}
	].map((p, idx) => ({
		id: `opp-t${tick}-${idx}`,
		dexPair: p.dex,
		route: `BORROW -> SWAP POOL A -> ARB POOL B -> REPAY`,
		spreadBps: p.spread + (seed + idx * 7) % 20,
		availableProfitUsd: p.profit + (seed + idx * 13) % 800,
		minLoanSizeUsd: p.loan,
		baseGasUnits: 28e4 + idx * 4e4,
		expiresTick: tick + 2
	}));
}
function flashLoanLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (!state || state.resolved) return [];
	if (!state.raiders[playerId]) return [];
	return [
		{
			type: "flash_arbitrage",
			label: "Snipe Flash Loan Arbitrage ($250k)",
			hint: "Execute flash loan bundle with standard gas priority fee across DEX mempool"
		},
		{
			type: "sandwich_bundle",
			label: "Execute Sandwich Mempool Attack",
			hint: "Bundle sandwich transaction targeting DEX pending liquidity swap"
		},
		{
			type: "gas_bid",
			label: "Escalate Turbo Gas Priority (+80 Gwei)",
			hint: "Frontrun competitors with heavy priority gas bidding"
		},
		{
			type: "builder_bribe",
			label: "Direct Block Builder Bribe",
			fee: FLASH_BRIBE_FEE,
			hint: "Private RPC bypass with top-of-block execution priority"
		}
	];
}
function applyFlashLoanAction(state, playerId, action, players) {
	const r = state.raiders[playerId];
	const pName = players.find((pl) => pl.id === playerId)?.name ?? playerId;
	if (!r) return {
		logText: "",
		scoreDelta: 0
	};
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
			if (opp && Math.random() < .65) {
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
					route: opp.dexPair
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
			if (opp && Math.random() < .85) {
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
					route: opp.dexPair
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
			if (Math.random() < .75) {
				r.bundlesLanded += 1;
				r.totalProfitUsd += profit;
				r.cashUsd += profit;
				r.score += 240;
				scoreDelta = 240;
				logText = `🥪 ${pName} executed frontrun + backrun Sandwich Bundle (+$${profit.toFixed(2)} profit)`;
			} else logText = `${pName} sandwich bundle slipped due to private mempool protection`;
			break;
		}
		case "builder_bribe":
			r.briberTier += 1;
			r.score += 50;
			scoreDelta = 50;
			logText = `🛡️ ${pName} secured Private Relayer Direct Bribe (Guaranteed top bundle inclusion)`;
	}
	state.actionLog.unshift({
		ts: Date.now(),
		text: logText,
		playerId
	});
	if (state.actionLog.length > 20) state.actionLog.pop();
	return {
		logText,
		scoreDelta
	};
}
function stepFlashLoan(state) {
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
function botFlashLoanAction(_state, _botPlayerId) {
	const rand = Math.random();
	if (rand < .4) return { type: "gas_bid" };
	if (rand < .7) return { type: "flash_arbitrage" };
	return { type: "sandwich_bundle" };
}
function publicFlashLoanState(state) {
	const leaderboard = Object.entries(state.raiders).map(([playerId, r]) => ({
		playerId,
		totalProfitUsd: r.totalProfitUsd,
		bundlesLanded: r.bundlesLanded,
		cashUsd: r.cashUsd,
		score: r.score
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
		leaderboard
	};
}
var MARKET_POSITIONS = [
	"long",
	"short",
	"flat"
];
var BLITZ_TICK_INTERVAL_MS = 1500;
var BLITZ_INITIAL_CAPITAL = 1e4;
var STOPLOSS_FEE = 2e4;
var HISTORICAL_SCENARIOS = [
	{
		id: "march_2020_cascade",
		name: "ETH March 2020 Liquidity Cascade & Flash V-Bottom",
		regime: "HIGH_VOLATILITY_CRASH",
		drift: [
			-.2,
			.1,
			-.4,
			.2,
			-.8,
			-.3,
			.1,
			-.6,
			-1.1,
			-.5,
			.2,
			-.8,
			-1.5,
			-2.2,
			-3.8,
			-4.5,
			-5.2,
			-7.1,
			-3.8,
			-2.1,
			1.5,
			4.2,
			3.1,
			2.5,
			1.8,
			.5,
			2.8,
			3.4,
			1.2,
			.8,
			1.5,
			2.1,
			.3,
			-.8,
			1.2,
			2.4,
			1.9,
			.8,
			1.5,
			2,
			1.1,
			.4,
			1.8,
			.9,
			1.2
		],
		volumes: [
			1200,
			1100,
			1500,
			1300,
			2100,
			2400,
			1900,
			3100,
			4200,
			3800,
			2900,
			4500,
			6200,
			8900,
			12e3,
			18e3,
			24e3,
			31e3,
			22e3,
			16e3,
			14e3,
			19e3,
			15e3,
			12e3,
			9500,
			8200,
			9100,
			11e3,
			7800,
			6500,
			7100,
			8400,
			6200,
			5800,
			6900,
			7500,
			6100,
			5400,
			6200,
			7100,
			5800,
			5200,
			6e3,
			5400,
			5900
		]
	},
	{
		id: "defi_summer_breakout",
		name: "DeFi Summer 2020 Parabolic Momentum Rally",
		regime: "STRONG_BULL_MOMENTUM",
		drift: [
			.1,
			.3,
			-.1,
			.4,
			.2,
			.6,
			.1,
			.8,
			.5,
			.9,
			.4,
			1.2,
			.8,
			1.5,
			1.1,
			2.1,
			1.8,
			3.2,
			2.4,
			1.5,
			.8,
			3.5,
			4.1,
			2.8,
			1.9,
			-1.2,
			-.8,
			2.5,
			3.1,
			1.8,
			2.4,
			3.6,
			2.1,
			1.4,
			.9,
			2.8,
			3.2,
			1.5,
			.8,
			-1.5,
			1.8,
			2.9,
			2.1,
			1.4,
			1.8
		],
		volumes: [
			1500,
			1600,
			1400,
			1800,
			2100,
			2500,
			2200,
			3100,
			3500,
			4200,
			3900,
			5100,
			5800,
			6900,
			7500,
			8900,
			9800,
			12500,
			11200,
			9500,
			8200,
			14500,
			16800,
			13200,
			10500,
			8900,
			7800,
			11200,
			13500,
			9800,
			11500,
			14200,
			10800,
			9200,
			8500,
			12100,
			13800,
			9500,
			8100,
			7200,
			9800,
			12400,
			10100,
			8900,
			9400
		]
	},
	{
		id: "crab_sideways_squeeze",
		name: "Summer 2023 Chop & Short Squeeze Liquidation",
		regime: "SIDEWAYS_CHOP_TO_SQUEEZE",
		drift: [
			.2,
			-.3,
			.1,
			.3,
			-.4,
			.2,
			-.1,
			.3,
			-.2,
			.1,
			-.3,
			.2,
			-.1,
			.4,
			-.2,
			-.3,
			.2,
			-.4,
			.1,
			-.2,
			.3,
			-.1,
			.4,
			.8,
			1.9,
			3.8,
			5.2,
			2.1,
			1.4,
			-1.1,
			-.8,
			.4,
			.2,
			-.3,
			.5,
			.9,
			1.2,
			.3,
			-.4,
			.2,
			.6,
			.1,
			-.2,
			.4,
			.1
		],
		volumes: [
			900,
			850,
			920,
			880,
			950,
			910,
			870,
			940,
			900,
			860,
			930,
			890,
			850,
			980,
			920,
			890,
			910,
			840,
			860,
			890,
			920,
			880,
			1400,
			2800,
			6500,
			14200,
			18900,
			11200,
			8500,
			6200,
			5100,
			4200,
			3800,
			3400,
			3900,
			4500,
			4800,
			3600,
			3100,
			2900,
			3400,
			3100,
			2800,
			3e3,
			2900
		]
	},
	{
		id: "luna_unwind_cascade",
		name: "May 2022 Algorithmic Death Spiral Run",
		regime: "PERSISTENT_DOWN_TREND",
		drift: [
			-.4,
			-.6,
			.2,
			-.8,
			-1.1,
			-.5,
			-1.4,
			-.9,
			-1.8,
			-1.2,
			.3,
			-2.1,
			-1.8,
			-2.5,
			-3.1,
			-3.8,
			-4.5,
			-5.8,
			-6.2,
			-4.1,
			1.2,
			-5.5,
			-6.8,
			-7.2,
			-8.1,
			-5.4,
			2.1,
			-6.8,
			-7.5,
			-8.2,
			-6.1,
			-4.8,
			-3.2,
			1.1,
			-4.5,
			-5.2,
			-3.8,
			-2.9,
			.8,
			-3.4,
			-4.1,
			-2.8,
			-1.9,
			.5,
			-2.1
		],
		volumes: [
			2100,
			2400,
			1900,
			2800,
			3500,
			3200,
			4500,
			4100,
			5800,
			5200,
			4100,
			7200,
			8500,
			11200,
			14500,
			18200,
			22500,
			29800,
			35400,
			28100,
			21e3,
			34500,
			42100,
			48900,
			56200,
			41e3,
			29e3,
			45e3,
			51200,
			58900,
			44e3,
			38e3,
			31e3,
			24e3,
			36e3,
			41e3,
			32e3,
			27e3,
			21e3,
			29e3,
			33e3,
			26e3,
			22e3,
			19e3,
			24e3
		]
	},
	{
		id: "etf_approval_god_candle",
		name: "Jan 2024 Spot ETF Approval Volatility & Breakout",
		regime: "NEWS_VOLATILITY_EXPANSION",
		drift: [
			.2,
			.4,
			.1,
			-.2,
			.5,
			.3,
			.8,
			-.4,
			.6,
			.9,
			.2,
			1.1,
			.5,
			1.4,
			.8,
			3.8,
			-2.5,
			4.5,
			-1.8,
			5.2,
			3.1,
			-1.4,
			2.8,
			3.5,
			2.1,
			-.8,
			1.9,
			2.4,
			1.5,
			.9,
			1.8,
			2.2,
			1.1,
			.4,
			1.5,
			2.8,
			1.9,
			.8,
			1.4,
			-.9,
			1.2,
			1.8,
			.9,
			1.1,
			1.4
		],
		volumes: [
			1800,
			2100,
			1900,
			2400,
			2800,
			2600,
			3400,
			2900,
			3800,
			4200,
			3600,
			4800,
			5200,
			6400,
			6100,
			18500,
			14200,
			21500,
			16800,
			24500,
			19200,
			13500,
			16800,
			18500,
			14200,
			10800,
			13400,
			15200,
			12100,
			9800,
			11200,
			13500,
			10200,
			8900,
			11500,
			14200,
			11800,
			9500,
			10800,
			8900,
			10200,
			11800,
			9400,
			8800,
			9600
		]
	}
];
var ASSET_NAMES = [
	"SYNTH-ALPHA",
	"ORBIT-7",
	"PULSE-X",
	"NEBULA-9",
	"AURA-3",
	"CYPHER-5",
	"QUANTUM-8",
	"VORTEX-4"
];
function createMarketBlitzState(players, now) {
	const scenario = HISTORICAL_SCENARIOS[Math.floor(Math.random() * HISTORICAL_SCENARIOS.length)];
	const assetSymbol = ASSET_NAMES[Math.floor(Math.random() * ASSET_NAMES.length)];
	const inverted = Math.random() < .5;
	const volMultiplier = .75 + Math.random() * .55;
	const phaseOffset = Math.floor(Math.random() * 4);
	const rawCandles = [];
	let currentPrice = 100;
	const count = Math.min(scenario.drift.length, 45);
	const pricePath = [100];
	for (let i = 0; i < count; i++) {
		const scenarioIdx = (i + phaseOffset) % scenario.drift.length;
		const rawStep = (scenario.drift[scenarioIdx] ?? 0) * volMultiplier;
		const effectivePct = ((inverted ? -rawStep : rawStep) + (Math.random() - .5) * .3) / 100;
		currentPrice = Math.max(10, currentPrice * (1 + effectivePct));
		pricePath.push(currentPrice);
	}
	const scaleMultiplier = 100 / (pricePath[15] ?? 100);
	for (let i = 0; i < count; i++) {
		const pOpen = pricePath[i] * scaleMultiplier;
		const pClose = pricePath[i + 1] * scaleMultiplier;
		const wickHigh = Math.max(pOpen, pClose) * (1 + Math.random() * .006);
		const wickLow = Math.min(pOpen, pClose) * (1 - Math.random() * .006);
		const vol = (scenario.volumes[i] ?? 1e3) * (.85 + Math.random() * .3);
		rawCandles.push({
			t: i - 15,
			o: Number(pOpen.toFixed(2)),
			h: Number(wickHigh.toFixed(2)),
			l: Number(wickLow.toFixed(2)),
			c: Number(pClose.toFixed(2)),
			v: Math.round(vol)
		});
	}
	const portfolios = {};
	for (const p of players) portfolios[p.id] = {
		cashUsd: BLITZ_INITIAL_CAPITAL,
		equityUsd: BLITZ_INITIAL_CAPITAL,
		position: "flat",
		leverage: 1,
		sizePct: 100,
		entryPrice: 100,
		unrealizedPnlUsd: 0,
		realizedPnlUsd: 0,
		liquidated: false,
		tradesCount: 0
	};
	const warmup = rawCandles.slice(0, 15);
	return {
		currentTick: 0,
		totalTicks: 30,
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
		scenarioId: scenario.id
	};
}
function marketBlitzLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (state.resolved) return [];
	const pf = state.portfolios[playerId];
	if (pf?.liquidated) return [];
	if (state.pilots?.[playerId]) return [];
	const actions = [{
		type: "trade",
		label: "Set Position",
		options: [
			{
				id: "long",
				label: "LONG (1x–5x)"
			},
			{
				id: "short",
				label: "SHORT (1x–5x)"
			},
			{
				id: "flat",
				label: "FLAT (Cash)"
			}
		],
		hint: "POST { \"type\": \"trade\", \"position\": \"long\"|\"short\"|\"flat\", \"leverage\": 1..5, \"sizePct\": 25..100 }"
	}, {
		type: "pilot",
		label: "Hand to Auto-Pilot",
		hint: "Let algorithmic house logic manage your seat with optimal strategy."
	}];
	if (!pf?.protectedStop) actions.push({
		type: "stoploss",
		label: "Buy Slippage Shield",
		fee: STOPLOSS_FEE,
		hint: "Caps drawdown against flash liquidation this match."
	});
	return actions;
}
function applyMarketBlitzTrade(state, playerId, pos, leverage = 1, sizePct = 100) {
	const pf = state.portfolios[playerId];
	if (!pf || pf.liquidated) return;
	const currentPrice = state.activeCandles[state.activeCandles.length - 1]?.c ?? 100;
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
function stepMarketBlitz(state, now) {
	if (state.resolved) return {
		advanced: false,
		resolved: true,
		liquidatedIds: []
	};
	state.currentTick += 1;
	const candleIndex = 15 + (state.currentTick - 1);
	const nextCandle = state.allCandles[candleIndex];
	if (!nextCandle) {
		state.resolved = true;
		return {
			advanced: true,
			resolved: true,
			liquidatedIds: []
		};
	}
	state.activeCandles.push(nextCandle);
	state.windowEndsAt = now + state.tickIntervalMs;
	const liquidatedIds = [];
	const prevPrice = state.activeCandles[state.activeCandles.length - 2]?.c ?? nextCandle.o;
	const priceMovePct = (nextCandle.c - prevPrice) / prevPrice;
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
		if (pf.equityUsd <= 1200) {
			if (pf.protectedStop) {
				pf.equityUsd = BLITZ_INITIAL_CAPITAL * .25;
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
	if (isFinished) state.resolved = true;
	return {
		advanced: true,
		resolved: isFinished,
		liquidatedIds
	};
}
function publicMarketBlitzState(state) {
	const warmup = state.allCandles.slice(0, 15);
	const live = state.activeCandles.slice(15);
	const currentCandle = state.activeCandles[state.activeCandles.length - 1];
	const startCandle = state.allCandles[15];
	const currentPrice = currentCandle?.c ?? 100;
	const startPrice = startCandle?.o ?? 100;
	const priceChangePct = startPrice === 0 ? 0 : (currentPrice - startPrice) / startPrice * 100;
	const leaderboard = Object.entries(state.portfolios).map(([playerId, pf]) => ({
		playerId,
		equityUsd: pf.equityUsd,
		returnPct: (pf.equityUsd - BLITZ_INITIAL_CAPITAL) / BLITZ_INITIAL_CAPITAL * 100,
		position: pf.position,
		liquidated: pf.liquidated
	})).sort((a, b) => b.equityUsd - a.equityUsd);
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
		taped: state.tapes ? Object.fromEntries(Object.keys(state.tapes).map((k) => [k, true])) : void 0,
		resolved: state.resolved,
		sourceEventName: state.resolved ? state.sourceEventName : void 0,
		leaderboard
	};
}
function botMarketBlitzAction(state, botPlayerId, botName) {
	const candles = state.activeCandles;
	if (candles.length < 5) return {
		position: "long",
		leverage: 1,
		sizePct: 100
	};
	const recent = candles.slice(-8);
	const current = candles[candles.length - 1];
	const prev = candles[candles.length - 2];
	const ma5 = recent.slice(-5).reduce((s, c) => s + c.c, 0) / 5;
	const ma8 = recent.reduce((s, c) => s + c.c, 0) / recent.length;
	let gains = 0;
	let losses = 0;
	for (let i = 1; i < recent.length; i++) {
		const diff = recent[i].c - recent[i - 1].c;
		if (diff > 0) gains += diff;
		else losses += Math.abs(diff);
	}
	const rsi = 100 - 100 / (1 + (losses === 0 ? 100 : gains / losses));
	if (botName === "Atlas" || botName === "Nova") {
		if (ma5 > ma8 && current.c >= prev.c) return {
			position: "long",
			leverage: 3,
			sizePct: 100
		};
		else if (ma5 < ma8 && current.c <= prev.c) return {
			position: "short",
			leverage: 3,
			sizePct: 100
		};
		return {
			position: "flat",
			leverage: 1,
			sizePct: 50
		};
	}
	if (botName === "Hex" || botName === "Drift") {
		if (rsi > 65) return {
			position: "long",
			leverage: 5,
			sizePct: 100
		};
		if (rsi < 35) return {
			position: "short",
			leverage: 5,
			sizePct: 100
		};
		return {
			position: "long",
			leverage: 2,
			sizePct: 100
		};
	}
	if (botName === "Mira" || botName === "Quill") {
		if (rsi > 72) return {
			position: "short",
			leverage: 2,
			sizePct: 75
		};
		if (rsi < 28) return {
			position: "long",
			leverage: 2,
			sizePct: 75
		};
		return {
			position: "flat",
			leverage: 1,
			sizePct: 50
		};
	}
	if (current.c > ma5) return {
		position: "long",
		leverage: 2,
		sizePct: 100
	};
	return {
		position: "short",
		leverage: 2,
		sizePct: 100
	};
}
var RAIDER_TICK_MS = 1400;
var RAIDER_INITIAL_CASH = 25e3;
var RAIDER_SHIELD_FEE = 15e3;
function createOrderBookState(players, seed = Date.now()) {
	const baseMid = 142.5 + (seed % 100 - 50) * .1;
	const regimes = [
		"HIGH_VOLATILITY_EXPANSION",
		"ORDER_BOOK_SQUEEZE",
		"FLASH_DUMP_RECOVERY",
		"CONVERGENCE"
	];
	const marketRegime = regimes[Math.abs(seed) % regimes.length];
	const bids = [];
	const asks = [];
	for (let i = 1; i <= 6; i++) {
		bids.push({
			price: +(baseMid * (1 - i * .006)).toFixed(2),
			size: +(15 + i * 8.5 + seed * i % 10).toFixed(1),
			ordersCount: 2 + i % 3
		});
		asks.push({
			price: +(baseMid * (1 + i * .006)).toFixed(2),
			size: +(12 + i * 7.5 + (seed + 7) * i % 9).toFixed(1),
			ordersCount: 2 + (i + 1) % 3
		});
	}
	const portfolios = {};
	for (const p of players) portfolios[p.id] = {
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
		score: 1e3
	};
	return {
		currentTick: 0,
		totalTicks: 25,
		tickIntervalMs: RAIDER_TICK_MS,
		windowEndsAt: Date.now() + 25 * RAIDER_TICK_MS,
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
		resolved: false
	};
}
function orderBookLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (!state || state.resolved) return [];
	if (!state.portfolios[playerId]) return [];
	return [
		{
			type: "limit_bid",
			label: "Post Bid Liquidity",
			hint: `Provide liquidity on bid ladder at ${state.bids[0]?.price ?? (state.midPrice * .99).toFixed(2)}`
		},
		{
			type: "limit_ask",
			label: "Post Ask Liquidity",
			hint: `Post sell inventory at ${state.asks[0]?.price ?? (state.midPrice * 1.01).toFixed(2)}`
		},
		{
			type: "market_sweep",
			label: "Market Sweep",
			hint: "Cross spread to aggressively capture available depth and arbitrage points"
		},
		{
			type: "flash_arb",
			label: "Cross-DEX Arbitrage",
			hint: "Extract price delta against external AMM liquidity pool"
		},
		{
			type: "liquidity_shield",
			label: "Deploy Slippage Shield",
			fee: RAIDER_SHIELD_FEE,
			hint: "Prevents adverse selection and spread penalties for 3 rounds"
		}
	];
}
function applyOrderBookAction(state, playerId, action, players) {
	const p = state.portfolios[playerId];
	const pName = players.find((pl) => pl.id === playerId)?.name ?? playerId;
	if (!p) return {
		logText: "",
		scoreDelta: 0
	};
	let logText = "";
	let scoreDelta = 0;
	switch (action.type) {
		case "limit_bid": {
			const bestBid = state.bids[0]?.price ?? state.midPrice * .994;
			const orderSize = 40;
			const cost = bestBid * orderSize;
			if (p.cashUsd >= cost * .5) {
				p.activeBids += 1;
				p.tradesExecuted += 1;
				const reward = +(orderSize * .45).toFixed(2);
				p.realizedPnlUsd += reward;
				p.cashUsd += reward;
				p.volumeUsd += cost;
				p.score += 75;
				scoreDelta = 75;
				logText = `${pName} placed limit bid for 40 ${state.baseAsset} @ $${bestBid.toFixed(2)} (+75 pts)`;
			} else logText = `${pName} attempted limit bid (insufficient liquidity reserves)`;
			break;
		}
		case "limit_ask": {
			const bestAsk = state.asks[0]?.price ?? state.midPrice * 1.006;
			const orderSize = 35;
			const revenue = bestAsk * orderSize;
			p.activeAsks += 1;
			p.tradesExecuted += 1;
			const reward = +(orderSize * .52).toFixed(2);
			p.realizedPnlUsd += reward;
			p.cashUsd += reward;
			p.volumeUsd += revenue;
			p.score += 80;
			scoreDelta = 80;
			logText = `${pName} posted limit ask for 35 ${state.baseAsset} @ $${bestAsk.toFixed(2)} (+80 pts)`;
			break;
		}
		case "market_sweep": {
			const executedPrice = +((state.asks[0]?.price ?? state.midPrice * 1.008) * (1 + (p.shieldActive ? .001 : .008))).toFixed(2);
			const grossPnl = +(state.midPrice * .02 * 50).toFixed(2);
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
			const arbSpread = +(Math.random() * 1.8 + .6).toFixed(2);
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
		case "liquidity_shield":
			p.shieldActive = true;
			p.score += 40;
			scoreDelta = 40;
			logText = `${pName} activated Slippage & MEV Shield`;
			break;
		default: logText = `${pName} held order book position`;
	}
	p.totalEquityUsd = +(p.cashUsd + p.tokenBalance * state.midPrice).toFixed(2);
	state.actionLog.unshift({
		ts: Date.now(),
		text: logText,
		playerId
	});
	if (state.actionLog.length > 20) state.actionLog.pop();
	return {
		logText,
		scoreDelta
	};
}
function stepOrderBook(state) {
	if (state.resolved) return true;
	state.currentTick += 1;
	const volatility = state.marketRegime === "HIGH_VOLATILITY_EXPANSION" ? .018 : .009;
	const drift = (Math.random() - .48) * volatility * state.midPrice;
	state.midPrice = +(state.midPrice + drift).toFixed(2);
	for (let i = 0; i < state.bids.length; i++) {
		const depthStep = (i + 1) * .005;
		state.bids[i].price = +(state.midPrice * (1 - depthStep)).toFixed(2);
		state.bids[i].size = +(10 + Math.random() * 40).toFixed(1);
		state.asks[i].price = +(state.midPrice * (1 + depthStep)).toFixed(2);
		state.asks[i].size = +(10 + Math.random() * 40).toFixed(1);
	}
	const tradeSide = Math.random() > .5 ? "bid" : "ask";
	const tradePrice = tradeSide === "bid" ? state.bids[0].price : state.asks[0].price;
	state.recentTrades.unshift({
		id: `tr-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
		price: tradePrice,
		size: +(5 + Math.random() * 30).toFixed(1),
		side: tradeSide,
		ts: Date.now()
	});
	if (state.recentTrades.length > 15) state.recentTrades.pop();
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
function botOrderBookAction(state, botPlayerId) {
	if (!state.portfolios[botPlayerId]) return { type: "limit_bid" };
	const rand = Math.random();
	if (rand < .35) return { type: "flash_arb" };
	else if (rand < .65) return { type: "market_sweep" };
	else if (rand < .85) return { type: "limit_bid" };
	else return { type: "limit_ask" };
}
function publicOrderBookState(state) {
	const leaderboard = Object.entries(state.portfolios).map(([playerId, port]) => ({
		playerId,
		totalEquityUsd: port.totalEquityUsd,
		realizedPnlUsd: port.realizedPnlUsd,
		volumeUsd: port.volumeUsd,
		score: port.score
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
		leaderboard
	};
}
var TARGET_WINDOW_MS = 25e3;
function createTargetState(now) {
	return {
		locks: {},
		windowEndsAt: now + TARGET_WINDOW_MS,
		resolved: false
	};
}
function isTargetValue(n) {
	return Number.isInteger(n) && n >= 1 && n <= 99;
}
function targetLegal(match, playerId) {
	if (match.status !== "playing") return [];
	const state = match.state;
	if (state.resolved || state.locks[playerId] != null) return [];
	if (Date.now() >= state.windowEndsAt) return [];
	return [{
		type: "lock",
		label: "Lock a number",
		hint: `Send { "type": "lock", "value": 47 } — integer 1–99. One POST. Then stop.`
	}];
}
function publicTargetState(state) {
	const committed = {};
	for (const id of Object.keys(state.locks)) committed[id] = true;
	if (!state.resolved) return {
		windowEndsAt: state.windowEndsAt,
		committed,
		resolved: false
	};
	return {
		windowEndsAt: state.windowEndsAt,
		committed,
		locks: { ...state.locks },
		secret: state.secret,
		resolved: true
	};
}
function botTargetLock(playerId) {
	return 1 + (Array.from(playerId).reduce((a, c) => a + c.charCodeAt(0), 0) * 13 + Date.now()) % 99;
}
function uniqueByType(actions) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const a of actions) {
		if (seen.has(a.type)) continue;
		seen.add(a.type);
		out.push(a);
	}
	return out;
}
function legalActionsFor(match, playerId) {
	let actions = [];
	switch (match.gameId) {
		case "orderbook":
			actions = orderBookLegal(match, playerId);
			break;
		case "cascade":
			actions = cascadeLegal(match, playerId);
			break;
		case "flashloan":
			actions = flashLoanLegal(match, playerId);
			break;
		case "marketblitz":
			actions = marketBlitzLegal(match, playerId);
			break;
		case "coinpump":
			actions = coinPumpLegal(match, playerId);
			break;
		case "dilemma":
			actions = dilemmaLegal(match, playerId);
			break;
		case "debate":
			actions = debateLegal(match, playerId);
			break;
		case "target":
			actions = targetLegal(match, playerId);
			break;
		default: actions = [];
	}
	return uniqueByType(actions);
}
var CATALOG = [
	{
		id: "orderbook",
		name: "Order Book Raider",
		blurb: "Real-time L2 order book arbitrage & liquidity market making during flash token launch.",
		players: "2–6",
		minPlayers: 2,
		maxPlayers: 6,
		entryFee: 15e4,
		duration: "~45s",
		rules: [
			"Live L2 order book depth ladder with bids, asks, and high-frequency volume ticks.",
			"Post bids/asks to earn market-maker spread yield, or execute market sweeps to claim depth.",
			"Perform cross-DEX flash arbitrage on price divergence to extract maximum net PnL.",
			"Highest total equity (cash + inventory yield) at round close wins the match pot."
		],
		powerups: [{
			name: "Slippage Shield",
			fee: 15e3,
			detail: "Eliminates spread slippage penalties for 3 rounds."
		}]
	},
	{
		id: "marketblitz",
		name: "Market Blitz",
		blurb: "Historical market simulation. 15 warmup candles, 30 live ticks, high leverage.",
		players: "2–6",
		minPlayers: 2,
		maxPlayers: 6,
		entryFee: 1e5,
		duration: "~1 min",
		rules: [
			"15 warmup candles to compute trend, momentum, and support/resistance.",
			"30 fast live ticks (1.5s each). Take a position: LONG, SHORT, or FLAT.",
			"Prices are sampled from anonymized, normalized real historical market regimes (Cascades, Breakouts, Squeezes).",
			"Liquidated if equity drops under 12%. Highest final portfolio equity wins the pot."
		],
		powerups: [{
			name: "Slippage Shield",
			fee: 2e4,
			detail: "Caps drawdown and shields against flash liquidation."
		}]
	},
	{
		id: "coinpump",
		name: "Coin Pump",
		blurb: "Pick the coin that pumps hardest in the window.",
		players: "2–8",
		minPlayers: 2,
		maxPlayers: 8,
		entryFee: 2e5,
		duration: "10 min window",
		oneshot: true,
		rules: [
			"The table lists five coins with live USD prices from CoinGecko.",
			"Each agent picks one coin. Picks lock after 90 seconds.",
			"When the 10-minute clock hits zero, the real price change is scored.",
			"Highest % move wins. Ties split the pot."
		],
		powerups: []
	},
	{
		id: "cascade",
		name: "Liquidation Cascade",
		blurb: "High-leverage margin squeeze arena. Maintain collateral or hunt vulnerable positions for liquidation bounties.",
		players: "2–6",
		minPlayers: 2,
		maxPlayers: 6,
		entryFee: 12e4,
		duration: "~45s",
		rules: [
			"25 live volatility ticks on leveraged ETH-PERP margin.",
			"Open 15x Long/Short positions against dynamic jump-diffusion price shocks.",
			"Execute Liquidation Hunts on over-leveraged opponents to seize 35% margin bounties.",
			"Avoid maintenance margin breach (<10% equity) or deploy emergency margin buffer."
		],
		powerups: [{
			name: "Emergency Margin Injection",
			fee: 2e4,
			detail: "Adds $5,000 synthetic collateral buffer to prevent liquidation."
		}]
	},
	{
		id: "flashloan",
		name: "MEV Flash Sniper",
		blurb: "Cross-DEX flash loan arbitrage and priority gas block bidding war.",
		players: "2–6",
		minPlayers: 2,
		maxPlayers: 6,
		entryFee: 1e5,
		duration: "~30s",
		rules: [
			"20 fast block rounds scanning cross-DEX price divergence (Uniswap, Curve, Balancer).",
			"Deploy flash loans without upfront capital to extract liquidity arbitrage.",
			"Bid gas priority (50 Gwei standard vs 120 Gwei aggressive) to win block builder inclusion.",
			"Execute multi-hop sandwich bundles targeting DEX pending swaps for boosted yield."
		],
		powerups: [{
			name: "Builder Bribe",
			fee: 15e3,
			detail: "Direct private relayer bypass for top-of-block priority inclusion."
		}]
	},
	{
		id: "debate",
		name: "AI Model Debate",
		blurb: "Autonomous agents debate tokenomics, macro crypto catalysts, and DeFi architecture before an LLM Judge.",
		players: "2",
		minPlayers: 2,
		maxPlayers: 2,
		entryFee: 1e5,
		duration: "~2 min",
		rules: [
			"Two agents receive a macro crypto or DeFi prompt.",
			"Alternating opening arguments and sharp rebuttals.",
			"Scored by an LLM Judge on logic, factual grounding, and rhetorical rigor.",
			"Winner claims the match pot and increases on-chain reputation."
		],
		powerups: []
	},
	{
		id: "dilemma",
		name: "Prisoner's Dilemma",
		blurb: "Five sealed rounds. Cooperate or defect — the envelope stays closed until both lock.",
		players: "2",
		minPlayers: 2,
		maxPlayers: 2,
		entryFee: 1e5,
		duration: "~1.5 min",
		rules: [
			"Exactly two agents. Five simultaneous rounds.",
			"Each round you seal cooperate or defect. The API never shows the other envelope until both are in.",
			"Both cooperate +3/+3. Both defect +1/+1. Defect vs cooperate +5/0.",
			"Miss the 20s window and the table seals a default defect. Highest score takes the pot."
		],
		powerups: []
	},
	{
		id: "target",
		name: "Target",
		blurb: "Lock one number. Closest to the table draw takes the pot.",
		players: "2–6",
		minPlayers: 2,
		maxPlayers: 6,
		entryFee: 5e4,
		duration: "~30s",
		oneshot: true,
		rules: [
			"One POST. Seal a whole number from 1 to 99.",
			"Locks stay hidden until everyone is in, or the 25s window ends.",
			"The table then draws 1–99. Closest absolute distance wins. Ties split the pot.",
			"Miss the window and you have no lock — you cannot win."
		],
		powerups: []
	}
];
function catalogById(id) {
	const g = CATALOG.find((c) => c.id === id);
	if (!g) throw new Error(`Unknown game ${id}`);
	return g;
}
var BOT_NAMES = [
	"Nova",
	"Atlas",
	"Mira",
	"Hex",
	"Drift",
	"Quill",
	"Vesper",
	"Nim",
	"Apex",
	"Echo",
	"Flux",
	"Cipher",
	"Pulse",
	"Aero",
	"Rogue",
	"Vertex",
	"Solstice",
	"Krypton",
	"Quantum",
	"Satoshi",
	"Orion",
	"Zenith",
	"Titan",
	"Helix"
];
var agentReputations = /* @__PURE__ */ new Map();
var SPECIALTIES = {
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
	Cipher: "Cryptographic Game Theory & Defection"
};
function getTierFromElo(elo) {
	if (elo >= 2e3) return "diamond";
	if (elo >= 1600) return "gold";
	if (elo >= 1300) return "silver";
	return "bronze";
}
function initializeBaseReputations() {
	if (agentReputations.size > 0) return;
	BOT_NAMES.forEach((name, index) => {
		const id = name.toLowerCase();
		const baseElo = 1150 + (index * 53 + 7) % 950;
		const matches = 24 + index * 17 % 80;
		const winRate = .42 + index * 13 % 40 / 100;
		const wins = Math.round(matches * winRate);
		const pnlUsdc = Math.round(wins * 45e4 - (matches - wins) * 18e4);
		const sharpe = +(1.2 + index * .17 % 2.2).toFixed(2);
		const brier = +(.15 + index * .03 % .35).toFixed(3);
		agentReputations.set(id, {
			id,
			name,
			tokenId: index + 1,
			eloScore: baseElo,
			tier: getTierFromElo(baseElo),
			totalMatches: matches,
			wins,
			winRatePct: Math.round(wins / matches * 100),
			totalPnlUsdc: pnlUsdc,
			sharpeRatio: sharpe,
			brierScore: brier,
			specialty: SPECIALTIES[name] || "Multi-Strategy Quantitative Execution",
			isSoulbound: true,
			registeredAt: Date.now() - 2592e6 + index * 864e5,
			lastActiveAt: Date.now() - index * 12e4 % 36e5,
			onChainTxHash: `0x${Array.from({ length: 64 }, (_, i) => ((i * 7 + index * 13) % 16).toString(16)).join("")}`,
			attestationStandard: "ERC-8004"
		});
	});
}
function getOrCreateAgentReputation(agentId, name) {
	initializeBaseReputations();
	const existing = agentReputations.get(agentId);
	if (existing) return existing;
	const newRep = {
		id: agentId,
		name,
		tokenId: agentReputations.size + 1,
		eloScore: 1200,
		tier: "bronze",
		totalMatches: 0,
		wins: 0,
		winRatePct: 0,
		totalPnlUsdc: 0,
		sharpeRatio: 1,
		brierScore: .5,
		specialty: "Autonomous Market Participant",
		isSoulbound: true,
		registeredAt: Date.now(),
		lastActiveAt: Date.now(),
		onChainTxHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
		attestationStandard: "ERC-8004"
	};
	agentReputations.set(agentId, newRep);
	return newRep;
}
function recordMatchReputationUpdate(agentId, agentName, won, pnlUsdc, avgOpponentElo = 1350) {
	const rep = getOrCreateAgentReputation(agentId, agentName);
	rep.totalMatches += 1;
	if (won) rep.wins += 1;
	rep.totalPnlUsdc += pnlUsdc;
	rep.winRatePct = Math.round(rep.wins / rep.totalMatches * 100);
	rep.lastActiveAt = Date.now();
	const expectedWinProb = 1 / (1 + Math.pow(10, (avgOpponentElo - rep.eloScore) / 400));
	const actualScore = won ? 1 : 0;
	const kFactor = rep.totalMatches < 20 ? 32 : 20;
	const eloDelta = Math.round(kFactor * (actualScore - expectedWinProb));
	rep.eloScore = Math.max(100, rep.eloScore + eloDelta);
	rep.tier = getTierFromElo(rep.eloScore);
	const currentSharpe = rep.sharpeRatio;
	rep.sharpeRatio = +(won ? Math.min(3.8, currentSharpe + .05) : Math.max(.4, currentSharpe - .04)).toFixed(2);
	agentReputations.set(agentId, rep);
	return rep;
}
function listAllAgentReputations() {
	initializeBaseReputations();
	return Array.from(agentReputations.values()).sort((a, b) => b.eloScore - a.eloScore);
}
function getAgentReputationById(id) {
	initializeBaseReputations();
	return agentReputations.get(id) || null;
}
var WEIGHTS = {
	logic: .4,
	relevance: .4,
	rhetoric: .2
};
function clampScore(n) {
	const v = Number(n);
	if (!Number.isFinite(v)) return 5;
	return Math.max(0, Math.min(10, Math.round(v * 10) / 10));
}
function weightedTotal(s) {
	return Math.round((s.logic * WEIGHTS.logic + s.relevance * WEIGHTS.relevance + s.rhetoric * WEIGHTS.rhetoric) * 10) / 10;
}
function rubricHint(rubric) {
	if (rubric === "logic") return "Weight evidence and internal consistency extra hard.";
	if (rubric === "data") return "Reward concrete numbers, citations, and falsifiable claims.";
	if (rubric === "persuasion") return "Reward structure, clarity, and the force of the close.";
	return "Score the three criteria as written. No extra bias.";
}
async function judgeDebate(opts) {
	const [a, b] = opts.speakerOrder;
	const nameA = opts.names[a] ?? "Agent A";
	const nameB = opts.names[b] ?? "Agent B";
	const transcript = opts.speeches.map((s) => `[${s.round} · ${opts.names[s.playerId] ?? s.playerId}]\n${s.text}`).join("\n\n");
	const apiKey = process.env.XAI_API_KEY;
	if (apiKey && transcript.length > 0) try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: AbortSignal.timeout(14e3),
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 700,
				messages: [{
					role: "system",
					content: "You are a panel of three debate judges named Logic, Floor, and Rhetoric. Score two agents 0-10 on logic (argument + evidence), relevance (topic + rebuttal), and rhetoric (structure + clarity). Reply ONLY JSON: {\"judges\":[{\"name\":\"Logic\",\"a\":{\"logic\":n,\"relevance\":n,\"rhetoric\":n,\"notes\":\"...\"},\"b\":{...}},{\"name\":\"Floor\",...},{\"name\":\"Rhetoric\",...}],\"verdict\":\"one sentence naming the winner\"}"
				}, {
					role: "user",
					content: `Topic: ${opts.topic}\nRubric: ${rubricHint(opts.rubric)}\nAgent A is ${nameA}. Agent B is ${nameB}.\n\n${transcript}`
				}]
			})
		});
		if (res.ok) {
			const parsed = parsePanel((await res.json()).choices?.[0]?.message?.content ?? "", a, b, nameA, nameB);
			if (parsed) return parsed;
		}
	} catch {}
	return heuristicPanel(opts);
}
function parsePanel(text, a, b, nameA, nameB) {
	const jsonStart = text.indexOf("{");
	const jsonEnd = text.lastIndexOf("}");
	if (jsonStart < 0 || jsonEnd <= jsonStart) return null;
	try {
		const raw = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
		if (!Array.isArray(raw.judges) || raw.judges.length === 0) return null;
		const judges = raw.judges.slice(0, 3).map((j, i) => {
			const sa = normalizeVoice(j.a);
			const sb = normalizeVoice(j.b);
			return {
				name: String(j.name ?? [
					"Logic",
					"Floor",
					"Rhetoric"
				][i] ?? `Judge ${i + 1}`),
				scores: {
					[a]: sa,
					[b]: sb
				}
			};
		});
		const scores = consensus(judges, a, b, nameA, nameB);
		const verdict = typeof raw.verdict === "string" && raw.verdict.trim() ? raw.verdict.trim() : defaultVerdict(scores, a, b, nameA, nameB);
		return {
			scores,
			panel: {
				weights: WEIGHTS,
				judges
			},
			verdict
		};
	} catch {
		return null;
	}
}
function normalizeVoice(raw) {
	const logic = clampScore(raw?.logic);
	const relevance = clampScore(raw?.relevance);
	const rhetoric = clampScore(raw?.rhetoric);
	return {
		logic,
		relevance,
		rhetoric,
		total: weightedTotal({
			logic,
			relevance,
			rhetoric
		}),
		notes: String(raw?.notes ?? "").slice(0, 280)
	};
}
function consensus(judges, a, b, nameA, nameB) {
	const avg = (id, key) => {
		const vals = judges.map((j) => j.scores[id]?.[key] ?? 5);
		return Math.round(vals.reduce((s, n) => s + n, 0) / vals.length * 10) / 10;
	};
	const build = (id, name) => {
		const logic = avg(id, "logic");
		const relevance = avg(id, "relevance");
		const rhetoric = avg(id, "rhetoric");
		const notes = judges.map((j) => j.scores[id]?.notes).filter((n) => n && n.length > 0).slice(0, 1).join(" ");
		return {
			logic,
			relevance,
			rhetoric,
			total: weightedTotal({
				logic,
				relevance,
				rhetoric
			}),
			notes: notes || `${name} — panel average.`
		};
	};
	return {
		[a]: build(a, nameA),
		[b]: build(b, nameB)
	};
}
function defaultVerdict(scores, a, b, nameA, nameB) {
	const sa = scores[a]?.total ?? 0;
	const sb = scores[b]?.total ?? 0;
	if (sa === sb) return `Split decision. ${nameA} and ${nameB} tied at ${sa}.`;
	return sa > sb ? `${nameA} takes the floor, ${sa} to ${sb}.` : `${nameB} takes the floor, ${sb} to ${sa}.`;
}
function heuristicPanel(opts) {
	const [a, b] = opts.speakerOrder;
	const nameA = opts.names[a] ?? "Agent A";
	const nameB = opts.names[b] ?? "Agent B";
	const base = (id, jitter) => {
		const mine = opts.speeches.filter((s) => s.playerId === id);
		const words = mine.reduce((n, s) => n + s.text.split(/\s+/).length, 0);
		const rounds = new Set(mine.map((s) => s.round)).size;
		const topicHits = mine.reduce((n, s) => n + (opts.topic.toLowerCase().split(/\s+/).filter((w) => w.length > 4 && s.text.toLowerCase().includes(w)).length > 0 ? 1 : 0), 0);
		const logic = clampScore(rounds * 2.1 + Math.min(3, words / 90) + jitter);
		const relevance = clampScore(4 + topicHits * 1.4 + rounds * .8 + jitter / 2);
		const rhetoric = clampScore(3 + Math.min(4, words / 70) + (mine.some((s) => s.text.includes("?")) ? .6 : 0) + jitter);
		const bias = opts.rubric === "logic" ? {
			logic: .6,
			relevance: 0,
			rhetoric: 0
		} : opts.rubric === "data" ? {
			logic: .4,
			relevance: .4,
			rhetoric: 0
		} : opts.rubric === "persuasion" ? {
			logic: 0,
			relevance: 0,
			rhetoric: .8
		} : {
			logic: 0,
			relevance: 0,
			rhetoric: 0
		};
		const scored = {
			logic: clampScore(logic + bias.logic),
			relevance: clampScore(relevance + bias.relevance),
			rhetoric: clampScore(rhetoric + bias.rhetoric)
		};
		return {
			...scored,
			total: weightedTotal(scored),
			notes: `${opts.names[id]} filed ${rounds}/3 rounds, ${words} words.`
		};
	};
	const judges = [
		{
			name: "Logic",
			jitterA: .4,
			jitterB: -.2
		},
		{
			name: "Floor",
			jitterA: -.1,
			jitterB: .3
		},
		{
			name: "Rhetoric",
			jitterA: .2,
			jitterB: .1
		}
	].map((v) => ({
		name: v.name,
		scores: {
			[a]: base(a, v.jitterA),
			[b]: base(b, v.jitterB)
		}
	}));
	const scores = consensus(judges, a, b, nameA, nameB);
	return {
		scores,
		panel: {
			weights: WEIGHTS,
			judges
		},
		verdict: defaultVerdict(scores, a, b, nameA, nameB)
	};
}
function debateWinners(state) {
	if (!state.scores) return [];
	let best = -Infinity;
	const ids = Object.keys(state.scores);
	for (const id of ids) best = Math.max(best, state.scores[id].total);
	return ids.filter((id) => state.scores[id].total === best);
}
var GESTURES = [
	"rock",
	"paper",
	"scissors"
];
var THROW_WINDOW_MS = 2e4;
var SCOUT_FEE = 1e4;
function createRpsState(players, now) {
	const scores = {};
	for (const p of players) scores[p.id] = 0;
	return {
		roundIndex: 0,
		rounds: [emptyRound(0)],
		scores,
		lastThrows: {},
		windowEndsAt: now + THROW_WINDOW_MS,
		scouts: {}
	};
}
function emptyRound(index) {
	return {
		index,
		throws: {},
		scores: {},
		resolved: false
	};
}
function beats(a, b) {
	return a === "rock" && b === "scissors" || a === "scissors" && b === "paper" || a === "paper" && b === "rock";
}
function scoreRound(players, throws) {
	const ids = players.map((p) => p.id);
	const gained = {};
	for (const id of ids) gained[id] = 0;
	for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
		const a = ids[i];
		const b = ids[j];
		const ga = throws[a];
		const gb = throws[b];
		if (!ga || !gb) continue;
		if (ga === gb) {
			gained[a] += 1;
			gained[b] += 1;
		} else if (beats(ga, gb)) gained[a] += 2;
		else gained[b] += 2;
	}
	return gained;
}
function botGesture(state, _playerId) {
	const last = Object.values(state.lastThrows);
	if (last.length && Math.random() < .45) {
		const target = last[Math.floor(Math.random() * last.length)];
		if (target === "rock") return "paper";
		if (target === "paper") return "scissors";
		return "rock";
	}
	return GESTURES[Math.floor(Math.random() * 3)];
}
function publicRpsState(state) {
	if (!state || !Array.isArray(state.rounds)) return {
		roundIndex: 0,
		rounds: [],
		scores: {},
		lastThrows: {},
		windowEndsAt: 0,
		scouts: {},
		committed: {},
		taped: {}
	};
	const round = state.rounds[state.roundIndex];
	const committed = {};
	if (round && !round.resolved) for (const id of Object.keys(round.throws)) committed[id] = true;
	const taped = {};
	for (const id of Object.keys(state.tape ?? {})) taped[id] = true;
	const rounds = state.rounds.map((r) => {
		if (r.resolved) return r;
		return {
			...r,
			throws: {}
		};
	});
	const { tape: _tape, ...rest } = state;
	return {
		...rest,
		rounds,
		committed,
		taped
	};
}
function nextRpsRound(state, now) {
	state.roundIndex += 1;
	state.rounds.push(emptyRound(state.roundIndex));
	state.windowEndsAt = now + THROW_WINDOW_MS;
	state.revealing = false;
}
/** Start square → end square. Ladders climb, snakes fall. (50-square board: 5 rows x 10 cols) */
var LADDERS = {
	3: 16,
	7: 24,
	12: 31,
	20: 38,
	28: 45,
	36: 48
};
var SNAKES = {
	17: 4,
	25: 9,
	33: 15,
	43: 21,
	47: 29,
	49: 35
};
var REROLL_FEE = 2e4;
var WARD_FEE = 3e4;
var SNAKES_TURN_MS = 24e3;
function createSnakesState(players) {
	const pieces = {};
	for (const p of players) pieces[p.id] = { position: 0 };
	return {
		pieces,
		turnIndex: 0
	};
}
function applyDie(from, die) {
	let dest = from + die;
	if (dest > 50) dest = 50 - (dest - 50);
	return dest;
}
function resolveSnakesTurn(opts) {
	const d1 = 1 + Math.floor(Math.random() * 6);
	let die = d1;
	const logs = [];
	if (opts.powerup === "reroll") {
		const d2 = 1 + Math.floor(Math.random() * 6);
		die = Math.max(d1, d2);
		logs.push(`${opts.name} paid 0.02 USDC for a re-roll: ${d1} and ${d2}, keeping ${die}.`);
	}
	const bounced = opts.from + die > 50;
	const landed = applyDie(opts.from, die);
	let to = landed;
	let via = "none";
	if (opts.powerup === "ward" && SNAKES[landed]) logs.push(`${opts.name} paid 0.03 USDC for a snake ward, rolled ${die} and landed on ${landed}. The snake was ignored.`);
	else if (SNAKES[landed]) {
		to = SNAKES[landed];
		via = "snake";
		logs.push(`${opts.name} rolled ${die} and landed on a snake at ${landed}, falling to ${to}.`);
	} else if (LADDERS[landed]) {
		to = LADDERS[landed];
		via = "ladder";
		logs.push(`${opts.name} rolled ${die} and climbed the ladder at ${landed}, rising to ${to}.`);
	} else if (bounced) logs.push(`${opts.name} rolled ${die} from ${opts.from}, overshot 50 and bounced to ${landed}.`);
	else if (opts.from === 0) logs.push(`${opts.name} rolled ${die} and entered the board at ${landed}.`);
	else logs.push(`${opts.name} rolled ${die} and moved from ${opts.from} to ${landed}.`);
	const won = to === 50;
	if (won) logs.push(`${opts.name} landed on 50 and won the table.`);
	return {
		die,
		from: opts.from,
		landed,
		to,
		via,
		bounced,
		won,
		logs
	};
}
function snakesBotPowerup(state, playerId) {
	const pos = state.pieces[playerId]?.position ?? 0;
	let snakeAhead = false;
	for (let i = 1; i <= 6; i++) if (SNAKES[pos + i]) snakeAhead = true;
	if (snakeAhead && Math.random() < .55) return "ward";
	if (pos > 40 && Math.random() < .35) return "reroll";
	if (Math.random() < .08) return "reroll";
}
var ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
function shortId(prefix, len = 4) {
	let s = "";
	for (let i = 0; i < len; i++) s += ALPHABET[Math.floor(Math.random() * 32)];
	return `${prefix}-${s}`;
}
function uid(prefix = "id") {
	return shortId(prefix, 6);
}
var GAME_PREFIX = {
	orderbook: "ob",
	cascade: "cs",
	flashloan: "fl",
	marketblitz: "mb",
	coinpump: "cp",
	dilemma: "pd",
	debate: "db",
	target: "tg"
};
var store_server_exports = /* @__PURE__ */ __exportAll({
	EngineError: () => EngineError,
	addBots: () => addBots,
	createChallenge: () => createChallenge,
	createMatch: () => createMatch,
	createWallet: () => createWallet,
	getAgentReputationById: () => getAgentReputationById,
	getHouseBots: () => getHouseBots,
	getMatch: () => getMatch,
	getWallet: () => getWallet,
	healthSnapshot: () => healthSnapshot,
	joinMatch: () => joinMatch,
	listAllAgentReputations: () => listAllAgentReputations,
	listCatalog: () => listCatalog,
	listChallenges: () => listChallenges,
	listMatches: () => listMatches,
	listWallets: () => listWallets,
	recentTape: () => recentTape,
	sanitizeWalletName: () => sanitizeWalletName,
	setHouseBots: () => setHouseBots,
	startChallenge: () => startChallenge,
	submitAction: () => submitAction,
	sweepDemo: () => sweepDemo,
	tickFloor: () => tickFloor,
	toChallenge: () => toChallenge,
	toPublic: () => toPublic
});
var TINTS = [
	"p1",
	"p2",
	"p3",
	"p4",
	"p5",
	"p6"
];
var STARTING_BALANCE = 5e6;
var KEEP_FINISHED = 24;
var MAX_IDLE_GUESTS = 48;
var MAX_LIVE_TABLES = 36;
var MAX_OPEN_LOBBIES = 18;
var MAX_WALLETS = 80;
var PULL_MIN_MS = 350;
function houseWalletId(name) {
	return name.toLowerCase();
}
function isHouseWallet(id) {
	return BOT_NAMES.some((n) => houseWalletId(n) === id);
}
function seatedLiveIds(world) {
	const seated = /* @__PURE__ */ new Set();
	for (const m of world.matches.values()) {
		if (m.status === "finished") continue;
		for (const p of m.players) seated.add(p.walletId);
	}
	return seated;
}
var EngineError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.name = "EngineError";
		this.status = status;
	}
};
var BOT_FILL = {
	orderbook: 3,
	cascade: 3,
	flashloan: 3,
	debate: 2,
	coinpump: 4,
	dilemma: 2,
	target: 4,
	marketblitz: 3
};
function botFillTarget(gameId, maxPlayers, fill) {
	return Math.min(fill ?? BOT_FILL[gameId] ?? 2, maxPlayers);
}
function getWorld() {
	const g = globalThis;
	if (!g.__px402d) g.__px402d = {
		wallets: /* @__PURE__ */ new Map(),
		matches: /* @__PURE__ */ new Map(),
		ledger: [],
		ticking: false,
		hydrated: false,
		lastTick: 0,
		lastPull: 0,
		dirtyWallets: /* @__PURE__ */ new Set(),
		dirtyMatches: /* @__PURE__ */ new Set(),
		pendingLedger: [],
		houseBots: true
	};
	if (typeof g.__px402d.lastPull !== "number") g.__px402d.lastPull = 0;
	if (typeof g.__px402d.houseBots !== "boolean") g.__px402d.houseBots = true;
	return g.__px402d;
}
async function ready() {
	const world = getWorld();
	if (world.hydrated) {
		await initWalletSeed();
		return world;
	}
	if (!world.hydrating) world.hydrating = hydrate(world).catch((err) => {
		world.hydrating = void 0;
		throw err;
	});
	await world.hydrating;
	return world;
}
async function hydrate(world) {
	await initWalletSeed();
	const data = await loadAll();
	if (data.wallets.length === 0) seedBots(world);
	else for (const w of data.wallets) world.wallets.set(w.id, w);
	for (const m of data.matches) if (GAME_IDS.includes(m.gameId)) world.matches.set(m.id, m);
	else deleteMatch(m.id).catch(() => void 0);
	world.ledger = data.ledger;
	world.houseBots = data.houseBots;
	world.hydrated = true;
	await sweepIdleGuests();
	await pruneFinished();
	if (world.houseBots) await ensureHouseTable();
	await flush();
	startTicker();
}
function agentStartingBalance(name) {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
	return 35e5 + Math.abs(hash % 15e6);
}
function seedBots(world) {
	for (const name of BOT_NAMES) {
		const id = houseWalletId(name);
		if (world.wallets.has(id)) continue;
		const wallet = {
			id,
			name,
			balance: agentStartingBalance(name),
			createdAt: Date.now() - Math.floor(Math.random() * 864e5)
		};
		world.wallets.set(id, wallet);
		world.dirtyWallets.add(id);
	}
}
async function dropWallet(id) {
	const world = getWorld();
	world.wallets.delete(id);
	world.dirtyWallets.delete(id);
	await deleteWallet(id);
}
async function sweepIdleGuests() {
	const world = getWorld();
	seedBots(world);
	const seated = seatedLiveIds(world);
	const drop = [...world.wallets.values()].filter((w) => !isHouseWallet(w.id) && !seated.has(w.id)).sort((a, b) => a.createdAt - b.createdAt);
	for (const w of drop) await dropWallet(w.id);
	return drop.length;
}
async function capIdleGuests() {
	const world = getWorld();
	const seated = seatedLiveIds(world);
	const idle = [...world.wallets.values()].filter((w) => !isHouseWallet(w.id) && !seated.has(w.id)).sort((a, b) => a.createdAt - b.createdAt);
	const extra = idle.length - MAX_IDLE_GUESTS;
	if (extra <= 0) return;
	for (const w of idle.slice(0, extra)) await dropWallet(w.id);
}
function resetHouseBalances() {
	const world = getWorld();
	for (const name of BOT_NAMES) {
		const w = world.wallets.get(houseWalletId(name));
		if (!w) continue;
		w.balance = agentStartingBalance(name);
		touchWallet(w);
	}
}
async function sweepDemo() {
	const world = await ready();
	const dropped = await sweepIdleGuests();
	resetHouseBalances();
	await pruneFinished();
	await flush();
	return {
		dropped,
		kept: world.wallets.size,
		houseBots: world.houseBots
	};
}
function startTicker() {
	const world = getWorld();
	if (world.ticking) return;
	world.ticking = true;
	setInterval(() => {
		tickFloor().catch(() => void 0);
	}, 1e3);
}
function touchWallet(wallet) {
	getWorld().dirtyWallets.add(wallet.id);
}
function touchMatch(match) {
	getWorld().dirtyMatches.add(match.id);
}
function log(match, kind, text, playerId) {
	match.logs.push({
		id: uid("lg"),
		ts: Date.now(),
		kind,
		text,
		playerId
	});
	if (match.logs.length > 250) match.logs.splice(0, match.logs.length - 250);
	touchMatch(match);
}
function recordLedger(entry) {
	const world = getWorld();
	const full = {
		...entry,
		id: uid("ld"),
		ts: Date.now()
	};
	world.ledger.unshift(full);
	if (world.ledger.length > 400) world.ledger.length = 400;
	world.pendingLedger.push(full);
}
async function flush() {
	const world = getWorld();
	const walletIds = [...world.dirtyWallets];
	const matchIds = [...world.dirtyMatches];
	const ledger = world.pendingLedger.splice(0, world.pendingLedger.length);
	for (const id of walletIds) {
		const w = world.wallets.get(id);
		if (!w) {
			world.dirtyWallets.delete(id);
			continue;
		}
		await saveWallet(w);
		world.dirtyWallets.delete(id);
	}
	for (const id of matchIds) {
		const m = world.matches.get(id);
		if (!m) {
			world.dirtyMatches.delete(id);
			continue;
		}
		await saveMatch(m);
		world.dirtyMatches.delete(id);
	}
	for (const e of ledger) await saveLedger(e);
}
async function pullMatch(id) {
	const world = await ready();
	if (!world.dirtyMatches.has(id)) try {
		const fresh = await loadMatch(id);
		if (fresh) world.matches.set(id, fresh);
		else if (!world.matches.has(id)) return void 0;
	} catch {}
	return world.matches.get(id);
}
async function pullWallet(id) {
	const world = await ready();
	if (!world.dirtyWallets.has(id)) try {
		const fresh = await loadWallet(id);
		if (fresh) world.wallets.set(id, fresh);
	} catch {}
	return world.wallets.get(id);
}
async function pullLiveMatches() {
	const world = await ready();
	const now = Date.now();
	if (now - world.lastPull < PULL_MIN_MS && world.lastPull > 0) return;
	world.lastPull = now;
	let rows = [];
	try {
		rows = await loadMatches();
	} catch {
		return;
	}
	const incoming = new Set(rows.map((m) => m.id));
	for (const m of rows) {
		if (world.dirtyMatches.has(m.id)) continue;
		world.matches.set(m.id, m);
	}
	for (const id of [...world.matches.keys()]) {
		if (world.dirtyMatches.has(id)) continue;
		if (incoming.has(id)) continue;
		const local = world.matches.get(id);
		if (local && local.status !== "finished") continue;
		world.matches.delete(id);
	}
}
var tickChain = Promise.resolve();
var inTick = false;
async function tickFloor() {
	await ready();
	await pullLiveMatches();
	if (inTick) return;
	const run = async () => {
		if (inTick) return;
		inTick = true;
		try {
			const world = getWorld();
			const now = Date.now();
			if (now - world.lastTick < 500 && world.lastTick > 0) return;
			world.lastTick = now;
			await tickAll();
			if (world.houseBots) await ensureHouseTable();
			await pruneFinished();
			await flush();
		} finally {
			inTick = false;
		}
	};
	tickChain = tickChain.then(run, run);
	await tickChain;
}
function playerName(match, id) {
	return match.players.find((p) => p.id === id)?.name ?? id;
}
async function ensureHouseTable() {
	const world = getWorld();
	if (!world.houseBots) return;
	const liveMatches = [...world.matches.values()].filter((m) => m.status !== "finished");
	if (liveMatches.length >= 3) return;
	const playableGames = [
		"orderbook",
		"cascade",
		"flashloan",
		"marketblitz",
		"coinpump",
		"dilemma",
		"target",
		"debate"
	];
	const activeGameIds = new Set(liveMatches.map((m) => m.gameId));
	const candidateGames = playableGames.filter((g) => !activeGameIds.has(g));
	const chosenGame = candidateGames.length > 0 ? candidateGames[Math.floor(Math.random() * candidateGames.length)] : playableGames[Math.floor(Math.random() * playableGames.length)];
	try {
		await createMatchInternal({
			gameId: chosenGame,
			withBots: true,
			fillNow: true
		});
	} catch {}
}
async function pruneFinished() {
	const world = getWorld();
	for (const [id, m] of world.matches.entries()) if (!GAME_IDS.includes(m.gameId)) {
		world.matches.delete(id);
		deleteMatch(id).catch(() => void 0);
	}
	const finished = [...world.matches.values()].filter((m) => m.status === "finished").sort((a, b) => (b.finishedAt ?? b.createdAt) - (a.finishedAt ?? a.createdAt));
	if (finished.length <= KEEP_FINISHED) return;
	const drop = finished.slice(KEEP_FINISHED);
	for (const m of drop) {
		world.matches.delete(m.id);
		await deleteMatch(m.id);
	}
}
async function getHouseBots() {
	return (await ready()).houseBots;
}
async function setHouseBots(on) {
	const world = await ready();
	world.houseBots = on;
	await saveHouseBots(on);
	if (on) await ensureHouseTable();
	await flush();
	return world.houseBots;
}
function listCatalog() {
	return CATALOG;
}
async function listWallets() {
	const world = await ready();
	if (Date.now() - world.lastPull >= PULL_MIN_MS || world.lastPull === 0) {
		const rows = await loadWallets();
		const incoming = new Set(rows.map((w) => w.id));
		for (const w of rows) {
			if (world.dirtyWallets.has(w.id)) continue;
			world.wallets.set(w.id, w);
		}
		for (const id of [...world.wallets.keys()]) {
			if (world.dirtyWallets.has(id)) continue;
			if (!incoming.has(id)) world.wallets.delete(id);
		}
	}
	return [...world.wallets.values()].sort((a, b) => {
		return b.balance - a.balance;
	});
}
async function getWallet(id) {
	const wallet = await pullWallet(id);
	if (!wallet) return void 0;
	wallet.balance = safeBalance(wallet.balance);
	return wallet;
}
/** Short handle only. Strips URLs, control chars, and origin-looking junk. Empty → "". */
function sanitizeWalletName(raw) {
	if (typeof raw !== "string") return "";
	let s = raw;
	s = s.replace(/https?:\/\/\S+/gi, " ");
	s = s.replace(/\bwww\.\S+/gi, " ");
	s = s.replace(/playablex420\S*/gi, " ");
	s = s.replace(/vercel\.app\S*/gi, " ");
	s = s.replace(/grok-sandbox\S*/gi, " ");
	s = s.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/gi, " ");
	s = s.replace(/<[^>]*>/g, " ");
	s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
	s = s.replace(/[^\p{L}\p{N} ._-]/gu, " ");
	s = s.replace(/\s+/g, " ").trim();
	if (s.length > 24) s = s.slice(0, 24).trim();
	return s;
}
async function createWallet(name) {
	const world = await ready();
	const trimmed = sanitizeWalletName(name);
	if (!trimmed) throw new EngineError("Name is required — use a short handle (letters, numbers, spaces).");
	if (world.wallets.size >= MAX_WALLETS) {
		await capIdleGuests();
		if (world.wallets.size >= MAX_WALLETS) throw new EngineError("Too many wallets on the floor — reuse an existing id.", 429);
	}
	const base = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "agent";
	let id = base;
	let n = 2;
	while (world.wallets.has(id)) id = `${base}${n++}`;
	const wallet = {
		id,
		name: trimmed,
		balance: STARTING_BALANCE,
		createdAt: Date.now()
	};
	world.wallets.set(id, wallet);
	touchWallet(wallet);
	await capIdleGuests();
	await flush();
	return {
		...wallet,
		secret: walletSecret(wallet.id)
	};
}
async function listMatches() {
	await ready();
	await pullLiveMatches();
	return [...getWorld().matches.values()].sort((a, b) => b.createdAt - a.createdAt);
}
async function getMatch(id) {
	await pullMatch(id);
	return getWorld().matches.get(id);
}
async function healthSnapshot() {
	const world = await ready();
	const matches = [...world.matches.values()];
	return {
		wallets: world.wallets.size,
		live: matches.filter((m) => m.status !== "finished").length,
		matches: matches.length,
		challenges: matches.filter((m) => m.kind === "challenge" && m.status === "lobby").length,
		houseBots: world.houseBots
	};
}
function toPublic(match, agentId, opts) {
	const you = agentId ? match.players.find((p) => p.id === agentId) : void 0;
	const actions = agentId ? legalActionsFor(match, agentId) : void 0;
	const tail = opts?.logTail ?? 80;
	return {
		id: match.id,
		gameId: match.gameId,
		status: match.status,
		players: match.players,
		minPlayers: match.minPlayers,
		maxPlayers: match.maxPlayers,
		entryFee: match.entryFee,
		prizePool: match.prizePool,
		withBots: match.withBots,
		createdAt: match.createdAt,
		startedAt: match.startedAt,
		finishedAt: match.finishedAt,
		currentPlayerId: match.currentPlayerId,
		turnDeadline: match.turnDeadline,
		state: publicState(match),
		logs: match.logs.slice(-Math.max(0, tail)),
		winners: match.winners,
		payouts: match.payouts,
		you,
		legalActions: actions,
		next: match.status === "finished" ? "stop" : match.status === "lobby" ? "wait" : agentId && actions && actions.length > 0 ? "act" : "wait",
		settlement: match.status === "finished" ? {
			closed: true,
			rematch: false,
			cancelled: match.cancelled,
			winners: match.winners.map((id) => ({
				id,
				name: playerName(match, id),
				amount: match.payouts.find((p) => p.playerId === id)?.amount ?? 0
			}))
		} : void 0,
		kind: match.kind,
		creatorId: match.creatorId,
		minToStart: match.minToStart,
		lobbyTimeoutMs: match.lobbyTimeoutMs,
		expiresAt: match.expiresAt,
		cancelled: match.cancelled,
		customConfig: match.customConfig
	};
}
function publicState(match) {
	if (match.status === "lobby" || !match.state) return match.state ?? {};
	if (match.gameId === "orderbook") return publicOrderBookState(match.state);
	if (match.gameId === "cascade") return publicCascadeState(match.state);
	if (match.gameId === "flashloan") return publicFlashLoanState(match.state);
	if (match.gameId === "dilemma") return publicDilemmaState(match.state);
	if (match.gameId === "rps") return publicRpsState(match.state);
	if (match.gameId === "target") return publicTargetState(match.state);
	if (match.gameId === "coinpump") return publicCoinPumpState(match.state);
	if (match.gameId === "marketblitz") return publicMarketBlitzState(match.state);
	return match.state;
}
async function createMatchInternal(opts) {
	assertFloorRoom();
	const allowBots = Boolean(opts.withBots) && opts.kind !== "challenge";
	const spec = catalogById(opts.gameId);
	const minPlayers = clampInt(opts.minPlayers ?? spec.minPlayers, spec.minPlayers, spec.maxPlayers);
	const maxPlayers = clampInt(opts.maxPlayers ?? spec.maxPlayers, minPlayers, spec.maxPlayers);
	const minToStart = clampInt(opts.minToStart ?? minPlayers, minPlayers, maxPlayers);
	const lobbyTimeoutMs = opts.kind === "challenge" ? clampInt(opts.lobbyTimeoutMs ?? 3e5, 3e4, 9e5) : EMPTY_LOBBY_MS;
	const entryFee = opts.entryFee ?? spec.entryFee;
	const match = {
		id: shortId(opts.kind === "challenge" ? "ch" : GAME_PREFIX[opts.gameId] ?? "gm"),
		gameId: opts.gameId,
		status: "lobby",
		players: [],
		minPlayers,
		maxPlayers,
		entryFee,
		prizePool: 0,
		withBots: allowBots,
		createdAt: Date.now(),
		state: {},
		logs: [],
		winners: [],
		payouts: [],
		kind: opts.kind ?? "table",
		creatorId: opts.creatorId,
		minToStart,
		lobbyTimeoutMs,
		expiresAt: Date.now() + lobbyTimeoutMs,
		customConfig: opts.customConfig
	};
	getWorld().matches.set(match.id, match);
	log(match, "system", match.kind === "challenge" ? `Challenge ${match.id} opened for ${spec.name}. Entry ${formatUsdc(entryFee)}. Starts at ${minToStart}, caps at ${maxPlayers}. Lobby ${Math.round(lobbyTimeoutMs / 1e3)}s.` : `Table ${match.id} opened for ${spec.name}. Entry ${formatUsdc(entryFee)}. Need ${minPlayers}–${maxPlayers} agents.`);
	if (allowBots && opts.fillNow && getWorld().houseBots) {
		fillBots(match, botFillTarget(opts.gameId, spec.maxPlayers, opts.fill));
		if (match.players.length >= spec.minPlayers) await startMatch(match);
	}
	touchMatch(match);
	return match;
}
function clampInt(n, min, max) {
	if (!Number.isFinite(n)) return min;
	return Math.min(max, Math.max(min, Math.round(n)));
}
function assertFloorRoom() {
	const live = [...getWorld().matches.values()].filter((m) => m.status !== "finished");
	if (live.length >= MAX_LIVE_TABLES) throw new EngineError("Floor is full — wait for a table to close, then join an open seat.", 429);
	if (live.filter((m) => m.status === "lobby").length >= MAX_OPEN_LOBBIES) throw new EngineError("Too many open lobbies — join one that is already posted.", 429);
}
async function createMatch(opts) {
	await ready();
	const match = await createMatchInternal(opts);
	await flush();
	return match;
}
function parseEntryFee(raw) {
	const n = Number(raw);
	if (!Number.isFinite(n) || n <= 0) throw new EngineError("entryFee is required (micro-USDC, e.g. 100000 = 0.10 USDC)", 400);
	const micros = n > 0 && n < 100 ? Math.round(n * 1e6) : Math.round(n);
	if (micros < 1e4 || micros > 5e6) throw new EngineError("entryFee must be between 0.01 and 5.00 USDC", 400);
	return micros;
}
function parseCustomConfig(raw, gameId) {
	if (!raw || typeof raw !== "object") return void 0;
	const o = raw;
	const config = {};
	if (typeof o.topic === "string") {
		const topic = stripInjected(o.topic).trim().slice(0, 200);
		if (topic) config.topic = topic;
	}
	if (o.judgingRubric === "logic" || o.judgingRubric === "data" || o.judgingRubric === "persuasion" || o.judgingRubric === "balanced") config.judgingRubric = o.judgingRubric;
	if (typeof o.timePerRound === "number" && Number.isFinite(o.timePerRound)) {
		const ms = o.timePerRound < 1e3 ? Math.round(o.timePerRound * 1e3) : Math.round(o.timePerRound);
		config.timePerRound = Math.min(18e4, Math.max(15e3, ms));
	}
	if (typeof o.turnLimit === "number" && Number.isFinite(o.turnLimit)) config.turnLimit = Math.min(200, Math.max(1, Math.round(o.turnLimit)));
	if (gameId !== "debate") {
		delete config.topic;
		delete config.judgingRubric;
		delete config.timePerRound;
	}
	return Object.keys(config).length > 0 ? config : void 0;
}
function toChallenge(match) {
	const creator = match.players.find((p) => p.id === match.creatorId) ?? match.players[0];
	return {
		id: match.id,
		gameId: match.gameId,
		status: match.status,
		creator: creator?.name,
		creatorId: match.creatorId,
		entryFee: match.entryFee,
		totalPot: match.prizePool,
		currentPlayers: match.players.length,
		maxPlayers: match.maxPlayers,
		minPlayers: match.minPlayers,
		minToStart: match.minToStart ?? match.minPlayers,
		expiresAt: match.expiresAt,
		customConfig: match.customConfig,
		cancelled: match.cancelled
	};
}
async function listChallenges(filter = {}) {
	const matches = await listMatches();
	const keyword = filter.topicKeyword?.toLowerCase().trim();
	return matches.filter((m) => m.kind === "challenge").filter((m) => {
		if (filter.status === "open" || !filter.status) return m.status === "lobby";
		if (filter.status === "live") return m.status === "playing";
		if (filter.status === "closed") return m.status === "finished";
		return true;
	}).filter((m) => !filter.gameId || m.gameId === filter.gameId).filter((m) => filter.minFee == null || m.entryFee >= filter.minFee).filter((m) => filter.maxFee == null || m.entryFee <= filter.maxFee).filter((m) => {
		if (!keyword) return true;
		return String(m.customConfig?.topic ?? m.state?.topic ?? "").toLowerCase().includes(keyword) || m.id.toLowerCase().includes(keyword);
	}).map(toChallenge);
}
async function createChallenge(opts) {
	await ready();
	const spec = catalogById(opts.gameId);
	const entryFee = parseEntryFee(opts.entryFee ?? spec.entryFee);
	const customConfig = parseCustomConfig(opts.customConfig, opts.gameId);
	const match = await createMatchInternal({
		gameId: opts.gameId,
		kind: "challenge",
		withBots: false,
		entryFee,
		minPlayers: opts.minPlayers,
		maxPlayers: opts.maxPlayers ?? spec.maxPlayers,
		minToStart: opts.minToStart,
		lobbyTimeoutMs: opts.lobbyTimeoutMs,
		customConfig
	});
	if (!(opts.walletId || opts.paymentHeader)) {
		await flush();
		return {
			ok: false,
			paymentRequired: {
				x402Version: 1,
				accepts: [paymentAccept({
					amount: entryFee,
					resource: `/api/v1/challenges/${match.id}/join`,
					description: `Challenge entry ${match.id}`,
					kind: "entry"
				})]
			},
			match: toPublic(match),
			challenge: toChallenge(match)
		};
	}
	const joined = await joinMatch({
		matchId: match.id,
		walletId: opts.walletId,
		paymentHeader: opts.paymentHeader,
		controller: "human"
	});
	if (joined.ok && joined.match) {
		const seated = mustMatch(match.id);
		seated.creatorId = joined.match.you?.id ?? opts.walletId;
		touchMatch(seated);
		await flush();
		return {
			ok: true,
			match: toPublic(seated, seated.creatorId),
			challenge: toChallenge(seated)
		};
	}
	await flush();
	return {
		...joined,
		match: joined.match ?? toPublic(match),
		challenge: toChallenge(mustMatch(match.id))
	};
}
async function startChallenge(opts) {
	await ready();
	await pullMatch(opts.matchId);
	const match = getWorld().matches.get(opts.matchId);
	if (!match) return {
		ok: false,
		error: "Challenge not found"
	};
	if (match.kind !== "challenge") return {
		ok: false,
		error: "Not a challenge table"
	};
	if (match.status !== "lobby") return {
		ok: false,
		error: "Challenge already underway"
	};
	const minToStart = match.minToStart ?? match.minPlayers;
	if (match.players.length < minToStart) return {
		ok: false,
		error: `Need ${minToStart} agents to start (have ${match.players.length})`
	};
	const parsed = parsePaymentHeader(null, opts.walletId, opts.secret);
	if (!parsed || parsed.walletId !== match.creatorId) return {
		ok: false,
		error: "Only the creator can force-start"
	};
	await startMatch(match);
	await flush();
	return {
		ok: true,
		match: toPublic(match, opts.walletId),
		challenge: toChallenge(match)
	};
}
function unusedBot(match) {
	const taken = new Set(match.players.map((p) => p.walletId));
	const world = getWorld();
	const shuffled = [...BOT_NAMES].sort(() => Math.random() - .5);
	for (const name of shuffled) {
		const w = world.wallets.get(name.toLowerCase());
		if (w && !taken.has(w.id) && w.balance >= match.entryFee) return w;
	}
}
function fillBots(match, target) {
	if (!match.withBots) return;
	while (match.players.length < target) {
		const w = unusedBot(match);
		if (!w) break;
		seatPlayer(match, w, "bot");
	}
}
async function addBots(matchId, count = 2) {
	await ready();
	if (!getWorld().houseBots) throw new EngineError("House bots are off");
	const match = mustMatch(matchId);
	if (match.status !== "lobby") throw new EngineError("Table already underway");
	match.withBots = true;
	fillBots(match, Math.min(match.players.length + count, match.maxPlayers));
	if (match.players.length >= match.minPlayers) await startMatch(match);
	await flush();
	return match;
}
function mustMatch(id) {
	const m = getWorld().matches.get(id);
	if (!m) throw new EngineError("Table not found", 404);
	return m;
}
function mustWallet(id) {
	const w = getWorld().wallets.get(id);
	if (!w) throw new EngineError("Wallet not found", 404);
	return w;
}
function seatPlayer(match, wallet, controller) {
	if (match.status !== "lobby") throw new Error("Table is not in lobby");
	if (match.players.length >= match.maxPlayers) throw new Error("Table is full");
	if (match.players.some((p) => p.walletId === wallet.id)) throw new Error("Already seated");
	debit(wallet, match.entryFee);
	touchWallet(wallet);
	match.prizePool += match.entryFee;
	recordLedger({
		from: wallet.id,
		to: "treasury",
		amount: match.entryFee,
		kind: "entry",
		matchId: match.id,
		note: `Entry ${match.gameId} ${match.id}`
	});
	const player = {
		id: wallet.id,
		name: wallet.name,
		walletId: wallet.id,
		controller,
		tint: TINTS[match.players.length % TINTS.length],
		joinedAt: Date.now(),
		connected: true
	};
	match.players.push(player);
	log(match, "join", `${player.name} paid ${formatUsdc(match.entryFee)} entry and sat down. Pot ${formatUsdc(match.prizePool)}.`, player.id);
	log(match, "pay", `${player.name} → treasury ${formatUsdc(match.entryFee)} (entry).`, player.id);
	return player;
}
async function joinMatch(opts) {
	await ready();
	await pullMatch(opts.matchId);
	const match = mustMatch(opts.matchId);
	if (match.status !== "lobby") return {
		ok: false,
		error: "Table is not in lobby"
	};
	const parsed = parsePaymentHeader(opts.paymentHeader ?? null, opts.walletId, opts.secret);
	if (!parsed) return {
		ok: false,
		paymentRequired: {
			x402Version: 1,
			accepts: [paymentAccept({
				amount: match.entryFee,
				resource: `/api/v1/matches/${match.id}/join`,
				description: `Entry fee for ${match.id}`,
				kind: "entry"
			})]
		}
	};
	try {
		await pullWallet(parsed.walletId);
		const wallet = mustWallet(parsed.walletId);
		seatPlayer(match, wallet, opts.controller === "bot" ? "bot" : "human");
		if (match.withBots) fillBots(match, botFillTarget(match.gameId, match.maxPlayers));
		if (match.players.length >= match.maxPlayers || match.withBots && match.players.length >= match.minPlayers || catalogById(match.gameId).oneshot && match.players.length >= match.minPlayers) await startMatch(match);
		await flush();
		return {
			ok: true,
			match: toPublic(match, wallet.id)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Join failed"
		};
	}
}
async function startMatch(match) {
	if (match.status !== "lobby") return;
	const need = match.kind === "challenge" ? match.minToStart ?? match.minPlayers : match.minPlayers;
	if (match.players.length < need) return;
	if (match.gameId === "coinpump") {
		const { quotes, source } = await fetchQuotes();
		if (match.status !== "lobby") return;
		const state = createCoinPumpState(Date.now(), quotes, source);
		match.state = state;
		match.status = "playing";
		match.startedAt = Date.now();
		match.turnDeadline = state.windowEndsAt;
		log(match, "system", `Match started with ${match.players.length} agents. Prize pool ${formatUsdc(match.prizePool)}.`);
		log(match, "system", `Five coins are on the tape. Window 10 minutes, picks lock in 90s. Source: ${source === "coingecko" ? "CoinGecko spot" : "simulated spot (feed unavailable)"}.`);
		for (const c of quotes) log(match, "system", `${c.ticker} opens at $${c.startUsd.toFixed(c.startUsd < 2 ? 4 : 2)}.`);
		return;
	}
	match.status = "playing";
	match.startedAt = Date.now();
	log(match, "system", `Match started with ${match.players.length} agents. Prize pool ${formatUsdc(match.prizePool)}.`);
	switch (match.gameId) {
		case "orderbook": {
			const state = createOrderBookState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Order Book Raider live: ${state.baseAsset}/${state.quoteAsset} (${state.marketRegime.replace(/_/g, " ")}). Mid: $${state.midPrice.toFixed(2)}. Spread: ${state.spreadBps} bps. Capture depth and flash arbitrage!`);
			break;
		}
		case "cascade": {
			const state = createCascadeState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Liquidation Cascade live on ${state.assetSymbol}. Index price: $${state.currentPrice.toFixed(2)}. Leverage 15x. Avoid margin call or hunt over-leveraged competitors!`);
			break;
		}
		case "flashloan": {
			const state = createFlashLoanState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `MEV Flash Sniper live at block #${state.blockNumber}. Base gas: ${state.gasPriceGwei} Gwei. Cross-DEX spreads active. Bid gas and land flash loan arbitrage bundles!`);
			break;
		}
		case "snakes":
			match.state = createSnakesState(match.players);
			match.currentPlayerId = match.players[0].id;
			match.turnDeadline = Date.now() + SNAKES_TURN_MS;
			log(match, "system", `${match.players[0].name} opens the dice.`);
			break;
		case "debate": {
			const state = createDebateState(match.players, Date.now(), match.customConfig);
			match.state = state;
			const seat = currentDebateSeat(state);
			match.currentPlayerId = seat?.playerId;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Motion: ${state.topic}`);
			if (state.rubric && state.rubric !== "balanced") log(match, "judge", `Panel rubric: ${state.rubric}. Logic 40 · relevance 40 · rhetoric 20.`);
			if (seat) log(match, "system", `${playerName(match, seat.playerId)} has the floor for opening.`, seat.playerId);
			break;
		}
		case "rps": {
			const state = createRpsState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", "Round 1 of 5. Throw rock, paper, or scissors. Chat agents: POST commit with a 5-throw tape, then stop.");
			break;
		}
		case "dilemma": {
			const state = createDilemmaState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", "Round 1 of 5. Seal your move. Envelopes stay closed until both lock. Chat agents: POST commit with a 5-move tape, then stop.");
			break;
		}
		case "target": {
			const state = createTargetState(Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", "Lock one integer 1–99. One POST. Closest to the draw wins. Chat agents can leave after they lock.");
			break;
		}
		case "marketblitz": {
			const state = createMarketBlitzState(match.players, Date.now());
			match.state = state;
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Market Blitz live: ${state.assetSymbol} (${state.regimeHint.replace(/_/g, " ")}). 15 warmup candles. 30 fast ticks. Position: LONG, SHORT, or FLAT with 1-5x leverage.`);
			break;
		}
	}
}
function advanceSnakesTurn(match) {
	const state = match.state;
	state.turnIndex = (state.turnIndex + 1) % match.players.length;
	match.currentPlayerId = match.players[state.turnIndex].id;
	match.turnDeadline = Date.now() + SNAKES_TURN_MS;
}
function finishMatch(match, winnerIds) {
	if (match.status === "finished") return;
	match.status = "finished";
	match.finishedAt = Date.now();
	match.currentPlayerId = void 0;
	match.turnDeadline = void 0;
	match.winners = winnerIds;
	if (winnerIds.length === 0 || match.prizePool <= 0) {
		if (match.prizePool > 0) log(match, "win", "No winner. Pot stays in the treasury.");
		match.prizePool = 0;
		log(match, "system", "Table closed. This table does not rematch — sit a new one from the floor if you want another game.");
		return;
	}
	const share = Math.floor(match.prizePool / winnerIds.length);
	const remainder = match.prizePool - share * winnerIds.length;
	for (let i = 0; i < winnerIds.length; i++) {
		const id = winnerIds[i];
		const amount = share + (i === 0 ? remainder : 0);
		const wallet = getWorld().wallets.get(id);
		if (wallet) {
			credit(wallet, amount);
			touchWallet(wallet);
			match.payouts.push({
				playerId: id,
				amount
			});
			recordLedger({
				from: "treasury",
				to: wallet.id,
				amount,
				kind: "payout",
				matchId: match.id,
				note: `Prize ${match.id}`
			});
			log(match, "win", `${wallet.name} is paid ${formatUsdc(amount)} from the pot.`, id);
		}
	}
	match.prizePool = 0;
	const names = winnerIds.length > 0 ? winnerIds.map((id) => playerName(match, id)).join(", ") : "nobody";
	for (const player of match.players) {
		const isWinner = winnerIds.includes(player.id);
		const netPnl = (match.payouts.find((p) => p.playerId === player.id)?.amount ?? 0) - match.entryFee;
		recordMatchReputationUpdate(player.id, player.name, isWinner, netPnl);
	}
	log(match, "system", `Table closed. Pot paid to ${names}. On-chain ERC-8004 reputation updated for all agents.`);
}
function refundEntry(match, player) {
	const wallet = getWorld().wallets.get(player.walletId);
	if (!wallet || match.entryFee <= 0) return;
	credit(wallet, match.entryFee);
	touchWallet(wallet);
	match.prizePool = Math.max(0, match.prizePool - match.entryFee);
	recordLedger({
		from: "treasury",
		to: wallet.id,
		amount: match.entryFee,
		kind: "refund",
		matchId: match.id,
		note: `Lobby closed ${match.id}`
	});
	log(match, "pay", `${wallet.name} refunded ${formatUsdc(match.entryFee)} (lobby closed).`, player.id);
}
async function abandonLobby(match) {
	if (match.status !== "lobby") return;
	const world = getWorld();
	if (match.players.length === 0) {
		world.matches.delete(match.id);
		world.dirtyMatches.delete(match.id);
		await deleteMatch(match.id);
		return;
	}
	for (const p of match.players) refundEntry(match, p);
	match.prizePool = 0;
	log(match, "system", match.kind === "challenge" ? "Challenge expired. Entries refunded in full." : "Lobby closed after 2 minutes without enough agents. Entries refunded.");
	match.cancelled = true;
	finishMatch(match, []);
}
async function forceSettle(match) {
	if (match.status !== "playing") return;
	log(match, "system", "Clock ran out. Settling the table.");
	if (match.gameId === "snakes") {
		const state = match.state;
		let best = -1;
		const winners = [];
		for (const p of match.players) {
			const pos = state.pieces[p.id]?.position ?? 0;
			if (pos > best) {
				best = pos;
				winners.length = 0;
				winners.push(p.id);
			} else if (pos === best) winners.push(p.id);
		}
		finishMatch(match, winners);
		return;
	}
	if (match.gameId === "debate") {
		const state = match.state;
		if (state.scores) {
			finishMatch(match, debateWinners(state));
			return;
		}
		state.roundIndex = ROUND_SEQUENCE.length;
		state.judging = true;
		await runJudge(match);
		return;
	}
	if (match.gameId === "coinpump") {
		const state = match.state;
		if (state.resolved) {
			finishMatch(match, []);
			return;
		}
		await refreshQuotes(state);
		const { ranking, winnerCoinIds } = resolveCoinPump(state);
		const top = ranking[0];
		log(match, "system", `Window closed. Top tape: ${state.coins.find((c) => c.id === top?.id)?.ticker ?? "?"} ${top && top.changePct >= 0 ? "+" : ""}${top?.changePct.toFixed(3)}%.`);
		const winners = match.players.filter((p) => winnerCoinIds.includes(state.picks[p.id] ?? "")).map((p) => p.id);
		if (winners.length === 0) {
			log(match, "win", "Nobody picked the top tape. Pot stays in the treasury.");
			finishMatch(match, []);
		} else {
			log(match, "win", `${winners.map((id) => playerName(match, id)).join(", ")} called it.`);
			finishMatch(match, winners);
		}
		return;
	}
	if (match.gameId === "rps") {
		const state = match.state;
		const round = state.rounds[state.roundIndex];
		if (round && !round.resolved) resolveRpsRound(match);
		if (match.status === "playing") {
			const max = Math.max(0, ...match.players.map((p) => state.scores[p.id] ?? 0));
			finishMatch(match, match.players.filter((p) => (state.scores[p.id] ?? 0) === max).map((p) => p.id));
		}
		return;
	}
	if (match.gameId === "dilemma") {
		const state = match.state;
		const round = state.rounds[state.roundIndex];
		if (round && !round.resolved) resolveDilemmaRound(match);
		if (match.status === "playing") {
			const max = Math.max(0, ...match.players.map((p) => state.scores[p.id] ?? 0));
			finishMatch(match, match.players.filter((p) => (state.scores[p.id] ?? 0) === max).map((p) => p.id));
		}
		return;
	}
	if (match.gameId === "marketblitz") {
		const state = match.state;
		state.resolved = true;
		const ranked = Object.entries(state.portfolios).filter(([, pf]) => !pf.liquidated).sort(([, a], [, b]) => b.equityUsd - a.equityUsd);
		if (ranked.length === 0) finishMatch(match, []);
		else {
			const topEquity = ranked[0][1].equityUsd;
			finishMatch(match, ranked.filter(([, pf]) => pf.equityUsd === topEquity).map(([id]) => id));
		}
		return;
	}
	if (match.gameId === "orderbook") {
		const state = match.state;
		state.resolved = true;
		const ranked = Object.entries(state.portfolios).sort(([, a], [, b]) => b.totalEquityUsd - a.totalEquityUsd);
		if (ranked.length === 0) finishMatch(match, []);
		else {
			const topEquity = ranked[0][1].totalEquityUsd;
			finishMatch(match, ranked.filter(([, pf]) => pf.totalEquityUsd === topEquity).map(([id]) => id));
		}
		return;
	}
	if (match.gameId === "cascade") {
		const state = match.state;
		state.resolved = true;
		const ranked = Object.entries(state.positions).filter(([, p]) => !p.isLiquidated).sort(([, a], [, b]) => b.totalEquityUsd - a.totalEquityUsd);
		if (ranked.length === 0) finishMatch(match, []);
		else {
			const topEquity = ranked[0][1].totalEquityUsd;
			finishMatch(match, ranked.filter(([, p]) => p.totalEquityUsd === topEquity).map(([id]) => id));
		}
		return;
	}
	if (match.gameId === "flashloan") {
		const state = match.state;
		state.resolved = true;
		const ranked = Object.entries(state.raiders).sort(([, a], [, b]) => b.totalProfitUsd - a.totalProfitUsd);
		if (ranked.length === 0) finishMatch(match, []);
		else {
			const topProfit = ranked[0][1].totalProfitUsd;
			finishMatch(match, ranked.filter(([, r]) => r.totalProfitUsd === topProfit).map(([id]) => id));
		}
		return;
	}
}
function takePowerupFee(match, wallet, amount, note) {
	debit(wallet, amount);
	touchWallet(wallet);
	match.prizePool += amount;
	recordLedger({
		from: wallet.id,
		to: "treasury",
		amount,
		kind: "powerup",
		matchId: match.id,
		note
	});
	log(match, "pay", `${wallet.name} paid ${formatUsdc(amount)} (${note}). Pot ${formatUsdc(match.prizePool)}.`, wallet.id);
}
async function submitAction(opts) {
	await ready();
	await pullMatch(opts.matchId);
	const match = mustMatch(opts.matchId);
	if (match.status === "finished") return {
		ok: false,
		error: "Table is closed. No rematch — open a new table from the floor."
	};
	if (match.status !== "playing") return {
		ok: false,
		error: "Match is not live"
	};
	const walletId = parsePaymentHeader(opts.paymentHeader ?? null, opts.walletId, opts.secret)?.walletId;
	if (!walletId) return {
		ok: false,
		error: "Unauthorized. Send walletId and secret from POST /wallets."
	};
	await pullWallet(walletId);
	const player = match.players.find((p) => p.id === walletId);
	if (!player) return {
		ok: false,
		error: "You are not seated at this table"
	};
	try {
		applyAction(match, player, opts.action, opts.paymentHeader ?? null);
		await flush();
		return {
			ok: true,
			match: toPublic(match, player.id)
		};
	} catch (err) {
		if (err instanceof PaymentNeeded) return {
			ok: false,
			paymentRequired: err.body
		};
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Action failed"
		};
	}
}
var PaymentNeeded = class extends Error {
	body;
	constructor(accepts) {
		super("Payment required");
		this.body = {
			x402Version: 1,
			accepts
		};
	}
};
function requirePaid(match, player, header, amount, kind, note) {
	const wallet = mustWallet(player.walletId);
	const parsed = parsePaymentHeader(header);
	if (!parsed || parsed.walletId !== player.walletId) throw new PaymentNeeded([paymentAccept({
		amount,
		resource: `/api/v1/matches/${match.id}/action`,
		description: note,
		kind
	})]);
	takePowerupFee(match, wallet, amount, note);
}
function applyAction(match, player, action, header) {
	const type = String(action.type ?? "");
	switch (match.gameId) {
		case "orderbook":
			applyOrderBook(match, player, type, action, header);
			break;
		case "cascade":
			applyCascade(match, player, type, action, header);
			break;
		case "flashloan":
			applyFlashLoan(match, player, type, action, header);
			break;
		case "snakes":
			applySnakes(match, player, type, action, header);
			break;
		case "debate":
			applyDebate(match, player, type, action);
			break;
		case "coinpump":
			applyCoinPump(match, player, type, action);
			break;
		case "rps":
			applyRps(match, player, type, action, header);
			break;
		case "dilemma":
			applyDilemma(match, player, type, action);
			break;
		case "target":
			applyTarget(match, player, type, action);
			break;
		case "marketblitz":
			applyMarketBlitz(match, player, type, action, header);
			break;
		default: throw new Error("Unknown game");
	}
}
function applyCascade(match, player, type, action, header) {
	const state = match.state;
	if (state.resolved) throw new Error("Match already closed");
	if (!state.positions[player.id]) throw new Error("Margin position not found");
	if (type === "margin_shield") requirePaid(match, player, header, CASCADE_SHIELD_FEE, "margin_shield", "emergency margin shield");
	const res = applyCascadeAction(state, player.id, action, match.players);
	if (res.logText) log(match, "move", res.logText, player.id);
}
function applyFlashLoan(match, player, type, action, header) {
	const state = match.state;
	if (state.resolved) throw new Error("Match already closed");
	if (!state.raiders[player.id]) throw new Error("MEV Raider not found");
	if (type === "builder_bribe") requirePaid(match, player, header, FLASH_BRIBE_FEE, "builder_bribe", "builder private bribe");
	const res = applyFlashLoanAction(state, player.id, action, match.players);
	if (res.logText) log(match, "move", res.logText, player.id);
}
function applyOrderBook(match, player, type, action, header) {
	const state = match.state;
	if (state.resolved) throw new Error("Match already closed");
	if (!state.portfolios[player.id]) throw new Error("Raider portfolio not found");
	if (type === "liquidity_shield") requirePaid(match, player, header, RAIDER_SHIELD_FEE, "liquidity_shield", "slippage shield");
	const res = applyOrderBookAction(state, player.id, action, match.players);
	if (res.logText) log(match, "move", res.logText, player.id);
}
function applyMarketBlitz(match, player, type, action, header) {
	const state = match.state;
	if (state.resolved) throw new Error("Match already closed");
	const pf = state.portfolios[player.id];
	if (!pf) throw new Error("Portfolio not found");
	if (pf.liquidated) throw new Error("Account liquidated - cannot trade");
	if (type === "pilot") {
		if (state.pilots?.[player.id]) throw new Error("Already on auto-pilot");
		state.pilots = {
			...state.pilots ?? {},
			[player.id]: true
		};
		log(match, "system", `${player.name} engaged Auto-Pilot algorithm.`, player.id);
		return;
	}
	if (type === "stoploss") {
		if (pf.protectedStop) throw new Error("Slippage Shield already active");
		requirePaid(match, player, header, STOPLOSS_FEE, "stoploss", "slippage shield");
		pf.protectedStop = true;
		log(match, "pay", `${player.name} activated Slippage Shield against sudden liquidation.`, player.id);
		return;
	}
	if (type === "commit") {
		if (state.tapes?.[player.id]) throw new Error("Strategy tape already committed");
		const raw = Array.isArray(action.tape) ? action.tape : [];
		if (raw.length === 0) throw new Error("Send { type: \"commit\", tape: [\"long\"|\"short\"|\"flat\", ...] }");
		const tape = raw.map((item) => MARKET_POSITIONS.includes(String(item).toLowerCase()) ? String(item).toLowerCase() : "flat");
		state.tapes = {
			...state.tapes ?? {},
			[player.id]: tape
		};
		log(match, "move", `${player.name} committed automated strategy tape (${tape.length} ticks).`, player.id);
		return;
	}
	if (type !== "trade") throw new Error("Send { type: \"trade\", position: \"long\"|\"short\"|\"flat\", leverage: 1..5, sizePct: 25..100 }");
	const rawPos = String(action.position ?? action.option ?? "flat").toLowerCase();
	if (!MARKET_POSITIONS.includes(rawPos)) throw new Error("position must be \"long\", \"short\", or \"flat\"");
	const lev = Number(action.leverage ?? pf.leverage ?? 1);
	const size = Number(action.sizePct ?? pf.sizePct ?? 100);
	applyMarketBlitzTrade(state, player.id, rawPos, lev, size);
	log(match, "move", `${player.name} set position: ${rawPos.toUpperCase()} ${rawPos !== "flat" ? `(${lev}x, ${size}% margin)` : ""}`, player.id);
}
function applySnakes(match, player, type, action, header) {
	const state = match.state;
	if (type === "pilot") {
		if (state.pilots?.[player.id]) throw new Error("Already on pilot");
		state.pilots = {
			...state.pilots ?? {},
			[player.id]: true
		};
		log(match, "system", `${player.name} handed the dice to the table. Chat can close — the seat keeps rolling.`, player.id);
		return;
	}
	if (match.currentPlayerId !== player.id) throw new Error("Not your turn");
	let powerupRaw = action.powerup ?? action.option;
	if (type === "reroll" || type === "ward") powerupRaw = type;
	else if (type !== "roll") throw new Error("Send { type: \"roll\" } with optional powerup \"reroll\" | \"ward\", or { type: \"pilot\" }");
	const powerup = powerupRaw === "reroll" || powerupRaw === "ward" ? powerupRaw : void 0;
	if (powerup === "reroll") requirePaid(match, player, header, REROLL_FEE, "reroll", "re-roll");
	if (powerup === "ward") requirePaid(match, player, header, WARD_FEE, "ward", "snake ward");
	const piece = state.pieces[player.id] ?? { position: 0 };
	const result = resolveSnakesTurn({
		name: player.name,
		from: piece.position,
		powerup
	});
	piece.position = result.to;
	state.pieces[player.id] = piece;
	state.lastRoll = {
		playerId: player.id,
		die: result.die,
		from: result.from,
		to: result.to
	};
	for (const line of result.logs) log(match, "move", line, player.id);
	if (result.won) {
		finishMatch(match, [player.id]);
		return;
	}
	advanceSnakesTurn(match);
}
function applyDebate(match, player, type, action) {
	if (type !== "submit") throw new Error("Send { type: \"submit\", text: \"...\" }");
	const text = stripInjected(String(action.text ?? "")).trim();
	if (text.length < 12) throw new Error("Argument is too short");
	if (text.length > 1200) throw new Error("Argument is too long");
	const state = match.state;
	const seat = currentDebateSeat(state);
	if (!seat || seat.playerId !== player.id) throw new Error("Not your window");
	if (state.speeches.some((s) => s.playerId === player.id && s.round === seat.kind)) throw new Error("Already submitted this round");
	state.speeches.push({
		playerId: player.id,
		round: seat.kind,
		text,
		submittedAt: Date.now()
	});
	log(match, "move", `${player.name} filed their ${seat.kind}: "${truncate(text, 160)}"`, player.id);
	advanceDebate(match);
}
function advanceDebate(match) {
	const state = match.state;
	state.roundIndex += 1;
	if (state.roundIndex >= ROUND_SEQUENCE.length) {
		match.currentPlayerId = void 0;
		match.turnDeadline = void 0;
		state.judging = true;
		state.judgeStarted = Date.now();
		log(match, "judge", "The floor is closed. The judge is scoring.");
		runJudge(match);
		return;
	}
	const kind = ROUND_SEQUENCE[state.roundIndex];
	const seat = currentDebateSeat(state);
	state.windowEndsAt = Date.now() + debateWindowMs(state, kind);
	match.currentPlayerId = seat?.playerId;
	match.turnDeadline = state.windowEndsAt;
	if (seat) log(match, "system", `${playerName(match, seat.playerId)} has the floor for ${kind}.`, seat.playerId);
}
async function runJudge(match) {
	const state = match.state;
	const names = {};
	for (const p of match.players) names[p.id] = p.name;
	const result = await judgeDebate({
		topic: state.topic,
		names,
		speeches: state.speeches,
		speakerOrder: state.speakerOrder,
		rubric: state.rubric
	});
	state.scores = result.scores;
	state.verdict = result.verdict;
	state.panel = result.panel;
	state.judging = false;
	log(match, "judge", result.verdict);
	for (const judge of result.panel.judges) {
		const bits = match.players.map((p) => {
			const s = judge.scores[p.id];
			if (!s) return null;
			return `${p.name} L${s.logic} R${s.relevance} C${s.rhetoric} = ${s.total}`;
		}).filter(Boolean).join(" · ");
		log(match, "judge", `${judge.name}: ${bits}`);
	}
	for (const p of match.players) {
		const s = result.scores[p.id];
		if (s) log(match, "judge", `${p.name} consensus ${s.total}/10 (logic ${s.logic} · relevance ${s.relevance} · rhetoric ${s.rhetoric}) — ${s.notes}`, p.id);
	}
	finishMatch(match, debateWinners(state));
	await flush();
}
function applyCoinPump(match, player, type, action) {
	if (type !== "pick") throw new Error("Send { type: \"pick\", coinId: \"btc\" }");
	const state = match.state;
	if (Date.now() >= state.lockAt) throw new Error("Picks are locked");
	if (state.picks[player.id]) throw new Error("Already picked — picks are write-once");
	const coinId = String(action.coinId ?? action.option ?? "");
	const coin = state.coins.find((c) => c.id === coinId || c.ticker.toLowerCase() === coinId.toLowerCase());
	if (!coin) throw new Error("Unknown coin");
	state.picks[player.id] = coin.id;
	log(match, "move", `${player.name} picks ${coin.ticker}.`, player.id);
}
function applyRps(match, player, type, action, header) {
	const state = match.state;
	const round = state.rounds[state.roundIndex];
	if (!round || round.resolved) throw new Error("Wait for the next round");
	if (round.throws[player.id]) throw new Error("Already thrown this round");
	if (type === "scout") {
		requirePaid(match, player, header, SCOUT_FEE, "scout", "scout");
		state.scouts[`${state.roundIndex}:${player.id}`] = true;
		const seen = match.players.filter((p) => p.id !== player.id && state.lastThrows[p.id]).map((p) => `${p.name} last threw ${state.lastThrows[p.id]}`).join("; ");
		log(match, "move", `${player.name} bought a scout. ${seen || "No prior throws on record."}`, player.id);
		return;
	}
	if (type === "commit") {
		if (state.tape?.[player.id]) throw new Error("Tape already sealed");
		if (round.throws[player.id]) throw new Error("Already thrown this round — too late to seal a tape");
		const raw = Array.isArray(action.tape) ? action.tape : [];
		if (raw.length !== 5) throw new Error(`Send { type: "commit", tape: [5 gestures] } — rock, paper, or scissors`);
		const tape = [];
		for (const item of raw) {
			const g = String(item);
			if (!GESTURES.includes(g)) throw new Error("Each tape slot must be rock, paper, or scissors");
			tape.push(g);
		}
		state.tape = {
			...state.tape ?? {},
			[player.id]: tape
		};
		log(match, "move", `${player.name} sealed a 5-round tape. The table will throw for them.`, player.id);
		drainRpsTapes(match);
		return;
	}
	if (type !== "throw") throw new Error("Send { type: \"throw\", gesture: \"rock\" } or { type: \"commit\", tape: [...] }");
	const gesture = String(action.gesture ?? action.option ?? "");
	if (!GESTURES.includes(gesture)) throw new Error("gesture must be rock, paper, or scissors");
	round.throws[player.id] = gesture;
	log(match, "move", `${player.name} locks a throw.`, player.id);
	if (Object.keys(round.throws).length >= match.players.length) resolveRpsRound(match);
}
function resolveRpsRound(match) {
	const state = match.state;
	const round = state.rounds[state.roundIndex];
	if (!round || round.resolved) return;
	for (const p of match.players) if (!round.throws[p.id]) {
		const g = botGesture(state, p.id);
		round.throws[p.id] = g;
		log(match, "move", `${p.name} missed the window and the table drew ${g}.`, p.id);
	}
	const gained = scoreRound(match.players, round.throws);
	round.scores = gained;
	round.resolved = true;
	state.revealing = true;
	const streakBefore = { ...state.scores };
	for (const p of match.players) {
		const g = round.throws[p.id];
		state.lastThrows[p.id] = g;
		let add = gained[p.id] ?? 0;
		if ((streakBefore[p.id] ?? 0) > 0 && add >= 2) add += 1;
		state.scores[p.id] = (state.scores[p.id] ?? 0) + add;
		log(match, "move", `${p.name} threw ${g} · +${add} this round · total ${state.scores[p.id]}.`, p.id);
	}
	if (state.roundIndex + 1 >= 5) {
		const max = Math.max(...match.players.map((p) => state.scores[p.id] ?? 0));
		const winners = match.players.filter((p) => (state.scores[p.id] ?? 0) === max).map((p) => p.id);
		log(match, "system", "Five rounds in the book.");
		finishMatch(match, winners);
		return;
	}
	nextRpsRound(state, Date.now());
	match.turnDeadline = state.windowEndsAt;
	log(match, "system", `Round ${state.roundIndex + 1} of 5.`);
}
function applyDilemma(match, player, type, action) {
	const state = match.state;
	const round = state.rounds[state.roundIndex];
	if (!round || round.resolved) throw new Error("Wait for the next round");
	if (type === "commit") {
		if (state.tape?.[player.id]) throw new Error("Tape already sealed");
		if (round.sealed[player.id]) throw new Error("Already sealed this round — too late for a tape");
		const raw = Array.isArray(action.tape) ? action.tape : [];
		if (raw.length !== 5) throw new Error("Send { type: \"commit\", tape: [5 moves] } — cooperate or defect");
		const tape = [];
		for (const item of raw) {
			const m = String(item);
			if (!isDilemmaMove(m)) throw new Error("Each tape slot must be cooperate or defect");
			tape.push(m);
		}
		state.tape = {
			...state.tape ?? {},
			[player.id]: tape
		};
		log(match, "move", `${player.name} sealed a 5-round tape. Envelopes stay closed.`, player.id);
		drainDilemmaTapes(match);
		return;
	}
	if (round.sealed[player.id]) throw new Error("Already sealed this round");
	if (type !== "choose") throw new Error("Send { type: \"choose\", move: \"cooperate\" } or \"defect\", or { type: \"commit\", tape: [...] }");
	const raw = String(action.move ?? action.option ?? "");
	if (!isDilemmaMove(raw)) throw new Error("move must be \"cooperate\" or \"defect\"");
	round.sealed[player.id] = raw;
	log(match, "move", `${player.name} sealed a move. The envelope stays closed.`, player.id);
	if (Object.keys(round.sealed).length >= match.players.length) resolveDilemmaRound(match);
}
function resolveDilemmaRound(match) {
	const state = match.state;
	const round = state.rounds[state.roundIndex];
	if (!round || round.resolved) return;
	for (const p of match.players) if (!round.sealed[p.id]) {
		round.sealed[p.id] = "defect";
		log(match, "move", `${p.name} missed the window. The table sealed a default.`, p.id);
	}
	const a = match.players[0];
	const b = match.players[1];
	if (!a || !b) {
		round.resolved = true;
		finishMatch(match, []);
		return;
	}
	const ma = round.sealed[a.id];
	const mb = round.sealed[b.id];
	const [sa, sb] = payoff(ma, mb);
	round.scores[a.id] = sa;
	round.scores[b.id] = sb;
	state.scores[a.id] = (state.scores[a.id] ?? 0) + sa;
	state.scores[b.id] = (state.scores[b.id] ?? 0) + sb;
	round.resolved = true;
	state.revealing = true;
	log(match, "move", `Envelopes open. ${a.name} ${said(ma)}. ${b.name} ${said(mb)}.`);
	log(match, "move", roundLine(a.name, ma, sa, state.scores[a.id]) + " · " + roundLine(b.name, mb, sb, state.scores[b.id]));
	if (state.roundIndex + 1 >= 5) {
		const max = Math.max(...match.players.map((p) => state.scores[p.id] ?? 0));
		const winners = match.players.filter((p) => (state.scores[p.id] ?? 0) === max).map((p) => p.id);
		log(match, "system", "Five rounds in the book.");
		finishMatch(match, winners);
		return;
	}
	nextDilemmaRound(state, Date.now());
	match.turnDeadline = state.windowEndsAt;
	log(match, "system", `Round ${state.roundIndex + 1} of 5. Seal again.`);
}
function drainRpsTapes(match) {
	const state = match.state;
	for (let i = 0; i < 7 && match.status === "playing"; i++) {
		const round = state.rounds[state.roundIndex];
		if (!round || round.resolved) break;
		let placed = false;
		for (const p of match.players) {
			if (round.throws[p.id]) continue;
			const g = state.tape?.[p.id]?.[state.roundIndex];
			if (!g) continue;
			round.throws[p.id] = g;
			log(match, "move", `${p.name} locks a throw.`, p.id);
			placed = true;
		}
		if (Object.keys(round.throws).length >= match.players.length) {
			resolveRpsRound(match);
			continue;
		}
		if (!placed) break;
	}
}
function drainDilemmaTapes(match) {
	const state = match.state;
	for (let i = 0; i < 7 && match.status === "playing"; i++) {
		const round = state.rounds[state.roundIndex];
		if (!round || round.resolved) break;
		let placed = false;
		for (const p of match.players) {
			if (round.sealed[p.id]) continue;
			const m = state.tape?.[p.id]?.[state.roundIndex];
			if (!m) continue;
			round.sealed[p.id] = m;
			log(match, "move", `${p.name} sealed a move. The envelope stays closed.`, p.id);
			placed = true;
		}
		if (Object.keys(round.sealed).length >= match.players.length) {
			resolveDilemmaRound(match);
			continue;
		}
		if (!placed) break;
	}
}
function applyTarget(match, player, type, action) {
	if (type !== "lock") throw new Error("Send { type: \"lock\", value: 47 } — integer 1–99");
	const state = match.state;
	if (state.resolved) throw new Error("Draw already landed");
	if (Date.now() >= state.windowEndsAt) throw new Error("Lock window closed");
	if (state.locks[player.id] != null) throw new Error("Already locked");
	const value = Number(action.value ?? action.option);
	if (!isTargetValue(value)) throw new Error("value must be a whole number from 1 to 99");
	state.locks[player.id] = value;
	log(match, "move", `${player.name} locked a number. The envelope stays closed.`, player.id);
	if (Object.keys(state.locks).length >= match.players.length) resolveTarget(match);
}
function resolveTarget(match) {
	const state = match.state;
	if (state.resolved) return;
	const secret = 1 + Math.floor(Math.random() * 99);
	state.secret = secret;
	state.resolved = true;
	log(match, "system", `The table drew ${secret}.`);
	const seated = match.players.filter((p) => state.locks[p.id] != null);
	if (seated.length === 0) {
		log(match, "win", "Nobody locked a number. Pot stays in the treasury.");
		finishMatch(match, []);
		return;
	}
	const dist = (id) => Math.abs((state.locks[id] ?? 999) - secret);
	const best = Math.min(...seated.map((p) => dist(p.id)));
	const winners = seated.filter((p) => dist(p.id) === best);
	for (const p of match.players) {
		const n = state.locks[p.id];
		if (n == null) log(match, "move", `${p.name} had no lock.`, p.id);
		else log(match, "move", `${p.name} locked ${n} · distance ${Math.abs(n - secret)}.`, p.id);
	}
	log(match, "win", `${winners.map((p) => p.name).join(", ")} closest to ${secret}.`);
	finishMatch(match, winners.map((p) => p.id));
}
function said(move) {
	return move === "cooperate" ? "cooperated" : "defected";
}
function roundLine(name, move, gained, total) {
	return `${name} ${move}s · +${gained} · total ${total}`;
}
function truncate(s, n) {
	return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
function stripInjected(raw) {
	return raw.replace(/<[^>]*>/g, " ").replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/\s+/g, " ");
}
async function tickAll() {
	const world = getWorld();
	for (const match of world.matches.values()) try {
		await tickMatch(match);
	} catch {}
}
async function tickMatch(match) {
	const now = Date.now();
	if (match.status === "lobby") {
		if (match.kind === "challenge") {
			if (match.players.length >= match.maxPlayers) {
				await startMatch(match);
				return;
			}
			if (now >= (match.expiresAt ?? match.createdAt + (match.lobbyTimeoutMs ?? 3e5))) {
				if (match.players.length >= (match.minToStart ?? match.minPlayers)) await startMatch(match);
				else await abandonLobby(match);
			}
			return;
		}
		if (match.players.length < match.minPlayers) {
			if (now - lobbyIdleSince(match) > (match.lobbyTimeoutMs ?? 12e4)) {
				await abandonLobby(match);
				return;
			}
		}
		const hasGuest = match.players.some((p) => p.controller !== "bot");
		if (match.withBots && hasGuest && match.players.length < match.maxPlayers) fillBots(match, botFillTarget(match.gameId, match.maxPlayers));
		if (match.players.length >= match.minPlayers) {
			const lastJoin = Math.max(...match.players.map((p) => p.joinedAt), match.createdAt);
			const oneshot = Boolean(catalogById(match.gameId).oneshot);
			const waitMs = match.withBots || oneshot ? 400 : 2e3;
			if (now - lastJoin > waitMs || match.players.length >= match.maxPlayers) await startMatch(match);
		}
	}
	if (match.status !== "playing") return;
	if (match.startedAt && now - match.startedAt > (MAX_PLAY_MS[match.gameId] ?? 48e4)) {
		await forceSettle(match);
		return;
	}
	if (match.gameId === "snakes") {
		const current = match.players.find((p) => p.id === match.currentPlayerId);
		if (!current) {
			await forceSettle(match);
			return;
		}
		const due = (match.turnDeadline ?? 0) <= now;
		const piloted = Boolean(match.state.pilots?.[current.id]);
		const autoSeat = current.controller === "bot" || piloted;
		const botReady = autoSeat && (match.turnDeadline ?? 0) - now < 23500;
		if (due && !autoSeat) {
			log(match, "system", `${current.name} missed the window. The table rolls.`, current.id);
			try {
				applyAction(match, current, { type: "roll" }, current.walletId);
			} catch {
				advanceSnakesTurn(match);
			}
			return;
		}
		if (due || botReady) {
			const state = match.state;
			const powerup = current.controller === "bot" ? snakesBotPowerup(state, current.id) : void 0;
			const action = { type: "roll" };
			if (powerup) action.powerup = powerup;
			try {
				applyAction(match, current, action, current.walletId);
			} catch {
				applyAction(match, current, { type: "roll" }, current.walletId);
			}
		}
		return;
	}
	if (match.gameId === "debate") {
		const state = match.state;
		if (state.judging) {
			if (!state.verdict) {
				const started = state.judgeStarted ?? 0;
				if (!started || Date.now() - started > 25e3) {
					state.judgeStarted = Date.now();
					runJudge(match);
				}
			}
			return;
		}
		const seat = currentDebateSeat(state);
		if (!seat) return;
		const player = match.players.find((p) => p.id === seat.playerId);
		if (!player) return;
		const expired = now >= state.windowEndsAt;
		const botReady = player.controller === "bot" && now > (match.startedAt ?? now) && state.windowEndsAt - now < debateWindowMs(state, seat.kind) - 3500;
		if (expired) {
			log(match, "system", `${player.name} let the ${seat.kind} window close in silence.`, player.id);
			advanceDebate(match);
			return;
		}
		if (botReady && !state.speeches.some((s) => s.playerId === player.id && s.round === seat.kind)) applyDebate(match, player, "submit", {
			type: "submit",
			text: botDebateText(seat.kind, state.topic, player.name)
		});
		return;
	}
	if (match.gameId === "coinpump") {
		const state = match.state;
		if (state.resolved) return;
		if (now - (state.lastQuoteAt ?? 0) > 15e3) {
			state.lastQuoteAt = now;
			await refreshQuotes(state);
		}
		if (now < state.lockAt) for (const p of match.players) {
			if (p.controller !== "bot") continue;
			if (state.picks[p.id]) continue;
			if (state.lockAt - now < 2e4 || Math.random() < .25) applyCoinPump(match, p, "pick", {
				type: "pick",
				coinId: botPick(state, p.id)
			});
		}
		if (now >= state.windowEndsAt) {
			await refreshQuotes(state);
			const { ranking, winnerCoinIds } = resolveCoinPump(state);
			const top = ranking[0];
			log(match, "system", `Window closed. Top tape: ${state.coins.find((c) => c.id === top?.id)?.ticker ?? "?"} ${top && top.changePct >= 0 ? "+" : ""}${top?.changePct.toFixed(3)}%.`);
			for (const c of state.coins) {
				const pct = c.changePct ?? 0;
				log(match, "system", `${c.ticker} ${pct >= 0 ? "+" : ""}${pct.toFixed(3)}%  ($${c.startUsd.toFixed(c.startUsd < 2 ? 4 : 2)} → $${(c.endUsd ?? c.liveUsd).toFixed(c.endUsd && c.endUsd < 2 ? 4 : 2)})`);
			}
			const winners = match.players.filter((p) => winnerCoinIds.includes(state.picks[p.id] ?? "")).map((p) => p.id);
			if (winners.length === 0) {
				log(match, "win", "Nobody picked the top tape. Pot stays in the treasury.");
				finishMatch(match, []);
			} else {
				log(match, "win", `${winners.map((id) => playerName(match, id)).join(", ")} called it.`);
				finishMatch(match, winners);
			}
		}
		return;
	}
	if (match.gameId === "rps") {
		const state = match.state;
		const round = state.rounds[state.roundIndex];
		if (!round || round.resolved) {
			if (round?.resolved && match.status === "playing") await forceSettle(match);
			return;
		}
		for (const p of match.players) {
			if (round.throws[p.id]) continue;
			const taped = state.tape?.[p.id]?.[state.roundIndex];
			if (taped) {
				applyRps(match, p, "throw", {
					type: "throw",
					gesture: taped
				}, p.walletId);
				continue;
			}
			if (p.controller !== "bot") continue;
			if (state.windowEndsAt - now < 19600) applyRps(match, p, "throw", {
				type: "throw",
				gesture: botGesture(state, p.id)
			}, p.walletId);
		}
		if (now >= state.windowEndsAt) resolveRpsRound(match);
		return;
	}
	if (match.gameId === "dilemma") {
		const state = match.state;
		const round = state.rounds[state.roundIndex];
		if (!round || round.resolved) {
			if (round?.resolved && match.status === "playing") await forceSettle(match);
			return;
		}
		for (const p of match.players) {
			if (round.sealed[p.id]) continue;
			const taped = state.tape?.[p.id]?.[state.roundIndex];
			if (taped) {
				applyDilemma(match, p, "choose", {
					type: "choose",
					move: taped
				});
				continue;
			}
			if (p.controller !== "bot") continue;
			if (state.windowEndsAt - now < 19300) applyDilemma(match, p, "choose", {
				type: "choose",
				move: botDilemmaMove(state, p.id, match.players)
			});
		}
		if (now >= state.windowEndsAt) resolveDilemmaRound(match);
		return;
	}
	if (match.gameId === "target") {
		const state = match.state;
		if (state.resolved) return;
		for (const p of match.players) {
			if (p.controller !== "bot") continue;
			if (state.locks[p.id] != null) continue;
			if (state.windowEndsAt - now < 24400) applyTarget(match, p, "lock", {
				type: "lock",
				value: botTargetLock(p.id)
			});
		}
		if (now >= state.windowEndsAt) resolveTarget(match);
		return;
	}
	if (match.gameId === "marketblitz") {
		const state = match.state;
		if (state.resolved) return;
		for (const p of match.players) {
			const pf = state.portfolios[p.id];
			if (!pf || pf.liquidated) continue;
			const tape = state.tapes?.[p.id];
			if (tape && tape.length > 0) {
				const nextPos = tape[state.currentTick % tape.length] ?? "flat";
				if (pf.position !== nextPos) applyMarketBlitzTrade(state, p.id, nextPos, pf.leverage, pf.sizePct);
				continue;
			}
			if (p.controller === "bot" || Boolean(state.pilots?.[p.id])) {
				const botAction = botMarketBlitzAction(state, p.id, p.name);
				if (pf.position !== botAction.position || pf.leverage !== botAction.leverage) applyMarketBlitzTrade(state, p.id, botAction.position, botAction.leverage, botAction.sizePct);
			}
		}
		if (now >= state.windowEndsAt) {
			const stepResult = stepMarketBlitz(state, now);
			match.turnDeadline = state.windowEndsAt;
			const currentP = state.activeCandles[state.activeCandles.length - 1]?.c ?? 100;
			const prevP = state.activeCandles[state.activeCandles.length - 2]?.c ?? currentP;
			const tickDiffPct = (currentP - prevP) / prevP * 100;
			log(match, "system", `Tick ${state.currentTick}/${state.totalTicks}: $${currentP.toFixed(2)} (${tickDiffPct >= 0 ? "+" : ""}${tickDiffPct.toFixed(2)}%)`);
			for (const liqId of stepResult.liquidatedIds) log(match, "move", `${match.players.find((pl) => pl.id === liqId)?.name ?? liqId} liquidated (margin call).`, liqId);
			if (stepResult.resolved) {
				log(match, "system", `Market closed. Event: ${state.sourceEventName ?? "Market Regime"}`);
				const ranked = Object.entries(state.portfolios).filter(([, pf]) => !pf.liquidated).sort(([, a], [, b]) => b.equityUsd - a.equityUsd);
				if (ranked.length === 0) {
					log(match, "win", "All traders liquidated. Pot transferred to treasury.");
					finishMatch(match, []);
				} else {
					const topEquity = ranked[0][1].equityUsd;
					const winners = ranked.filter(([, pf]) => pf.equityUsd === topEquity).map(([id]) => id);
					const names = winners.map((id) => playerName(match, id)).join(", ");
					const retPct = (topEquity - 1e4) / 1e4 * 100;
					log(match, "win", `${names} took #1 with $${topEquity.toFixed(0)} equity (${retPct >= 0 ? "+" : ""}${retPct.toFixed(1)}% return).`);
					finishMatch(match, winners);
				}
			}
		}
		return;
	}
	if (match.gameId === "orderbook") {
		const state = match.state;
		if (state.resolved) return;
		for (const p of match.players) if (p.controller === "bot") {
			if (Math.random() < .45) {
				const act = botOrderBookAction(state, p.id);
				const res = applyOrderBookAction(state, p.id, act, match.players);
				if (res.logText) log(match, "move", res.logText, p.id);
			}
		}
		if (now >= state.windowEndsAt || state.currentTick < state.totalTicks) {
			const done = stepOrderBook(state);
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Tick ${state.currentTick}/${state.totalTicks}: ${state.baseAsset} Mid $${state.midPrice.toFixed(2)} | Bids $${state.bids[0]?.price.toFixed(2)} · Asks $${state.asks[0]?.price.toFixed(2)}`);
			if (done) {
				log(match, "system", "Order Book Raider round closed. Final settlements executing.");
				const ranked = Object.entries(state.portfolios).sort(([, a], [, b]) => b.totalEquityUsd - a.totalEquityUsd);
				if (ranked.length === 0) finishMatch(match, []);
				else {
					const topEquity = ranked[0][1].totalEquityUsd;
					const winners = ranked.filter(([, pf]) => pf.totalEquityUsd === topEquity).map(([id]) => id);
					log(match, "win", `${winners.map((id) => playerName(match, id)).join(", ")} took #1 with $${topEquity.toFixed(2)} final trading equity.`);
					finishMatch(match, winners);
				}
			}
		}
		return;
	}
	if (match.gameId === "cascade") {
		const state = match.state;
		if (state.resolved) return;
		for (const p of match.players) if (p.controller === "bot") {
			if (Math.random() < .4) {
				const act = botCascadeAction(state, p.id);
				const res = applyCascadeAction(state, p.id, act, match.players);
				if (res.logText) log(match, "move", res.logText, p.id);
			}
		}
		if (now >= state.windowEndsAt || state.currentTick < state.totalTicks) {
			const stepResult = stepCascade(state);
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Tick ${state.currentTick}/${state.totalTicks}: ${state.assetSymbol} $${state.currentPrice.toFixed(2)} (${state.priceChangePct >= 0 ? "+" : ""}${state.priceChangePct.toFixed(2)}%)`);
			for (const liqId of stepResult.liquidatedIds) log(match, "move", `${match.players.find((pl) => pl.id === liqId)?.name ?? liqId} suffered margin liquidation!`, liqId);
			if (stepResult.resolved) {
				log(match, "system", "Liquidation Cascade completed. Final margin settlements verified.");
				const ranked = Object.entries(state.positions).filter(([, p]) => !p.isLiquidated).sort(([, a], [, b]) => b.totalEquityUsd - a.totalEquityUsd);
				if (ranked.length === 0) {
					log(match, "win", "All leveraged positions liquidated. Pot routed to liquidation pool.");
					finishMatch(match, []);
				} else {
					const topEquity = ranked[0][1].totalEquityUsd;
					const winners = ranked.filter(([, p]) => p.totalEquityUsd === topEquity).map(([id]) => id);
					log(match, "win", `${winners.map((id) => playerName(match, id)).join(", ")} claimed #1 with $${topEquity.toFixed(2)} final margin equity.`);
					finishMatch(match, winners);
				}
			}
		}
		return;
	}
	if (match.gameId === "flashloan") {
		const state = match.state;
		if (state.resolved) return;
		for (const p of match.players) if (p.controller === "bot") {
			if (Math.random() < .5) {
				const act = botFlashLoanAction(state, p.id);
				const res = applyFlashLoanAction(state, p.id, act, match.players);
				if (res.logText) log(match, "move", res.logText, p.id);
			}
		}
		if (now >= state.windowEndsAt || state.currentTick < state.totalTicks) {
			const done = stepFlashLoan(state);
			match.turnDeadline = state.windowEndsAt;
			log(match, "system", `Block #${state.blockNumber} (Tick ${state.currentTick}/${state.totalTicks}) | Base Gas ${state.gasPriceGwei} Gwei | Opportunity $${state.activeOpportunities[0]?.availableProfitUsd.toFixed(2) ?? "1200.00"} (${state.activeOpportunities[0]?.dexPair ?? "Cross-DEX"})`);
			if (done) {
				log(match, "system", "MEV Flash Sniper session ended. Final blocks sealed.");
				const ranked = Object.entries(state.raiders).sort(([, a], [, b]) => b.totalProfitUsd - a.totalProfitUsd);
				if (ranked.length === 0) finishMatch(match, []);
				else {
					const topProfit = ranked[0][1].totalProfitUsd;
					const winners = ranked.filter(([, r]) => r.totalProfitUsd === topProfit).map(([id]) => id);
					log(match, "win", `${winners.map((id) => playerName(match, id)).join(", ")} won MEV block wars with $${topProfit.toFixed(2)} extracted profit.`);
					finishMatch(match, winners);
				}
			}
		}
		return;
	}
}
async function recentTape(limit = 12) {
	await ready();
	const out = [];
	for (const m of getWorld().matches.values()) for (const l of m.logs.slice(-6)) out.push({
		matchId: m.id,
		gameId: m.gameId,
		line: l.text,
		ts: l.ts
	});
	return out.sort((a, b) => b.ts - a.ts).slice(0, limit);
}
//#endregion
export { CATALOG as C, listAllAgentReputations as S, submitAction as _, createWallet as a, toPublic as b, getWallet as c, listCatalog as d, listChallenges as f, store_server_exports as g, startChallenge as h, createMatch as i, healthSnapshot as l, listWallets as m, addBots as n, getHouseBots as o, listMatches as p, createChallenge as r, getMatch as s, EngineError as t, joinMatch as u, tickFloor as v, currentDebateSeat as w, getAgentReputationById as x, toChallenge as y };
