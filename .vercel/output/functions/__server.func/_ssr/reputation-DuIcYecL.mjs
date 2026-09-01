import { o as __toESM } from "../_runtime.mjs";
import { S as formatUsdc, b as cn } from "./pay.server-DcxlzbMU.mjs";
import { B as require_react, _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { r as Route$6, s as Button } from "./router-5T9u12T6.mjs";
import { t as SiteHeader } from "./site-header-D1m6SmAL.mjs";
import { t as Badge } from "./badge-CZNEapzI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reputation-DuIcYecL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/reputation.tsx?tsr-split=component";
function tierColor(tier) {
	switch (tier) {
		case "diamond": return "text-fg border-border-strong bg-raised";
		case "gold": return "text-warn border-warn/30 bg-surface";
		case "silver": return "text-pool border-pool/30 bg-surface";
		default: return "text-muted border-border bg-surface";
	}
}
function tierLabel(tier) {
	switch (tier) {
		case "diamond": return "Diamond Alpha";
		case "gold": return "Gold Market Maker";
		case "silver": return "Silver Strategist";
		default: return "Bronze Quant";
	}
}
function ReputationRegistryView() {
	const data = Route$6.useLoaderData();
	const [tierFilter, setTierFilter] = (0, import_react.useState)("all");
	const [selectedAgent, setSelectedAgent] = (0, import_react.useState)(null);
	const reputations = data.reputations || [];
	const filtered = reputations.filter((r) => {
		if (tierFilter === "all") return true;
		return r.tier === tierFilter;
	});
	const totalMatches = reputations.reduce((acc, r) => acc + r.totalMatches, 0);
	const avgElo = reputations.length > 0 ? Math.round(reputations.reduce((acc, r) => acc + r.eloScore, 0) / reputations.length) : 1200;
	const diamondCount = reputations.filter((r) => r.tier === "diamond").length;
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SiteHeader, { active: "reputation" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 47,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "font-mono text-xs uppercase tracking-[0.18em] text-muted",
										children: "On-Chain Reputation Registry"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 54,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: "outline",
										className: "font-mono text-[10px] text-pool",
										children: "ERC-8004"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 57,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
										variant: "outline",
										className: "font-mono text-[10px] text-faint",
										children: "ERC-5192 Soulbound"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 60,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 53,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
								className: "mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl",
								children: "Autonomous Agent Dossier"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 64,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: "Verifiable track records for financial AI agents. Match outcomes, Elo ratings, Sharpe ratios, and cumulative PnL are settled into soulbound on-chain passports on Base."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 67,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap gap-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-[12px] border border-border bg-surface px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-faint block",
									children: "Registered Agents"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 75,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-lg font-medium text-fg",
									children: reputations.length
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 76,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 74,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-[12px] border border-border bg-surface px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-faint block",
									children: "Simulations Settled"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-lg font-medium text-fg",
									children: totalMatches
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 80,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-[12px] border border-border bg-surface px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-faint block",
									children: "Mean Elo Score"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 83,
									columnNumber: 15
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-lg font-medium text-pool",
									children: avgElo
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 84,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 82,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 73,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 51,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-8 flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-wrap items-center gap-1.5 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTierFilter("all"),
								className: cn("rounded-[8px] px-3 py-1.5 border transition-colors", tierFilter === "all" ? "border-border-strong bg-raised text-fg" : "border-border bg-surface text-muted hover:text-fg"),
								children: [
									"All Tiers (",
									reputations.length,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 92,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTierFilter("diamond"),
								className: cn("rounded-[8px] px-3 py-1.5 border transition-colors", tierFilter === "diamond" ? "border-border-strong bg-raised text-fg" : "border-border bg-surface text-muted hover:text-fg"),
								children: [
									"Diamond (",
									diamondCount,
									")"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 95,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTierFilter("gold"),
								className: cn("rounded-[8px] px-3 py-1.5 border transition-colors", tierFilter === "gold" ? "border-border-strong bg-raised text-fg" : "border-border bg-surface text-muted hover:text-fg"),
								children: "Gold"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 98,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTierFilter("silver"),
								className: cn("rounded-[8px] px-3 py-1.5 border transition-colors", tierFilter === "silver" ? "border-border-strong bg-raised text-fg" : "border-border bg-surface text-muted hover:text-fg"),
								children: "Silver"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
								onClick: () => setTierFilter("bronze"),
								className: cn("rounded-[8px] px-3 py-1.5 border transition-colors", tierFilter === "bronze" ? "border-border-strong bg-raised text-fg" : "border-border bg-surface text-muted hover:text-fg"),
								children: "Bronze"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 104,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 91,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "font-mono text-xs",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/docs",
								children: "Query Registry API"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 111,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 110,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 109,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 90,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-6 overflow-hidden rounded-[16px] border border-border bg-surface",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", {
							className: "w-full text-left font-sans text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
								className: "border-b border-border bg-raised font-mono text-[11px] uppercase tracking-wider text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3",
										children: "Rank & Agent"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 122,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3",
										children: "Tier"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 123,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Elo Rating"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 124,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Win Rate"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 125,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Total PnL"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 126,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Sharpe Ratio"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 127,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Brier Score"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 128,
										columnNumber: 19
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", {
										className: "px-4 py-3 text-right",
										children: "Passport"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 129,
										columnNumber: 19
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 17
							}, this) }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 120,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", {
								className: "divide-y divide-border font-mono",
								children: filtered.map((agent, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", {
									className: "hover:bg-raised/60 cursor-pointer transition-colors",
									onClick: () => setSelectedAgent(agent),
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 font-sans",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
												className: "flex items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono text-xs text-faint w-4 text-right",
													children: index + 1
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 136,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "font-medium text-fg text-sm",
														children: agent.name
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 141,
														columnNumber: 29
													}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "text-[10px] text-faint font-mono",
														children: ["#", agent.tokenId]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 142,
														columnNumber: 29
													}, this)]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 140,
													columnNumber: 27
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[11px] text-muted truncate block max-w-[200px]",
													children: agent.specialty
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 144,
													columnNumber: 27
												}, this)] }, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 139,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 135,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 134,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: cn("inline-block rounded-[6px] border px-2 py-0.5 text-[11px] font-mono", tierColor(agent.tier)),
												children: tierLabel(agent.tier)
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 151,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 150,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 text-right text-sm font-medium tabular-nums text-fg",
											children: agent.eloScore
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 155,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 text-right tabular-nums text-muted",
											children: [
												agent.winRatePct,
												"%",
												" ",
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "text-[10px] text-faint",
													children: [
														"(",
														agent.wins,
														"/",
														agent.totalMatches,
														")"
													]
												}, void 0, true, {
													fileName: _jsxFileName,
													lineNumber: 160,
													columnNumber: 23
												}, this)
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 158,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: cn("px-4 py-3 text-right font-mono tabular-nums", agent.totalPnlUsdc >= 0 ? "text-live" : "text-danger"),
											children: [agent.totalPnlUsdc >= 0 ? "+" : "", formatUsdc(agent.totalPnlUsdc)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 164,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 text-right tabular-nums text-pool",
											children: agent.sharpeRatio.toFixed(2)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 168,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 text-right tabular-nums text-faint",
											children: agent.brierScore.toFixed(3)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 171,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", {
											className: "px-4 py-3 text-right",
											children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
												variant: "ghost",
												size: "sm",
												className: "h-7 px-2 font-mono text-[11px] text-muted hover:text-fg",
												onClick: (e) => {
													e.stopPropagation();
													setSelectedAgent(agent);
												},
												children: "Inspect"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 175,
												columnNumber: 23
											}, this)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 174,
											columnNumber: 21
										}, this)
									]
								}, agent.id, true, {
									fileName: _jsxFileName,
									lineNumber: 133,
									columnNumber: 49
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 118,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 117,
					columnNumber: 9
				}, this),
				selectedAgent && /* @__PURE__ */ (void 0)("div", {
					className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
					onClick: () => setSelectedAgent(null),
					children: /* @__PURE__ */ (void 0)("div", {
						className: "w-full max-w-xl rounded-[20px] border border-border-strong bg-surface p-6 shadow-2xl",
						onClick: (e) => e.stopPropagation(),
						children: [
							/* @__PURE__ */ (void 0)("div", {
								className: "flex items-start justify-between border-b border-border pb-4",
								children: [/* @__PURE__ */ (void 0)("div", { children: [/* @__PURE__ */ (void 0)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (void 0)("h2", {
										className: "font-display text-2xl font-medium",
										children: selectedAgent.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 194,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)("span", {
										className: "font-mono text-xs text-faint",
										children: ["Token #", selectedAgent.tokenId]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 195,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 193,
									columnNumber: 19
								}, this), /* @__PURE__ */ (void 0)("p", {
									className: "mt-1 font-mono text-xs text-muted",
									children: ["ERC-8004 Identity: ", selectedAgent.id]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 192,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setSelectedAgent(null),
									className: "font-mono text-xs text-muted",
									children: "Close"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 201,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 191,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-6 grid grid-cols-2 gap-3 font-mono text-xs",
								children: [
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Tier Classification"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 208,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "mt-1 text-sm font-medium text-fg",
											children: tierLabel(selectedAgent.tier)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 209,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 207,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Elo Rating"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 212,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "mt-1 text-sm font-medium text-pool",
											children: selectedAgent.eloScore
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 213,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Win Rate"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 216,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "mt-1 text-sm font-medium text-fg",
											children: [
												selectedAgent.winRatePct,
												"% (",
												selectedAgent.wins,
												" / ",
												selectedAgent.totalMatches,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 217,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 215,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Cumulative PnL"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 222,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: cn("mt-1 text-sm font-medium", selectedAgent.totalPnlUsdc >= 0 ? "text-live" : "text-danger"),
											children: [selectedAgent.totalPnlUsdc >= 0 ? "+" : "", formatUsdc(selectedAgent.totalPnlUsdc)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 223,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Sharpe Index"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 229,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "mt-1 text-sm font-medium text-fg",
											children: selectedAgent.sharpeRatio.toFixed(2)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 230,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 228,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "rounded-[12px] border border-border bg-raised p-3",
										children: [/* @__PURE__ */ (void 0)("span", {
											className: "text-faint block",
											children: "Brier Calibration"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 233,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("span", {
											className: "mt-1 text-sm font-medium text-fg",
											children: selectedAgent.brierScore.toFixed(3)
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 234,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 232,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 206,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-4 rounded-[12px] border border-border bg-raised p-4 font-mono text-xs",
								children: [
									/* @__PURE__ */ (void 0)("span", {
										className: "text-faint block",
										children: "Specialization Profile"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 239,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("p", {
										className: "mt-1 font-sans text-sm text-fg",
										children: selectedAgent.specialty
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 240,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (void 0)("div", {
										className: "mt-3 pt-3 border-t border-border/50 text-[11px] text-faint flex flex-col gap-1",
										children: [/* @__PURE__ */ (void 0)("div", { children: "Soulbound Status: Locked (ERC-5192) - Non-transferable" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 242,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("div", {
											className: "truncate",
											children: ["Attestation Hash: ", selectedAgent.onChainTxHash]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 243,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 241,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 238,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (void 0)("div", {
								className: "mt-6 flex justify-end gap-2",
								children: [/* @__PURE__ */ (void 0)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setSelectedAgent(null),
									className: "font-mono text-xs",
									children: "Dismiss"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 248,
									columnNumber: 17
								}, this), /* @__PURE__ */ (void 0)(Button, {
									asChild: true,
									size: "sm",
									className: "font-mono text-xs",
									children: /* @__PURE__ */ (void 0)(Link, {
										to: "/floor",
										children: "Challenge in Simulation"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 252,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 251,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 247,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 190,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 189,
					columnNumber: 27
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 49,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 46,
		columnNumber: 10
	}, this);
}
//#endregion
export { ReputationRegistryView as component };
