import { useState } from "react";
import type { AgentAction, PublicMatch } from "@/lib/engine/types";
import { Button } from "@/components/ui/button";
import { formatUsdc } from "@/lib/utils";

export function ActionDock({
  match,
  agentId,
  busy,
  error,
  onAction,
}: {
  match: PublicMatch;
  agentId: string;
  busy: boolean;
  error?: string;
  onAction: (action: AgentAction) => void;
}) {
  const actions = match.legalActions ?? [];
  const [text, setText] = useState("");
  const [lockValue, setLockValue] = useState("47");
  const [pdTape, setPdTape] = useState(["cooperate", "defect", "cooperate", "defect", "cooperate"]);
  const [leverage, setLeverage] = useState(2);
  const [sizePct, setSizePct] = useState(100);
  const seated = match.players.some((p) => p.id === agentId);

  if (match.status === "finished") {
    const winners = match.settlement?.winners ?? [];
    return (
      <div className="rounded-[16px] border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Table closed</p>
        <p className="mt-2 font-display text-xl font-medium">Pot paid. No rematch.</p>
        {winners.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            {match.cancelled ? "Challenge expired. Every entry was refunded." : "No winner. Pot stays in the treasury."}
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1 text-sm">
            {winners.map((w) => (
              <li key={w.id} className="flex justify-between gap-3">
                <span>{w.name}</span>
                <span className="font-mono tabular-nums text-pool">{formatUsdc(w.amount)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">Open a new table from the floor if you want another game.</p>
      </div>
    );
  }

  if (!seated) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-4 text-sm text-muted">
        Sit down to take a turn, or watch autonomous agents compete live.
      </div>
    );
  }

  if (match.status === "lobby") {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-4 text-sm text-muted">
        Waiting for the rest of the table.
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-4 text-sm text-muted">
        Not your window. Watch the log.
      </div>
    );
  }

  const submit = actions.find((a) => a.type === "submit");
  const pick = actions.find((a) => a.type === "pick");
  const trade = actions.find((a) => a.type === "trade");
  const stoploss = actions.find((a) => a.type === "stoploss");
  const orderAct = actions.find((a) => a.type === "order");
  const sweepAct = actions.find((a) => a.type === "sweep");
  const arbAct = actions.find((a) => a.type === "arbitrage");
  const liqShield = actions.find((a) => a.type === "liquidity_shield");
  const marginTrade = actions.find((a) => a.type === "margin_trade");
  const huntLiq = actions.find((a) => a.type === "hunt_liquidation");
  const marginShield = actions.find((a) => a.type === "margin_shield");
  const flashArb = actions.find((a) => a.type === "flash_arbitrage");
  const sandwich = actions.find((a) => a.type === "sandwich_bundle");
  const gasBid = actions.find((a) => a.type === "gas_bid");
  const builderBribe = actions.find((a) => a.type === "builder_bribe");
  const choose = actions.find((a) => a.type === "choose");
  const roll = actions.find((a) => a.type === "roll");
  const reroll = actions.find((a) => a.type === "reroll");
  const ward = actions.find((a) => a.type === "ward");
  const scout = actions.find((a) => a.type === "scout");
  const lock = actions.find((a) => a.type === "lock");
  const commit = actions.find((a) => a.type === "commit");
  const pilot = actions.find((a) => a.type === "pilot");
  const pdCommit = commit && choose;

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">Your move</p>
      {error && <p className="text-sm text-danger">{error}</p>}

      {(roll || reroll || ward) && (
        <div className="flex flex-col gap-2">
          {roll && (
            <Button disabled={busy} onClick={() => onAction({ type: "roll" })}>
              {roll.label}
            </Button>
          )}
          {pilot && (
            <Button variant="secondary" disabled={busy} onClick={() => onAction({ type: "pilot" })}>
              {pilot.label}
            </Button>
          )}
          {reroll && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => onAction({ type: "roll", powerup: "reroll" })}
            >
              {reroll.label}
              {reroll.fee ? ` · ${formatUsdc(reroll.fee)}` : ""}
            </Button>
          )}
          {ward && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => onAction({ type: "roll", powerup: "ward" })}
            >
              {ward.label}
              {ward.fee ? ` · ${formatUsdc(ward.fee)}` : ""}
            </Button>
          )}
        </div>
      )}

      {submit && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onAction({ type: "submit", text });
            setText("");
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="File your argument."
            className="min-h-28 w-full resize-y rounded-[12px] border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-border-strong focus:outline-none"
          />
          <Button type="submit" disabled={busy || text.trim().length < 12}>
            {submit.label}
          </Button>
        </form>
      )}

      {pick?.options && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {pick.options.map((opt) => (
            <Button
              key={opt.id}
              variant="secondary"
              disabled={busy}
              onClick={() => onAction({ type: "pick", coinId: opt.id })}
            >
              {opt.label.split(" · ")[0]}
            </Button>
          ))}
        </div>
      )}

      {trade?.options && (
        <div className="flex flex-col gap-3">
          {/* Leverage & Size Selectors */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted">Lev:</span>
              {[1, 2, 3, 5].map((lev) => (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  className={`h-7 px-2 rounded font-mono font-medium ${
                    leverage === lev
                      ? "bg-pool text-bg font-bold"
                      : "bg-bg border border-border text-fg hover:border-border-strong"
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-muted">Size:</span>
              {[25, 50, 100].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSizePct(sz)}
                  className={`h-7 px-2 rounded font-mono font-medium ${
                    sizePct === sz
                      ? "bg-pool text-bg font-bold"
                      : "bg-bg border border-border text-fg hover:border-border-strong"
                  }`}
                >
                  {sz}%
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "trade", position: "long", leverage, sizePct })}
            >
              LONG {leverage}x
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "trade", position: "short", leverage, sizePct })}
            >
              SHORT {leverage}x
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => onAction({ type: "trade", position: "flat" })}
            >
              FLAT
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
            {pilot && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted hover:text-fg"
                disabled={busy}
                onClick={() => onAction({ type: "pilot" })}
              >
                🤖 Auto-Pilot
              </Button>
            )}
            {stoploss && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-pool hover:text-pool/80"
                disabled={busy}
                onClick={() => onAction({ type: "stoploss" })}
              >
                🛡️ Shield {formatUsdc(stoploss.fee ?? 20000)}
              </Button>
            )}
          </div>
        </div>
      )}

      {(orderAct || sweepAct || arbAct) && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "order", side: "bid", price: 0, amount: 25 })}
            >
              📈 Post Bid (Maker)
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "order", side: "ask", price: 0, amount: 25 })}
            >
              📉 Post Ask (Maker)
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="border-emerald-500/30 text-emerald-300 font-semibold hover:bg-emerald-500/10"
              disabled={busy}
              onClick={() => onAction({ type: "sweep", side: "buy", depthLevels: 2 })}
            >
              ⚡ Sweep Asks (Buy)
            </Button>
            <Button
              variant="secondary"
              className="border-rose-500/30 text-rose-300 font-semibold hover:bg-rose-500/10"
              disabled={busy}
              onClick={() => onAction({ type: "sweep", side: "sell", depthLevels: 2 })}
            >
              ⚡ Sweep Bids (Sell)
            </Button>
          </div>

          <Button
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
            disabled={busy}
            onClick={() => onAction({ type: "arbitrage", dexPair: "L2-DEX-FLASH" })}
          >
            🔄 Execute Flash Arbitrage
          </Button>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
            {pilot && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted hover:text-fg"
                disabled={busy}
                onClick={() => onAction({ type: "pilot" })}
              >
                🤖 Auto-Market Maker
              </Button>
            )}
            {liqShield && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-pool hover:text-pool/80"
                disabled={busy}
                onClick={() => onAction({ type: "liquidity_shield" })}
              >
                🛡️ Slippage Shield {formatUsdc(liqShield.fee ?? 15000)}
              </Button>
            )}
          </div>
        </div>
      )}

      {(marginTrade || huntLiq || marginShield) && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "margin_trade", side: "long", leverage: 15, sizePct: 100 })}
            >
              LONG 15x
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "margin_trade", side: "short", leverage: 15, sizePct: 100 })}
            >
              SHORT 15x
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => onAction({ type: "margin_trade", side: "flat", leverage: 1, sizePct: 0 })}
            >
              FLAT
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "hunt_liquidation" })}
            >
              ⚔️ Hunt Liquidation (35%)
            </Button>
            <Button
              variant="secondary"
              className="border-amber-500/30 text-amber-300 font-semibold"
              disabled={busy}
              onClick={() => onAction({ type: "margin_shield" })}
            >
              🛡️ Emergency Margin Buffer
            </Button>
          </div>
        </div>
      )}

      {(flashArb || sandwich || gasBid || builderBribe) && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "flash_arbitrage", poolId: "univ3-crv-eth", loanAmountUsd: 250000 })}
            >
              ⚡ Flash Loan Arb ($250k)
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              disabled={busy}
              onClick={() => onAction({ type: "sandwich_bundle", bribeGwei: 25 })}
            >
              🥪 Sandwich Mempool Bundle
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="font-mono text-xs"
              disabled={busy}
              onClick={() => onAction({ type: "gas_bid", priorityGwei: 80 })}
            >
              ⛽ Turbo Gas (+80 Gwei)
            </Button>
            <Button
              variant="secondary"
              className="border-purple-500/30 text-purple-300 font-semibold"
              disabled={busy}
              onClick={() => onAction({ type: "builder_bribe" })}
            >
              💎 Builder Private Bribe
            </Button>
          </div>
        </div>
      )}

      {choose?.options && (
        <div className="grid grid-cols-2 gap-2">
          {choose.options.map((opt) => (
            <Button
              key={opt.id}
              variant={opt.id === "cooperate" ? "primary" : "secondary"}
              disabled={busy}
              onClick={() => onAction({ type: "choose", move: opt.id })}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}

      {scout && (
        <Button
          variant="ghost"
          disabled={busy}
          onClick={() => onAction({ type: "scout" })}
        >
          {scout.label}
          {scout.fee ? ` · ${formatUsdc(scout.fee)}` : ""}
        </Button>
      )}

      {lock && (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onAction({ type: "lock", value: Number(lockValue) });
          }}
        >
          <label className="text-xs text-muted">Number 1–99</label>
          <input
            type="number"
            min={1}
            max={99}
            value={lockValue}
            onChange={(e) => setLockValue(e.target.value)}
            className="h-11 rounded-[10px] border border-border bg-bg px-3 font-mono text-sm text-fg focus:border-border-strong focus:outline-none"
          />
          <Button type="submit" disabled={busy}>
            {lock.label}
          </Button>
        </form>
      )}

      {pdCommit && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-xs text-muted">One-push tape — five sealed moves, then you can leave.</p>
          <div className="grid grid-cols-5 gap-1">
            {pdTape.map((g, i) => (
              <select
                key={i}
                value={g}
                onChange={(e) => {
                  const next = [...pdTape];
                  next[i] = e.target.value;
                  setPdTape(next);
                }}
                className="h-10 rounded-[8px] border border-border bg-bg px-1 text-xs text-fg"
              >
                <option value="cooperate">C</option>
                <option value="defect">D</option>
              </select>
            ))}
          </div>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => onAction({ type: "commit", tape: pdTape })}
          >
            Seal tape
          </Button>
        </div>
      )}
    </div>
  );
}
