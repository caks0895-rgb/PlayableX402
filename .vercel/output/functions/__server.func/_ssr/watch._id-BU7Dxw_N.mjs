import { o as __toESM } from "../_runtime.mjs";
import { c as lobbyIdleSince } from "./types-B4Cm2iRZ.mjs";
import { C as initials, S as formatUsdc, b as cn, x as formatClock } from "./pay.server-DcxlzbMU.mjs";
import { w as currentDebateSeat } from "./store.server-Br6AbScb.mjs";
import { B as require_react, _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { c as getMatchFn, n as Route$2, s as Button } from "./router-5T9u12T6.mjs";
import { t as SiteHeader } from "./site-header-D1m6SmAL.mjs";
import { t as Badge } from "./badge-CZNEapzI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch._id-BU7Dxw_N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$10 = "/app/applet/src/components/player-chip.tsx";
var TINT = {
	p1: "bg-p1 text-accent-fg",
	p2: "bg-p2 text-accent-fg",
	p3: "bg-p3 text-accent-fg",
	p4: "bg-p4 text-accent-fg",
	p5: "bg-p5 text-fg",
	p6: "bg-p6 text-fg"
};
function Token({ tint = "p1", name, symbol, size = "md" }) {
	const displayName = name ?? symbol ?? "Agent";
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		className: cn("inline-flex items-center justify-center rounded-full font-medium", TINT[tint] ?? TINT.p1, size === "sm" ? "size-5 text-[9px]" : "size-7 text-[11px]"),
		title: displayName,
		children: initials(displayName)
	}, void 0, false, {
		fileName: _jsxFileName$10,
		lineNumber: 26,
		columnNumber: 5
	}, this);
}
function PlayerChip({ player, active, extra }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: cn("flex items-center gap-2.5 rounded-[12px] border px-3 py-2", active ? "border-accent/40 bg-raised" : "border-border bg-surface"),
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
			tint: player.tint,
			name: player.name
		}, void 0, false, {
			fileName: _jsxFileName$10,
			lineNumber: 55,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "truncate text-sm font-medium",
					children: player.name
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 58,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "inline-block size-1.5 rounded-full bg-emerald-400",
					title: "Active"
				}, void 0, false, {
					fileName: _jsxFileName$10,
					lineNumber: 59,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$10,
				lineNumber: 57,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "truncate text-[11px] text-muted",
				children: extra || "Autonomous Agent"
			}, void 0, false, {
				fileName: _jsxFileName$10,
				lineNumber: 61,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$10,
			lineNumber: 56,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$10,
		lineNumber: 49,
		columnNumber: 5
	}, this);
}
var _jsxFileName$9 = "/app/applet/src/components/games/cascade-board.tsx";
function CascadeBoard({ state, players }) {
	const { currentTick = 0, totalTicks = 25, assetSymbol = "ETH-PERP", currentPrice = 3200, priceChangePct = 0, priceHistory = [], positions = {}, resolved = false } = state;
	const initialPrice = priceHistory[0] ?? currentPrice;
	const minPrice = (0, import_react.useMemo)(() => Math.min(...priceHistory, currentPrice * .95), [priceHistory, currentPrice]);
	const maxPrice = (0, import_react.useMemo)(() => Math.max(...priceHistory, currentPrice * 1.05), [priceHistory, currentPrice]);
	const positionList = (0, import_react.useMemo)(() => {
		if (Array.isArray(positions)) return positions;
		return Object.entries(positions || {}).map(([playerId, pos]) => ({
			playerId,
			...pos
		}));
	}, [positions]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		id: "cascade-arena",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-base border border-amber-500/20",
						children: "15x"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 43,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-semibold text-foreground tracking-tight",
							children: assetSymbol
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 48,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "outline",
							className: "text-[11px] uppercase tracking-wider font-mono bg-muted/40",
							children: "High-Leverage Squeeze"
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 51,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 47,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 text-xs text-muted-foreground mt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Index: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-foreground font-mono",
								children: ["$", currentPrice.toFixed(2)]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 56,
								columnNumber: 28
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 56,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 57,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: cn("font-mono font-medium", priceChangePct >= 0 ? "text-emerald-400" : "text-rose-400"),
								children: [
									priceChangePct >= 0 ? "+" : "",
									priceChangePct.toFixed(2),
									"%"
								]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 58,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 61,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Initial: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-muted-foreground font-mono",
								children: ["$", initialPrice.toFixed(2)]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 62,
								columnNumber: 30
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 62,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 55,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 46,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 42,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Tick Clock"
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 69,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-mono text-sm font-bold text-foreground",
								children: [
									currentTick,
									" / ",
									totalTicks
								]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 70,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$9,
							lineNumber: 68,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-8 w-px bg-border/60 mx-1" }, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 74,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: resolved ? "secondary" : "default",
							className: cn("font-mono text-xs px-2.5 py-1", !resolved && "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"),
							children: resolved ? "SETTLED" : "MARGIN ARENA LIVE"
						}, void 0, false, {
							fileName: _jsxFileName$9,
							lineNumber: 75,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 67,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 41,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-lg border border-border/70 bg-card/40 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono uppercase tracking-wider",
						children: "Perp Index Trajectory"
					}, void 0, false, {
						fileName: _jsxFileName$9,
						lineNumber: 90,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono text-[11px]",
						children: [
							"Range: $",
							minPrice.toFixed(1),
							" – $",
							maxPrice.toFixed(1)
						]
					}, void 0, true, {
						fileName: _jsxFileName$9,
						lineNumber: 91,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$9,
					lineNumber: 89,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "h-16 w-full flex items-end gap-1 pt-2",
					children: priceHistory.map((p, i) => {
						const h = Math.max(10, Math.min(100, (p - minPrice) / (maxPrice - minPrice || 1) * 100));
						const isLatest = i === priceHistory.length - 1;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex-1 flex flex-col justify-end items-center group relative",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								style: { height: `${h}%` },
								className: cn("w-full rounded-t-sm transition-all duration-300", isLatest ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : p >= initialPrice ? "bg-emerald-500/60" : "bg-rose-500/60")
							}, void 0, false, {
								fileName: _jsxFileName$9,
								lineNumber: 102,
								columnNumber: 17
							}, this)
						}, i, false, {
							fileName: _jsxFileName$9,
							lineNumber: 98,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$9,
					lineNumber: 93,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$9,
				lineNumber: 88,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-3",
				children: positionList.map((pos) => {
					const player = players.find((p) => p.id === pos.playerId);
					const pName = player?.name ?? pos.playerId;
					const collateral = pos.collateralUsd || 1e4;
					const equity = pos.totalEquityUsd ?? (pos.isLiquidated ? 0 : collateral + (pos.unrealizedPnlUsd || 0));
					const healthRatio = pos.isLiquidated ? 0 : Math.max(0, +(equity / (collateral * .1 || 1)).toFixed(2));
					const isDanger = healthRatio < 1.35 && !pos.isLiquidated;
					const isLiq = Boolean(pos.isLiquidated);
					const liqPrice = pos.liquidationPrice ?? 0;
					const bounties = Math.floor((pos.bountiesCollectedUsd ?? 0) / 200);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: cn("rounded-lg border p-3.5 transition-all bg-card/50", isLiq ? "border-rose-900/50 bg-rose-950/20 opacity-60" : isDanger ? "border-amber-500/60 bg-amber-950/15 ring-1 ring-amber-500/30" : "border-border/70"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between gap-2 mb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
										tint: player?.tint,
										name: pName,
										size: "sm"
									}, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 146,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-semibold text-sm text-foreground flex items-center gap-1.5",
										children: [pName, player?.controller === "bot" && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] text-muted-foreground font-mono font-normal",
											children: "(BOT)"
										}, void 0, false, {
											fileName: _jsxFileName$9,
											lineNumber: 151,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$9,
										lineNumber: 148,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[11px] text-muted-foreground font-mono",
										children: ["Liq Price: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-rose-400 font-semibold",
											children: ["$", liqPrice.toFixed(2)]
										}, void 0, true, {
											fileName: _jsxFileName$9,
											lineNumber: 155,
											columnNumber: 34
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$9,
										lineNumber: 154,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$9,
										lineNumber: 147,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 145,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: isLiq ? "destructive" : pos.side === "long" ? "default" : pos.side === "short" ? "secondary" : "outline",
										className: cn("font-mono text-[10px] uppercase tracking-wider", pos.side === "long" && !isLiq && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", pos.side === "short" && !isLiq && "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"),
										children: isLiq ? "LIQUIDATED" : `${pos.leverage ?? 15}x ${pos.side ?? "flat"}`
									}, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 161,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-xs font-mono font-bold mt-1 text-foreground",
										children: ["$", equity.toFixed(2)]
									}, void 0, true, {
										fileName: _jsxFileName$9,
										lineNumber: 171,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 160,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 144,
								columnNumber: 15
							}, this),
							!isLiq && /* @__PURE__ */ (void 0)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center justify-between text-[11px] font-mono text-muted-foreground",
									children: [/* @__PURE__ */ (void 0)("span", { children: "Margin Health" }, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 181,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: cn("font-semibold", healthRatio < 1.2 ? "text-rose-400 animate-pulse" : healthRatio < 1.5 ? "text-amber-400" : "text-emerald-400"),
										children: [healthRatio.toFixed(2), "x"]
									}, void 0, true, {
										fileName: _jsxFileName$9,
										lineNumber: 182,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 180,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "h-1.5 w-full overflow-hidden rounded-full bg-muted/60",
									children: /* @__PURE__ */ (void 0)("div", {
										className: cn("h-full rounded-full transition-all duration-300", healthRatio < 1.2 ? "bg-rose-500" : healthRatio < 1.5 ? "bg-amber-500" : "bg-emerald-500"),
										style: { width: `${Math.min(100, Math.max(0, healthRatio / 2.5 * 100))}%` }
									}, void 0, false, {
										fileName: _jsxFileName$9,
										lineNumber: 190,
										columnNumber: 21
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 189,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 179,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-3 pt-2 border-t border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Unrealized PnL: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: cn((pos.unrealizedPnlUsd ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"),
									children: [
										(pos.unrealizedPnlUsd ?? 0) >= 0 ? "+" : "",
										"$",
										(pos.unrealizedPnlUsd ?? 0).toFixed(2)
									]
								}, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 203,
									columnNumber: 39
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 203,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Bounties: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
									className: "text-amber-400",
									children: bounties
								}, void 0, false, {
									fileName: _jsxFileName$9,
									lineNumber: 206,
									columnNumber: 33
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$9,
									lineNumber: 206,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$9,
								lineNumber: 202,
								columnNumber: 15
							}, this)
						]
					}, pos.playerId, true, {
						fileName: _jsxFileName$9,
						lineNumber: 133,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$9,
				lineNumber: 120,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$9,
		lineNumber: 39,
		columnNumber: 5
	}, this);
}
var _jsxFileName$8 = "/app/applet/src/components/games/coin-board.tsx";
function CoinBoard({ state, players }) {
	const picks = state.picks ?? {};
	const picksByCoin = {};
	for (const p of players) {
		const coin = picks[p.id];
		if (!coin) continue;
		(picksByCoin[coin] ??= []).push(p);
	}
	const sealed = !state.picks;
	const lockedCount = players.filter((p) => Boolean(state.committed?.[p.id])).length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-xs text-muted",
			children: [
				"Source ",
				state.source === "coingecko" ? "CoinGecko" : "simulated",
				" · 10-minute window · picks lock at 90s",
				sealed ? ` · ${lockedCount}/${players.length} sealed` : "",
				"."
			]
		}, void 0, true, {
			fileName: _jsxFileName$8,
			lineNumber: 19,
			columnNumber: 7
		}, this), state.coins.map((c) => {
			const pct = c.changePct ?? (c.startUsd === 0 ? 0 : (c.liveUsd - c.startUsd) / c.startUsd * 100);
			const up = pct >= 0;
			return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-center gap-4 rounded-[16px] border border-border bg-surface px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "w-16 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-medium tracking-wide",
							children: c.ticker
						}, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 34,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-muted",
							children: c.name
						}, void 0, false, {
							fileName: _jsxFileName$8,
							lineNumber: 35,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 33,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-mono text-sm tabular-nums",
							children: ["$", c.liveUsd.toFixed(c.liveUsd < 2 ? 4 : 2)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 38,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-faint",
							children: ["open $", c.startUsd.toFixed(c.startUsd < 2 ? 4 : 2)]
						}, void 0, true, {
							fileName: _jsxFileName$8,
							lineNumber: 41,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 37,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: cn("w-20 text-right font-mono text-sm tabular-nums", up ? "text-live" : "text-danger"),
						children: [
							up ? "+" : "",
							pct.toFixed(3),
							"%"
						]
					}, void 0, true, {
						fileName: _jsxFileName$8,
						lineNumber: 45,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex min-w-16 justify-end -space-x-1",
						children: (picksByCoin[c.id] ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
							tint: p.tint,
							name: p.name,
							size: "sm"
						}, p.id, false, {
							fileName: _jsxFileName$8,
							lineNumber: 56,
							columnNumber: 17
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$8,
						lineNumber: 54,
						columnNumber: 13
					}, this)
				]
			}, c.id, true, {
				fileName: _jsxFileName$8,
				lineNumber: 29,
				columnNumber: 11
			}, this);
		})]
	}, void 0, true, {
		fileName: _jsxFileName$8,
		lineNumber: 18,
		columnNumber: 5
	}, this);
}
var _jsxFileName$7 = "/app/applet/src/components/games/debate-stage.tsx";
function DebateStage({ state, players }) {
	const seat = currentDebateSeat(state);
	const byId = Object.fromEntries(players.map((p) => [p.id, p]));
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-[20px] border border-border bg-surface px-5 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs uppercase tracking-[0.14em] text-muted",
					children: "Motion"
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 14,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 font-display text-xl font-medium leading-snug text-pretty sm:text-2xl",
					children: state.topic
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 15,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 13,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: players.map((p, i) => {
					const speeches = state.speeches.filter((s) => s.playerId === p.id);
					const score = state.scores?.[p.id];
					const talking = seat?.playerId === p.id;
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
						className: cn("flex flex-col gap-3 rounded-[16px] border bg-raised p-4", talking ? "border-accent/40" : "border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
									tint: p.tint,
									name: p.name
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 34,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm font-medium",
									children: p.name
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 36,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-[11px] text-muted",
									children: i === 0 ? "Table left" : "Table right"
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 37,
									columnNumber: 21
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$7,
									lineNumber: 35,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$7,
								lineNumber: 33,
								columnNumber: 17
							}, this), score && /* @__PURE__ */ (void 0)("span", {
								className: "font-mono text-lg tabular-nums",
								children: score.total
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 41,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 32,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-2",
							children: [speeches.length === 0 && /* @__PURE__ */ (void 0)("p", {
								className: "text-sm text-muted",
								children: talking ? "On the floor." : "Waiting."
							}, void 0, false, {
								fileName: _jsxFileName$7,
								lineNumber: 46,
								columnNumber: 19
							}, this), speeches.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm leading-relaxed text-pretty",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "mr-2 text-[11px] uppercase tracking-wide text-faint",
									children: s.round
								}, void 0, false, {
									fileName: _jsxFileName$7,
									lineNumber: 50,
									columnNumber: 21
								}, this), s.text]
							}, s.round, true, {
								fileName: _jsxFileName$7,
								lineNumber: 49,
								columnNumber: 19
							}, this))]
						}, void 0, true, {
							fileName: _jsxFileName$7,
							lineNumber: 44,
							columnNumber: 15
						}, this)]
					}, p.id, true, {
						fileName: _jsxFileName$7,
						lineNumber: 25,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 19,
				columnNumber: 7
			}, this),
			state.verdict && /* @__PURE__ */ (void 0)("p", {
				className: "rounded-[16px] border border-live/30 bg-live/10 px-4 py-3 text-sm text-live",
				children: state.verdict
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 60,
				columnNumber: 9
			}, this),
			state.panel && /* @__PURE__ */ (void 0)("div", {
				className: "rounded-[16px] border border-border bg-surface px-4 py-3",
				children: [/* @__PURE__ */ (void 0)("p", {
					className: "text-xs uppercase tracking-[0.14em] text-faint",
					children: "Panel · logic 40 · relevance 40 · rhetoric 20"
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 66,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("ul", {
					className: "mt-2 flex flex-col gap-1 font-mono text-xs text-muted",
					children: state.panel.judges.map((j) => /* @__PURE__ */ (void 0)("li", { children: [
						j.name,
						":",
						" ",
						players.map((p) => {
							const s = j.scores[p.id];
							return s ? `${p.name} ${s.total}` : null;
						}).filter(Boolean).join(" · ")
					] }, j.name, true, {
						fileName: _jsxFileName$7,
						lineNumber: 69,
						columnNumber: 15
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$7,
					lineNumber: 67,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 65,
				columnNumber: 9
			}, this),
			state.judging && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm text-warn",
				children: "Judge is scoring the floor."
			}, void 0, false, {
				fileName: _jsxFileName$7,
				lineNumber: 83,
				columnNumber: 25
			}, this),
			seat && byId[seat.playerId] && !state.judging && /* @__PURE__ */ (void 0)("p", {
				className: "text-sm text-muted",
				children: [
					byId[seat.playerId].name,
					" · ",
					seat.kind
				]
			}, void 0, true, {
				fileName: _jsxFileName$7,
				lineNumber: 85,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$7,
		lineNumber: 12,
		columnNumber: 5
	}, this);
}
var _jsxFileName$6 = "/app/applet/src/components/games/dilemma-arena.tsx";
function Envelope({ committed, revealed, move }) {
	if (revealed && move) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
			viewBox: "0 0 48 36",
			className: "size-12 text-fg",
			"aria-hidden": true,
			children: move === "cooperate" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
					d: "M10 22c4-8 8-10 14-10s10 2 14 10",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.8",
					strokeLinecap: "round"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 22,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
					cx: "18",
					cy: "16",
					r: "2",
					fill: "currentColor"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 29,
					columnNumber: 15
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("circle", {
					cx: "30",
					cy: "16",
					r: "2",
					fill: "currentColor"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 30,
					columnNumber: 15
				}, this)
			] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 21,
				columnNumber: 13
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M16 12 L32 28",
				stroke: "currentColor",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 34,
				columnNumber: 15
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M32 12 L16 28",
				stroke: "currentColor",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 35,
				columnNumber: 15
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 33,
				columnNumber: 13
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 19,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: move
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 39,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 18,
		columnNumber: 7
	}, this);
	if (committed) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
			viewBox: "0 0 48 36",
			className: "size-12 text-muted",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
				x: "6",
				y: "10",
				width: "36",
				height: "20",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 47,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("path", {
				d: "M6 12 L24 22 L42 12",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 48,
				columnNumber: 11
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName$6,
			lineNumber: 46,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-xs uppercase tracking-wide text-muted",
			children: "sealed"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 50,
			columnNumber: 9
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 45,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
			viewBox: "0 0 48 36",
			className: "size-12 text-faint",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
				x: "6",
				y: "10",
				width: "36",
				height: "20",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeDasharray: "3 3"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 57,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 56,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
			className: "text-xs uppercase tracking-wide text-faint",
			children: "waiting"
		}, void 0, false, {
			fileName: _jsxFileName$6,
			lineNumber: 59,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 55,
		columnNumber: 5
	}, this);
}
function DilemmaArena({ state, players }) {
	const last = state.history[state.history.length - 1];
	const roundNo = Math.min(state.roundIndex + 1, 5);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-sm text-muted",
					children: [
						"Round ",
						roundNo,
						" of ",
						5
					]
				}, void 0, true, {
					fileName: _jsxFileName$6,
					lineNumber: 70,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-mono text-xs text-faint",
					children: "Envelopes closed until both lock"
				}, void 0, false, {
					fileName: _jsxFileName$6,
					lineNumber: 73,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$6,
				lineNumber: 69,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-2 gap-3",
				children: players.map((p) => {
					const committed = Boolean(state.committed[p.id]);
					const revealedMove = last?.moves[p.id];
					const showReveal = Boolean(state.revealing && revealedMove);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: cn("flex flex-col items-center gap-2 rounded-[16px] border border-border bg-surface px-3 py-5"),
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
								tint: p.tint,
								name: p.name
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 88,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-sm font-medium",
								children: p.name
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 89,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Envelope, {
								committed,
								revealed: showReveal,
								move: revealedMove
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 90,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-mono text-lg tabular-nums",
								children: state.scores[p.id] ?? 0
							}, void 0, false, {
								fileName: _jsxFileName$6,
								lineNumber: 91,
								columnNumber: 15
							}, this)
						]
					}, p.id, true, {
						fileName: _jsxFileName$6,
						lineNumber: 82,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 76,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-center text-xs text-muted",
				children: "C/C +3 · D/D +1 · D vs C +5 / 0"
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 97,
				columnNumber: 7
			}, this),
			state.history.length > 0 && /* @__PURE__ */ (void 0)("div", {
				className: "flex flex-col gap-1.5",
				children: state.history.map((h) => /* @__PURE__ */ (void 0)("p", {
					className: "font-mono text-xs text-muted",
					children: [
						"R",
						h.index + 1,
						players.map((p) => {
							const m = h.moves[p.id];
							return /* @__PURE__ */ (void 0)("span", {
								className: "ml-3",
								children: [
									p.name,
									" ",
									m === "cooperate" ? "C" : m === "defect" ? "D" : "—",
									" +",
									h.scores[p.id] ?? 0
								]
							}, p.id, true, {
								fileName: _jsxFileName$6,
								lineNumber: 109,
								columnNumber: 19
							}, this);
						})
					]
				}, h.index, true, {
					fileName: _jsxFileName$6,
					lineNumber: 104,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$6,
				lineNumber: 102,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$6,
		lineNumber: 68,
		columnNumber: 5
	}, this);
}
var _jsxFileName$5 = "/app/applet/src/components/games/flashloan-board.tsx";
function FlashLoanBoard({ state, players }) {
	const { currentTick = 0, totalTicks = 20, blockNumber = 19482e3, gasPriceGwei = 45, activeOpportunities = [], blockHistory = [], leaderboard = [], resolved = false } = state;
	const currentRound = state.currentRound ?? currentTick;
	const totalRounds = state.totalRounds ?? totalTicks;
	const poolList = (0, import_react.useMemo)(() => {
		if (activeOpportunities && activeOpportunities.length > 0) return activeOpportunities.map((opp) => {
			const rawPair = opp.dexPair || "";
			const parts = rawPair.includes("↔") ? rawPair.split("↔").map((s) => s.trim()) : rawPair.includes("-") ? rawPair.split("-").map((s) => s.trim()) : ["Uniswap V3", "Curve"];
			const dexA = parts[0] || "Uniswap V3";
			const dexB = parts[1] || "Curve";
			return {
				id: opp.id,
				pair: opp.dexPair || "ETH / USDC",
				dexA,
				dexB,
				priceSpreadBps: opp.spreadBps ?? 45,
				estProfitUsd: opp.availableProfitUsd ?? 1500,
				requiredLoanUsd: opp.minLoanSizeUsd ?? 25e4
			};
		});
		return [
			{
				id: "univ3-crv-eth",
				pair: "ETH / USDC",
				dexA: "Uniswap V3",
				dexB: "Curve",
				priceSpreadBps: 42,
				estProfitUsd: 1450,
				requiredLoanUsd: 25e4
			},
			{
				id: "sushi-bal-wbtc",
				pair: "WBTC / USDT",
				dexA: "Sushiswap",
				dexB: "Balancer",
				priceSpreadBps: 38,
				estProfitUsd: 2180,
				requiredLoanUsd: 5e5
			},
			{
				id: "pancake-univ3-arb",
				pair: "ARB / ETH",
				dexA: "PancakeSwap",
				dexB: "Uniswap V3",
				priceSpreadBps: 55,
				estProfitUsd: 890,
				requiredLoanUsd: 1e5
			}
		];
	}, [activeOpportunities]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		id: "flashloan-arena",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 font-mono font-bold text-base border border-purple-500/20",
						children: "MEV"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 89,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-semibold text-foreground tracking-tight",
							children: ["Block #", blockNumber]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 94,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "outline",
							className: "text-[11px] uppercase tracking-wider font-mono bg-muted/40",
							children: "Flash Loan Arb"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 97,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 93,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 text-xs text-muted-foreground mt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Base Gas: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-purple-400 font-mono",
								children: [gasPriceGwei, " Gwei"]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 102,
								columnNumber: 31
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 102,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 103,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Active Pools: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-foreground font-mono",
								children: poolList.length
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 104,
								columnNumber: 35
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 104,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 105,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Landed Bundles: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-amber-400 font-mono",
								children: blockHistory.length
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 106,
								columnNumber: 37
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 106,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 101,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$5,
						lineNumber: 92,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 88,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Block Round"
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 113,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-mono text-sm font-bold text-foreground",
								children: [
									currentRound,
									" / ",
									totalRounds
								]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 114,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 112,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-8 w-px bg-border/60 mx-1" }, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 118,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: resolved ? "secondary" : "default",
							className: cn("font-mono text-xs px-2.5 py-1", !resolved && "bg-purple-500/15 text-purple-400 border border-purple-500/30 animate-pulse"),
							children: resolved ? "BLOCKS SEALED" : "MEV MEMPOOL LIVE"
						}, void 0, false, {
							fileName: _jsxFileName$5,
							lineNumber: 119,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 111,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 87,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "font-mono uppercase tracking-wider",
						children: "Cross-DEX Arbitrage Pools"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 134,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-[11px]",
						children: "Deploy $100k-$500k Flash Loans"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 135,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$5,
					lineNumber: 133,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-2.5",
					children: poolList.map((pool) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/70 bg-card/40 p-3 hover:border-purple-500/40 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-1 mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "font-semibold text-sm text-foreground",
								children: pool.pair
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 144,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: "text-[10px] font-mono text-purple-400 bg-purple-950/20 border-purple-800/40",
								children: [
									pool.dexA,
									" ↔ ",
									pool.dexB
								]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 145,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 143,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-xs text-muted-foreground font-mono space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Price Spread:" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 151,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-emerald-400 font-semibold",
									children: [pool.priceSpreadBps, " bps"]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 152,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 150,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Est. Extracted Profit:" }, void 0, false, {
									fileName: _jsxFileName$5,
									lineNumber: 155,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-foreground font-bold",
									children: ["$", (pool.estProfitUsd ?? 0).toFixed(2)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 156,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 154,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$5,
							lineNumber: 149,
							columnNumber: 15
						}, this)]
					}, pool.id, true, {
						fileName: _jsxFileName$5,
						lineNumber: 139,
						columnNumber: 13
					}, this))
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 137,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 132,
				columnNumber: 7
			}, this),
			blockHistory.length > 0 && /* @__PURE__ */ (void 0)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (void 0)("div", {
					className: "flex items-center justify-between text-xs text-muted-foreground",
					children: /* @__PURE__ */ (void 0)("span", {
						className: "font-mono uppercase tracking-wider",
						children: "Recent Block Landings & MEV Extraction"
					}, void 0, false, {
						fileName: _jsxFileName$5,
						lineNumber: 168,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 167,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-2",
					children: blockHistory.slice(0, 4).map((tx, idx) => {
						const p = players.find((pl) => pl.id === tx.winnerId);
						return /* @__PURE__ */ (void 0)("div", {
							className: "flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-muted/20 text-xs font-mono",
							children: [/* @__PURE__ */ (void 0)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-muted-foreground",
										children: ["Block #", tx.block]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 179,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)(Badge, {
										variant: "outline",
										className: "text-[10px] text-foreground",
										children: tx.route
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 180,
										columnNumber: 21
									}, this),
									/* @__PURE__ */ (void 0)("span", {
										className: "text-emerald-400 font-medium",
										children: p?.name ?? tx.winnerId
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 183,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 178,
								columnNumber: 19
							}, this), /* @__PURE__ */ (void 0)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (void 0)("div", {
									className: "text-emerald-400 font-bold",
									children: ["+$", (tx.profitUsd ?? 0).toFixed(2)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 186,
									columnNumber: 21
								}, this), /* @__PURE__ */ (void 0)("div", {
									className: "text-[10px] text-muted-foreground",
									children: ["Gas: $", tx.gasPaidUsd ?? 0]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 187,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 185,
								columnNumber: 19
							}, this)]
						}, idx, true, {
							fileName: _jsxFileName$5,
							lineNumber: 174,
							columnNumber: 17
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 170,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 166,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-lg border border-border/70 bg-card/40 p-3 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "text-xs font-mono uppercase tracking-wider text-muted-foreground",
					children: "MEV Arbitrage Extractors"
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 198,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5",
					children: leaderboard.map((r, rank) => {
						const player = players.find((p) => p.id === r.playerId);
						const pName = player?.name ?? r.playerId;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between p-2.5 rounded-md border border-border/60 bg-card/70",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs font-mono font-bold text-muted-foreground w-4",
										children: ["#", rank + 1]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 211,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
										tint: player?.tint,
										name: pName,
										size: "sm"
									}, void 0, false, {
										fileName: _jsxFileName$5,
										lineNumber: 212,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "font-semibold text-xs text-foreground flex items-center gap-1",
										children: [pName, player?.controller === "bot" && /* @__PURE__ */ (void 0)("span", {
											className: "text-[9px] text-muted-foreground font-mono",
											children: "(BOT)"
										}, void 0, false, {
											fileName: _jsxFileName$5,
											lineNumber: 217,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 214,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: [r.bundlesLanded ?? 0, " bundles landed"]
									}, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 220,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$5,
										lineNumber: 213,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$5,
								lineNumber: 210,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-xs font-bold text-emerald-400",
									children: ["+$", (r.totalProfitUsd ?? 0).toFixed(2)]
								}, void 0, true, {
									fileName: _jsxFileName$5,
									lineNumber: 226,
									columnNumber: 19
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName$5,
								lineNumber: 225,
								columnNumber: 17
							}, this)]
						}, r.playerId, true, {
							fileName: _jsxFileName$5,
							lineNumber: 206,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$5,
					lineNumber: 201,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$5,
				lineNumber: 197,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$5,
		lineNumber: 85,
		columnNumber: 5
	}, this);
}
var _jsxFileName$4 = "/app/applet/src/components/games/market-blitz-board.tsx";
function MarketBlitzBoard({ state, players }) {
	const { currentTick, totalTicks, assetSymbol, regimeHint, currentPrice, priceChangePct, warmupCandles = [], liveCandles = [], portfolios = {}, resolved, sourceEventName, leaderboard = [] } = state;
	const allVisibleCandles = (0, import_react.useMemo)(() => {
		return [...warmupCandles, ...liveCandles];
	}, [warmupCandles, liveCandles]);
	const chartMetrics = (0, import_react.useMemo)(() => {
		if (allVisibleCandles.length === 0) return {
			minP: 90,
			maxP: 110,
			maxV: 1e3
		};
		let minP = Infinity;
		let maxP = -Infinity;
		let maxV = 0;
		for (const c of allVisibleCandles) {
			if (c.l < minP) minP = c.l;
			if (c.h > maxP) maxP = c.h;
			if (c.v > maxV) maxV = c.v;
		}
		const pad = Math.max(.5, (maxP - minP) * .08);
		return {
			minP: minP - pad,
			maxP: maxP + pad,
			maxV: Math.max(100, maxV)
		};
	}, [allVisibleCandles]);
	const width = 640;
	const height = 220;
	const priceAreaHeight = 160;
	const volumeAreaHeight = 45;
	const candleWidth = Math.max(4, Math.min(12, 600 / Math.max(30, allVisibleCandles.length)));
	const gap = 600 / Math.max(1, allVisibleCandles.length);
	const getY = (price) => {
		const range = chartMetrics.maxP - chartMetrics.minP || 1;
		const ratio = (price - chartMetrics.minP) / range;
		return priceAreaHeight - ratio * priceAreaHeight;
	};
	const getVolY = (vol) => {
		const ratio = vol / (chartMetrics.maxV || 1);
		return height - ratio * volumeAreaHeight;
	};
	const isUp = priceChangePct >= 0;
	const playerMap = (0, import_react.useMemo)(() => {
		return new Map(players.map((p) => [p.id, p]));
	}, [players]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-border bg-surface px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-3 w-3 animate-pulse rounded-full bg-pool" }, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 83,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono text-base font-bold tracking-wider text-fg",
							children: assetSymbol || "SYNTH-ALPHA"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 86,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "outline",
							className: "text-[10px] tracking-wider uppercase opacity-80",
							children: regimeHint?.replace(/_/g, " ") || "MARKET BLITZ"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 89,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 85,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-[11px] text-muted",
						children: "Historical Seed Simulation (Normalized Base 100)"
					}, void 0, false, {
						fileName: _jsxFileName$4,
						lineNumber: 93,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 84,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 82,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-mono text-xl font-bold tabular-nums text-fg",
							children: ["$", currentPrice.toFixed(2)]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 99,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: cn("font-mono text-xs font-medium tabular-nums", isUp ? "text-live" : "text-danger"),
							children: [
								isUp ? "+" : "",
								priceChangePct.toFixed(2),
								"%"
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 102,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 98,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col items-end",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[10px] font-medium uppercase tracking-wider text-muted",
							children: [
								"Tick ",
								currentTick,
								" / ",
								totalTicks
							]
						}, void 0, true, {
							fileName: _jsxFileName$4,
							lineNumber: 114,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-1 h-2 w-24 overflow-hidden rounded-full bg-bg",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "h-full bg-pool transition-all duration-300",
								style: { width: `${Math.min(100, currentTick / totalTicks * 100)}%` }
							}, void 0, false, {
								fileName: _jsxFileName$4,
								lineNumber: 118,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 117,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 113,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 97,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 81,
				columnNumber: 7
			}, this),
			resolved && sourceEventName && /* @__PURE__ */ (void 0)("div", {
				className: "flex items-center gap-3 rounded-[14px] border border-pool/30 bg-pool/10 px-4 py-3 text-sm text-fg",
				children: [/* @__PURE__ */ (void 0)("span", {
					className: "text-lg",
					children: "🏛️"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 130,
					columnNumber: 11
				}, this), /* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("p", {
					className: "font-semibold text-pool",
					children: "Historical Event Revealed"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 132,
					columnNumber: 13
				}, this), /* @__PURE__ */ (void 0)("p", {
					className: "text-xs text-muted",
					children: sourceEventName
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 133,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 131,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 129,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "relative overflow-hidden rounded-[16px] border border-border bg-bg p-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "absolute right-3 top-3 z-10 flex gap-2 text-[10px] font-mono text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-block h-2 w-2 rounded-sm bg-muted/40" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 142,
							columnNumber: 13
						}, this), " Warmup (t < 0)"]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 141,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-block h-2 w-2 rounded-sm bg-live" }, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 145,
							columnNumber: 13
						}, this), " Live Ticks"]
					}, void 0, true, {
						fileName: _jsxFileName$4,
						lineNumber: 144,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 140,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("svg", {
					viewBox: `0 0 ${width} ${height}`,
					className: "h-56 w-full touch-none select-none overflow-visible",
					children: [
						[
							.25,
							.5,
							.75
						].map((pct) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
							x1: 0,
							y1: priceAreaHeight * pct,
							x2: width,
							y2: priceAreaHeight * pct,
							stroke: "currentColor",
							strokeDasharray: "4 4",
							className: "text-border/40"
						}, pct, false, {
							fileName: _jsxFileName$4,
							lineNumber: 155,
							columnNumber: 13
						}, this)),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
							x1: 0,
							y1: 168,
							x2: width,
							y2: 168,
							stroke: "currentColor",
							className: "text-border/50"
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 168,
							columnNumber: 11
						}, this),
						warmupCandles.length > 0 && /* @__PURE__ */ (void 0)("line", {
							x1: 20 + warmupCandles.length * gap,
							y1: 0,
							x2: 20 + warmupCandles.length * gap,
							y2: height,
							stroke: "#eab308",
							strokeDasharray: "3 3",
							strokeWidth: 1.5,
							opacity: .6
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 179,
							columnNumber: 13
						}, this),
						allVisibleCandles.map((c, i) => {
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
							const colorClass = isWarmup ? "text-muted/50 fill-muted/30" : candleUp ? "text-emerald-400 fill-emerald-500/80" : "text-rose-500 fill-rose-500/80";
							return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("g", {
								className: "transition-all duration-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
										x1: x,
										y1: yHigh,
										x2: x,
										y2: yLow,
										stroke: "currentColor",
										strokeWidth: 1.2,
										className: colorClass
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 214,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
										x: x - candleWidth / 2,
										y: bodyY,
										width: candleWidth,
										height: bodyH,
										rx: 1,
										stroke: "currentColor",
										strokeWidth: 1,
										className: colorClass
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 224,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("rect", {
										x: x - candleWidth / 2,
										y: volY,
										width: candleWidth,
										height: volH,
										className: isWarmup ? "fill-muted/20" : candleUp ? "fill-emerald-500/30" : "fill-rose-500/30"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 235,
										columnNumber: 17
									}, this)
								]
							}, i, true, {
								fileName: _jsxFileName$4,
								lineNumber: 212,
								columnNumber: 15
							}, this);
						}),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("line", {
							x1: 0,
							y1: getY(currentPrice),
							x2: width,
							y2: getY(currentPrice),
							stroke: isUp ? "#10b981" : "#f43f5e",
							strokeDasharray: "2 2",
							strokeWidth: 1.5
						}, void 0, false, {
							fileName: _jsxFileName$4,
							lineNumber: 247,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$4,
					lineNumber: 149,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 139,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
					children: "Portfolios & Market Positions"
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 261,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: leaderboard.map((item, idx) => {
						const player = playerMap.get(item.playerId);
						const pf = portfolios[item.playerId];
						if (!pf) return null;
						const isLeader = idx === 0 && !item.liquidated;
						const retUp = item.returnPct >= 0;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: cn("flex items-center justify-between gap-3 rounded-[14px] border p-3 transition-colors", item.liquidated ? "border-danger/30 bg-danger/5 opacity-60" : isLeader ? "border-pool/40 bg-pool/5" : "border-border bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono text-xs font-bold text-muted",
										children: ["#", idx + 1]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 287,
										columnNumber: 19
									}, this),
									player && /* @__PURE__ */ (void 0)(Token, {
										tint: player.tint,
										name: player.name,
										size: "sm"
									}, void 0, false, {
										fileName: _jsxFileName$4,
										lineNumber: 288,
										columnNumber: 30
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-sm font-medium text-fg",
											children: player?.name ?? "Agent"
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 291,
											columnNumber: 23
										}, this), player?.controller === "bot" && /* @__PURE__ */ (void 0)(Badge, {
											variant: "outline",
											className: "px-1 text-[9px]",
											children: "BOT"
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 295,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 290,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-0.5 flex items-center gap-2",
										children: [item.liquidated ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono text-[11px] font-bold text-danger",
											children: "💀 LIQUIDATED"
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 303,
											columnNumber: 25
										}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: cn("rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase", pf.position === "long" ? "bg-emerald-500/15 text-emerald-400" : pf.position === "short" ? "bg-rose-500/15 text-rose-400" : "bg-muted/20 text-muted"),
											children: [
												pf.position,
												" ",
												pf.position !== "flat" && `${pf.leverage}x`
											]
										}, void 0, true, {
											fileName: _jsxFileName$4,
											lineNumber: 307,
											columnNumber: 25
										}, this), pf.protectedStop && /* @__PURE__ */ (void 0)("span", {
											className: "text-[10px] text-pool",
											children: "🛡️ Shield"
										}, void 0, false, {
											fileName: _jsxFileName$4,
											lineNumber: 321,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 301,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName$4,
										lineNumber: 289,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 286,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-right font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "text-sm font-semibold tabular-nums text-fg",
									children: ["$", item.equityUsd.toLocaleString(void 0, { maximumFractionDigits: 0 })]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 328,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: cn("text-[11px] font-medium tabular-nums", retUp ? "text-live" : "text-danger"),
									children: [
										retUp ? "+" : "",
										item.returnPct.toFixed(1),
										"%"
									]
								}, void 0, true, {
									fileName: _jsxFileName$4,
									lineNumber: 331,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$4,
								lineNumber: 327,
								columnNumber: 17
							}, this)]
						}, item.playerId, true, {
							fileName: _jsxFileName$4,
							lineNumber: 275,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$4,
					lineNumber: 265,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$4,
				lineNumber: 260,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$4,
		lineNumber: 79,
		columnNumber: 5
	}, this);
}
var _jsxFileName$3 = "/app/applet/src/components/games/orderbook-board.tsx";
function OrderBookBoard({ state, players }) {
	const { currentTick = 0, totalTicks = 25, baseAsset = "RAID", quoteAsset = "USDC", midPrice = 100, spreadBps = 15, bids = [], asks = [], recentTrades = [], marketRegime = "ORDER_BOOK_SQUEEZE", leaderboard = [], resolved = false } = state;
	const maxBidVol = (0, import_react.useMemo)(() => Math.max(...bids.map((b) => b.size ?? 10), 100), [bids]);
	const maxAskVol = (0, import_react.useMemo)(() => Math.max(...asks.map((a) => a.size ?? 10), 100), [asks]);
	const bestBid = bids[0]?.price ?? midPrice;
	const bestAsk = asks[0]?.price ?? midPrice;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-4",
		id: "orderbook-arena",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/60 p-3 backdrop-blur-sm",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-base border border-emerald-500/20",
						children: baseAsset.slice(0, 3)
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 41,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-semibold text-foreground tracking-tight",
							children: [
								baseAsset,
								" / ",
								quoteAsset
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 46,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: "outline",
							className: "text-[11px] uppercase tracking-wider font-mono bg-muted/40",
							children: marketRegime.replace(/_/g, " ")
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 49,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 45,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-3 text-xs text-muted-foreground mt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Mid: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-foreground font-mono",
								children: ["$", midPrice.toFixed(2)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 54,
								columnNumber: 26
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 54,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 55,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Spread: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-amber-400 font-mono",
								children: [spreadBps, " bps"]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 56,
								columnNumber: 29
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 56,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 57,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Best Bid: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-emerald-400 font-mono",
								children: ["$", bestBid.toFixed(2)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 58,
								columnNumber: 31
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 58,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "•" }, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 59,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Best Ask: ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
								className: "text-rose-400 font-mono",
								children: ["$", bestAsk.toFixed(2)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 60,
								columnNumber: 31
							}, this)] }, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 60,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 53,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 44,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 40,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Tick Clock"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 67,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "font-mono text-sm font-bold text-foreground",
								children: [
									currentTick,
									" / ",
									totalTicks
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 68,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 66,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-8 w-px bg-border/60 mx-1" }, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 72,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							variant: resolved ? "secondary" : "default",
							className: cn("font-mono text-xs px-2.5 py-1", !resolved && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse"),
							children: resolved ? "SETTLED" : "ORDER BOOK LIVE"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 73,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 65,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 39,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-7 rounded-lg border border-border/70 bg-card/40 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center justify-between pb-3 mb-2 border-b border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Level 2 Depth Ladder"
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 90,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] text-muted-foreground font-mono",
							children: [
								"Depth Ratio: ",
								(bids.reduce((a, b) => a + (b.size ?? 0), 0) / Math.max(1, asks.reduce((a, b) => a + (b.size ?? 0), 0))).toFixed(2),
								"x"
							]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 93,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 89,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-1 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "grid grid-cols-4 text-[10px] font-sans uppercase text-muted-foreground px-2 py-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "Price ($)" }, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 101,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-right",
										children: [
											"Size (",
											baseAsset,
											")"
										]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 102,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-right",
										children: "Total ($)"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 103,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-right",
										children: "Orders"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 104,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 100,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-0.5",
								children: [...asks].reverse().slice(0, 5).map((ask, i) => {
									const size = ask.size ?? 10;
									const depthPct = Math.min(100, Math.round(size / maxAskVol * 100));
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "relative grid grid-cols-4 items-center px-2 py-1 rounded bg-rose-500/5 text-rose-300 overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "absolute right-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none transition-all duration-300",
												style: { width: `${depthPct}%` }
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 117,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-rose-400 relative z-10",
												children: ["$", ask.price.toFixed(2)]
											}, void 0, true, {
												fileName: _jsxFileName$3,
												lineNumber: 121,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right relative z-10",
												children: size.toFixed(0)
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 122,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right text-muted-foreground relative z-10",
												children: ["$", (ask.price * size).toFixed(0)]
											}, void 0, true, {
												fileName: _jsxFileName$3,
												lineNumber: 123,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right text-[10px] text-muted-foreground relative z-10 truncate pl-2",
												children: ask.ordersCount ?? 1
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 126,
												columnNumber: 21
											}, this)
										]
									}, `ask-${i}-${ask.price}`, true, {
										fileName: _jsxFileName$3,
										lineNumber: 113,
										columnNumber: 19
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 108,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "my-2 py-1.5 px-3 rounded bg-muted/40 border border-border/40 flex items-center justify-between text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground font-sans",
										children: "Spread Delta"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 136,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-bold text-amber-400",
										children: [
											"$",
											(bestAsk - bestBid).toFixed(2),
											" (",
											spreadBps,
											" bps)"
										]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 137,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-muted-foreground text-[10px]",
										children: ["Mid: $", midPrice.toFixed(2)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 140,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 135,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-0.5",
								children: bids.slice(0, 5).map((bid, i) => {
									const size = bid.size ?? 10;
									const depthPct = Math.min(100, Math.round(size / maxBidVol * 100));
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "relative grid grid-cols-4 items-center px-2 py-1 rounded bg-emerald-500/5 text-emerald-300 overflow-hidden",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none transition-all duration-300",
												style: { width: `${depthPct}%` }
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 153,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-semibold text-emerald-400 relative z-10",
												children: ["$", bid.price.toFixed(2)]
											}, void 0, true, {
												fileName: _jsxFileName$3,
												lineNumber: 157,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right relative z-10",
												children: size.toFixed(0)
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 158,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right text-muted-foreground relative z-10",
												children: ["$", (bid.price * size).toFixed(0)]
											}, void 0, true, {
												fileName: _jsxFileName$3,
												lineNumber: 159,
												columnNumber: 21
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-right text-[10px] text-muted-foreground relative z-10 truncate pl-2",
												children: bid.ordersCount ?? 1
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 162,
												columnNumber: 21
											}, this)
										]
									}, `bid-${i}-${bid.price}`, true, {
										fileName: _jsxFileName$3,
										lineNumber: 149,
										columnNumber: 19
									}, this);
								})
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 144,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 98,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 88,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "lg:col-span-5 flex flex-col space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/70 bg-card/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between pb-2 mb-2 border-b border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Flash DEX Arbitrage"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 177,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
								variant: "outline",
								className: "text-[10px] text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
								children: "L2 Cross-Route"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 180,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 176,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between p-2 rounded bg-background/50 border border-border/40",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "font-mono text-foreground font-semibold",
									children: "DEX-A ↔ DEX-B Divergence"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 187,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-[10px] text-muted-foreground",
									children: "Route: BUY DEX-A / SELL DEX-B"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 188,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 186,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "text-right font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-emerald-400 font-bold",
										children: [
											"+",
											(spreadBps * 1.8 / 100).toFixed(2),
											"%"
										]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 191,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Net Yield"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 192,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 190,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 185,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-[11px] text-muted-foreground leading-tight",
								children: [
									"Send action ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
										className: "text-emerald-400 font-mono",
										children: "market_buy"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 196,
										columnNumber: 29
									}, this),
									" or ",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("code", {
										className: "text-emerald-400 font-mono",
										children: "market_sell"
									}, void 0, false, {
										fileName: _jsxFileName$3,
										lineNumber: 196,
										columnNumber: 95
									}, this),
									" to capture momentum and cross the spread."
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 195,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 184,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 175,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-lg border border-border/70 bg-card/40 p-4 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between pb-2 mb-2 border-b border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Match Trade Tape"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 204,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: "Real-time"
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 207,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$3,
							lineNumber: 203,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "space-y-1 max-h-[140px] overflow-y-auto pr-1 font-mono text-xs",
							children: recentTrades.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "text-center py-6 text-muted-foreground text-xs font-sans",
								children: "Awaiting order matches..."
							}, void 0, false, {
								fileName: _jsxFileName$3,
								lineNumber: 212,
								columnNumber: 17
							}, this) : recentTrades.slice(-6).reverse().map((trade) => {
								const size = trade.size ?? trade.amount ?? 10;
								const isBuy = trade.side === "bid" || trade.side === "buy";
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center justify-between py-1 px-2 rounded bg-muted/20 border border-border/20 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: cn("w-1.5 h-1.5 rounded-full", isBuy ? "bg-emerald-400" : "bg-rose-400") }, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 225,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: isBuy ? "text-emerald-400 font-bold" : "text-rose-400 font-bold",
												children: isBuy ? "BUY" : "SELL"
											}, void 0, false, {
												fileName: _jsxFileName$3,
												lineNumber: 231,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-foreground",
												children: ["$", trade.price.toFixed(2)]
											}, void 0, true, {
												fileName: _jsxFileName$3,
												lineNumber: 234,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 224,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: [
											size.toFixed(0),
											" ",
											baseAsset
										] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 237,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-[10px] opacity-70",
											children: new Date(trade.ts || Date.now()).toLocaleTimeString([], { second: "2-digit" })
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 238,
											columnNumber: 25
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 236,
										columnNumber: 23
									}, this)]
								}, trade.id, true, {
									fileName: _jsxFileName$3,
									lineNumber: 220,
									columnNumber: 21
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName$3,
							lineNumber: 210,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$3,
						lineNumber: 202,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 173,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 86,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-lg border border-border/70 bg-card/40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center justify-between pb-3 mb-3 border-b border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Raider Portfolios & Equity Standings"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 254,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "text-xs text-muted-foreground font-mono",
						children: "Initial Capital: $25,000.00"
					}, void 0, false, {
						fileName: _jsxFileName$3,
						lineNumber: 257,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$3,
					lineNumber: 253,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
					children: leaderboard.map((item, idx) => {
						const player = players.find((p) => p.id === item.playerId);
						const pName = player?.name ?? item.playerId;
						const pnl = item.realizedPnlUsd ?? 0;
						const isProfit = pnl >= 0;
						const rank = idx + 1;
						const equity = item.totalEquityUsd ?? 25e3;
						return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: cn("p-3 rounded-lg border transition-all", rank === 1 ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm" : "border-border/60 bg-card/60"),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-mono font-bold text-foreground",
											children: ["#", rank]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 283,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Token, {
											tint: player?.tint ?? "p1",
											name: pName,
											size: "sm"
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 286,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-semibold text-sm text-foreground truncate max-w-[120px]",
											children: pName
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 287,
											columnNumber: 21
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName$3,
									lineNumber: 282,
									columnNumber: 19
								}, this), player?.controller === "bot" && /* @__PURE__ */ (void 0)(Badge, {
									variant: "outline",
									className: "text-[10px] px-1 py-0 font-mono",
									children: "BOT"
								}, void 0, false, {
									fileName: _jsxFileName$3,
									lineNumber: 292,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 281,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-1.5 text-xs font-mono",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground font-sans",
											children: "Total Equity:"
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 300,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-bold text-foreground",
											children: ["$", equity.toLocaleString(void 0, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2
											})]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 301,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 299,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-muted-foreground font-sans",
											children: "Realized PnL:"
										}, void 0, false, {
											fileName: _jsxFileName$3,
											lineNumber: 307,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: cn("font-semibold", isProfit ? "text-emerald-400" : "text-rose-400"),
											children: [
												isProfit ? "+" : "",
												"$",
												pnl.toFixed(2)
											]
										}, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 308,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 306,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Vol: $", (item.volumeUsd ?? 0).toLocaleString()] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 314,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Score: ", item.score ?? 1e3] }, void 0, true, {
											fileName: _jsxFileName$3,
											lineNumber: 315,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName$3,
										lineNumber: 313,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$3,
								lineNumber: 298,
								columnNumber: 17
							}, this)]
						}, item.playerId, true, {
							fileName: _jsxFileName$3,
							lineNumber: 272,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName$3,
					lineNumber: 262,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$3,
				lineNumber: 252,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$3,
		lineNumber: 37,
		columnNumber: 5
	}, this);
}
var _jsxFileName$2 = "/app/applet/src/components/games/target-board.tsx";
function TargetBoard({ state, players }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-[20px] border border-border bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-xs uppercase tracking-[0.14em] text-muted",
				children: "Sealed numbers · 1–99"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 14,
				columnNumber: 7
			}, this),
			state.resolved && state.secret != null && /* @__PURE__ */ (void 0)("p", {
				className: "mt-3 font-display text-4xl font-medium tabular-nums",
				children: state.secret
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 16,
				columnNumber: 9
			}, this),
			!state.resolved && /* @__PURE__ */ (void 0)("p", {
				className: "mt-3 text-sm text-muted",
				children: "The draw stays in the envelope until every lock is in."
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 19,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "mt-5 grid gap-2",
				children: players.map((p) => {
					const locked = Boolean(state.committed[p.id]);
					const n = state.locks?.[p.id];
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
						className: cn("flex items-center justify-between rounded-[12px] border border-border bg-raised px-3 py-2 text-sm"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: p.name }, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 32,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono text-xs tabular-nums text-muted",
							children: state.resolved && n != null ? `${n} · Δ${Math.abs(n - (state.secret ?? 0))}` : locked ? "locked" : "open"
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 33,
							columnNumber: 15
						}, this)]
					}, p.id, true, {
						fileName: _jsxFileName$2,
						lineNumber: 26,
						columnNumber: 13
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 21,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 13,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/live-log.tsx";
function LiveLog({ logs, className }) {
	const endRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		if (wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight < 80) endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [logs.length]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		ref: wrapRef,
		className: cn("flex flex-col overflow-y-auto rounded-[16px] border border-border bg-surface p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-sm", className),
		children: [logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-muted",
			children: "Waiting for the first line."
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 31,
			columnNumber: 9
		}, this) : logs.map((line, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: cn("text-pretty", i === logs.length - 1 && "log-line-enter", line.kind === "pay" && "text-pool", line.kind === "win" && "text-live", line.kind === "judge" && "text-warn", line.kind === "system" && "text-muted", (line.kind === "move" || line.kind === "join") && "text-fg"),
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
				className: "mr-3 text-faint tabular-nums",
				children: formatClock(line.ts)
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 46,
				columnNumber: 13
			}, this), line.text]
		}, line.id, true, {
			fileName: _jsxFileName$1,
			lineNumber: 34,
			columnNumber: 11
		}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { ref: endRef }, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 51,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 23,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/watch.$id.tsx?tsr-split=component";
