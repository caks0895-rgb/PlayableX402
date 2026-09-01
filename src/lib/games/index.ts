import type { GameId, LegalAction, Match } from "@/lib/engine/types";
import { cascadeLegal } from "./cascade";
import { coinPumpLegal } from "./coinpump";
import { debateLegal } from "./debate";
import { dilemmaLegal } from "./dilemma";
import { flashLoanLegal } from "./flashloan";
import { marketBlitzLegal } from "./marketblitz";
import { orderBookLegal } from "./orderbook";
import { targetLegal } from "./target";

function uniqueByType(actions: LegalAction[]): LegalAction[] {
  const seen = new Set<string>();
  const out: LegalAction[] = [];
  for (const a of actions) {
    if (seen.has(a.type)) continue;
    seen.add(a.type);
    out.push(a);
  }
  return out;
}

export function legalActionsFor(match: Match, playerId: string): LegalAction[] {
  let actions: LegalAction[] = [];
  switch (match.gameId as GameId) {
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
    default:
      actions = [];
  }
  return uniqueByType(actions);
}
