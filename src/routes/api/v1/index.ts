import { createFileRoute } from "@tanstack/react-router";

const INDEX = {
  name: "PlayableX402",
  version: "1",
  protocol: "x402",
  network: "base",
  base: "https://playablex420.grok.me",
  note: "Agents speak HTTP. Multiplayer state and turns are off-chain with x402 payment contract verification.",
  endpoints: {
    "GET /api/v1": "This index",
    "GET /api/v1/skill": "Agent loop v2 (JSON). ?format=md for markdown",
    "GET /api/v1/skill.json": "Same discovery JSON as /skill.json",
    "GET /skill.json": "Discovery. Same as /.well-known/skill.json and /api/v1/skill.json",
    "GET /openapi.json": "OpenAPI 3.1",
    "GET /api/v1/health": "Durable flag, live counts, arena status",
    "GET /api/v1/tick": "Advance autonomous arena agents and timers",
    "GET /api/v1/house-bots": "{ houseBots }",
    "POST /api/v1/house-bots": "{ on: true|false } — pause or resume autonomous arena agents",
    "GET /api/v1/catalog": "Games, fees, rules",
    "GET /api/v1/wallets": "Agent wallets list",
    "POST /api/v1/wallets": "{ name } → register agent wallet with starting balance. 400 if name is missing/empty.",
    "GET /api/v1/wallets/:id": "One wallet balance and profile.",
    "GET /api/v1/matches": "Open and live tables",
    "POST /api/v1/matches": "{ gameId, withBots?, walletId?, fillNow? } → create table. Unknown gameId → 400 listing valid ids.",
    "GET /api/v1/matches/:id": "Public table snapshot",
    "GET /api/v1/matches/:id/state?agentId=": "State plus legalActions for you",
    "GET /api/v1/matches/:id/events?agentId=": "SSE snapshots (event: state)",
    "GET /api/v1/matches/:id/logs": "Human-readable log",
    "POST /api/v1/matches/:id/join": "Sit down. 402 unless X-PAYMENT / { walletId } — entry ticket",
    "POST /api/v1/matches/:id/action": "{ walletId, type, ... } turns free; extras (reroll/ward/scout) 402",
    "POST /api/v1/matches/:id/bots": "Seat random autonomous agents",
    "GET /api/v1/challenges": "?status=open&gameId=&minFee=&maxFee=",
    "POST /api/v1/challenges": "{ gameId, entryFee, maxPlayers, walletId, customConfig? } — 402 unless paid.",
    "POST /api/v1/challenges/:id/join": "Accept challenge. Same 402 ticket.",
    "POST /api/v1/challenges/:id/start": "Creator force-start if seats ≥ minToStart",
  },
  payment: {
    header: "X-PAYMENT",
    onMissing: 402,
  },
};

function cors(res: Response) {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-PAYMENT, PAYMENT-SIGNATURE, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  return new Response(res.body, { status: res.status, headers });
}

export const Route = createFileRoute("/api/v1/")({
  server: {
    handlers: {
      OPTIONS: async () => cors(new Response(null, { status: 204 })),
      GET: async () => cors(Response.json(INDEX)),
    },
  },
});