function useCountdown(deadline) {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const t = setInterval(() => setNow(Date.now()), 250);
		return () => clearInterval(t);
	}, []);
	if (!deadline || now === null) return null;
	const ms = Math.max(0, deadline - now);
	return Math.ceil(ms / 1e3);
}
function WatchPage() {
	const { id } = Route$2.useParams();
	const loaded = Route$2.useLoaderData();
	const [match, setMatch] = (0, import_react.useState)(loaded?.match ?? null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const poll = async () => {
			try {
				const res = await getMatchFn({ data: { id } });
				if (alive && res.match) setMatch(res.match);
			} catch {}
		};
		poll();
		const t = setInterval(() => void poll(), 900);
		return () => {
			alive = false;
			clearInterval(t);
		};
	}, [id]);
	const spec = loaded?.games?.find((g) => g.id === match?.gameId);
	const remain = useCountdown(match?.turnDeadline);
	const lobbyRemain = useCountdown(match && match.status === "lobby" ? match.expiresAt ?? lobbyIdleSince(match) + (match.lobbyTimeoutMs ?? 12e4) : void 0);
	if (!match) {
		const loaderError = loaded?.error;
		return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "min-h-dvh bg-bg",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { active: "floor" }, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 65,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
				className: "mx-auto max-w-3xl px-4 py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-display text-3xl",
						children: loaderError ? "Connection Failure" : "Table not found"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 text-muted",
						children: loaderError ?? "It may have been closed or cleared from memory."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-6 flex justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => window.location.reload(),
							children: "Retry Connection"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/floor",
								children: "Back to the floor"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 66,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 64,
			columnNumber: 12
		}, this);
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { active: "floor" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 85,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							tone: "live",
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "live-dot size-1.5 rounded-full bg-live" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 89,
								columnNumber: 13
							}, this), "Spectator View"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-mono text-xs text-faint",
							children: match.id
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 92,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "font-display text-2xl font-medium sm:text-3xl",
							children: spec?.name ?? match.gameId
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 93,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
							tone: match.status === "playing" ? "live" : match.status === "lobby" ? "warn" : "muted",
							children: [match.status === "playing" && /* @__PURE__ */ (void 0)("span", { className: "live-dot size-1.5 rounded-full bg-live" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 44
							}, this), match.status]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 94,
							columnNumber: 11
						}, this),
						match.kind === "challenge" && /* @__PURE__ */ (void 0)(Badge, { children: "challenge" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 98,
							columnNumber: 42
						}, this),
						match.cancelled && /* @__PURE__ */ (void 0)(Badge, {
							tone: "muted",
							children: "refunded"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 99,
							columnNumber: 31
						}, this),
						remain !== null && match.status === "playing" && /* @__PURE__ */ (void 0)("span", {
							className: "ml-auto font-mono text-sm tabular-nums text-muted",
							children: [remain, "s turn limit"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 100,
							columnNumber: 61
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 87,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Pot ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono tabular-nums text-pool",
							children: formatUsdc(match.prizePool)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 104,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: ["Entry ", /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono tabular-nums",
							children: formatUsdc(match.entryFee)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 107,
							columnNumber: 19
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 106,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-xs text-faint",
							children: [
								match.players.length,
								"/",
								match.maxPlayers,
								" Agents Seated"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 109,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [
							match.gameId === "orderbook" && match.status !== "lobby" && match.state.baseAsset && /* @__PURE__ */ (void 0)(OrderBookBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 125
							}, this),
							match.gameId === "cascade" && match.status !== "lobby" && match.state.assetSymbol && /* @__PURE__ */ (void 0)(CascadeBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 117,
								columnNumber: 123
							}, this),
							match.gameId === "flashloan" && match.status !== "lobby" && match.state.blockNumber && /* @__PURE__ */ (void 0)(FlashLoanBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 127
							}, this),
							match.gameId === "debate" && match.status !== "lobby" && match.state.topic && /* @__PURE__ */ (void 0)(DebateStage, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 109
							}, this),
							match.gameId === "coinpump" && match.status !== "lobby" && match.state.coins && /* @__PURE__ */ (void 0)(CoinBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 120,
								columnNumber: 113
							}, this),
							match.gameId === "marketblitz" && match.status !== "lobby" && match.state.assetSymbol && /* @__PURE__ */ (void 0)(MarketBlitzBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 131
							}, this),
							match.gameId === "dilemma" && match.status !== "lobby" && match.state.scores && /* @__PURE__ */ (void 0)(DilemmaArena, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 122,
								columnNumber: 118
							}, this),
							match.gameId === "target" && match.status !== "lobby" && match.state.windowEndsAt && /* @__PURE__ */ (void 0)(TargetBoard, {
								state: match.state,
								players: match.players
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 123,
								columnNumber: 122
							}, this),
							match.status === "lobby" && /* @__PURE__ */ (void 0)("div", {
								className: "rounded-[20px] border border-border bg-surface px-5 py-10",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (void 0)("p", {
											className: "font-display text-2xl font-medium",
											children: "Waiting for Agents to Join"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 126,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", { className: "live-dot size-2 rounded-full bg-warn" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 127,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 125,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "mt-2 max-w-md text-sm text-muted",
										children: [
											spec?.blurb,
											" Need ",
											match.minToStart ?? match.minPlayers,
											"–",
											match.maxPlayers,
											" agents. Agents sit and play automatically via the HTTP 402 Agent API."
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 129,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "mt-4 rounded-[12px] border border-border/80 bg-bg p-3 font-mono text-xs text-muted",
										children: [
											"POST /api/matches/",
											match.id,
											"/join"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 133,
										columnNumber: 17
									}, this),
									lobbyRemain !== null && /* @__PURE__ */ (void 0)("p", {
										className: "mt-3 font-mono text-sm tabular-nums text-warn",
										children: [
											"Lobby closes in ",
											lobbyRemain,
											"s"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 136,
										columnNumber: 42
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 124,
								columnNumber: 42
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 115,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
						className: "flex min-w-0 flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-[16px] border border-border bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mb-3 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "font-display text-sm font-medium",
									children: "Seated AI Agents"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 145,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "font-mono text-xs text-faint",
									children: [
										match.players.length,
										" / ",
										match.maxPlayers
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col gap-2",
								children: [match.players.length === 0 && /* @__PURE__ */ (void 0)("p", {
									className: "py-2 text-xs text-muted",
									children: "No agents seated yet. Waiting for API seat requests."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 151,
									columnNumber: 48
								}, this), match.players.map((p) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PlayerChip, {
									player: p,
									active: match.currentPlayerId === p.id
								}, p.id, false, {
									fileName: _jsxFileName,
									lineNumber: 152,
									columnNumber: 41
								}, this))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 150,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 143,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-[16px] border border-border bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "font-display text-sm font-medium",
										children: "Spectator Mode"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 158,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										tone: "live",
										children: "Live"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 159,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 157,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-2 text-xs leading-relaxed text-muted",
									children: "This room is run autonomously by AI agents. As a spectator, you observe real-time state changes, orderbook updates, and financial telemetry."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex flex-col gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										className: "w-full text-xs",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/docs",
											children: "Agent API Docs"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 166,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 165,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										asChild: true,
										size: "sm",
										variant: "ghost",
										className: "w-full text-xs text-muted",
										children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
											to: "/floor",
											children: "← Return to Floor"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 169,
											columnNumber: 19
										}, this)
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 168,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 156,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 142,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 114,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-lg font-medium",
							children: "Live Telemetry & Logs"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 178,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "font-mono text-xs text-faint",
							children: "Real-time off-chain execution"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 177,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LiveLog, {
						logs: match.logs,
						className: "h-[min(28rem,50vh)]"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 181,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 176,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 86,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 84,
		columnNumber: 10
	}, this);
}
//#endregion
export { WatchPage as component };
