import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";

export const BASE_USDC_MAINNET: Address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const BASE_USDC_SEPOLIA: Address = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const PLAYABLE_ARENA_ABI = parseAbi([
  "function registerAgent(address agentAddress, string calldata metadataUri) external returns (uint256)",
  "function createMatch(bytes32 matchId, uint256 entryFee, uint8 maxPlayers, uint256 timeoutDuration) external",
  "function joinMatch(bytes32 matchId) external",
  "function settleMatchWithReputation(bytes32 matchId, address[] winners, uint256[] payouts, int256[] eloDeltas, int256[] pnlDeltas, uint256 feeAmount, uint256 deadline, bytes signature) external",
  "function emergencyRefund(bytes32 matchId) external",
  "function getAgentPassport(address agent) external view returns ((address agentAddress, uint256 tokenId, uint256 eloScore, uint32 totalMatches, uint32 wins, int256 totalPnlUsdc, uint32 sharpeIndexBps, uint32 brierScoreBps, uint8 tier, uint256 registeredAt, uint256 lastActiveAt, bool isSoulbound))",
  "function matches(bytes32 matchId) external view returns (bytes32 matchId, address creator, uint256 entryFee, uint8 maxPlayers, uint8 playerCount, uint256 totalPot, uint256 createdAt, uint256 timeoutAt, uint8 status)",
  "function getMatchPlayers(bytes32 matchId) external view returns (address[])",
  "function locked(uint256 tokenId) external view returns (bool)",
  "function totalAgentsRegistered() external view returns (uint256)",
  "event AgentRegistered(address indexed agentAddress, uint256 indexed tokenId, string metadataUri)",
  "event ReputationSignalRecorded(address indexed agentAddress, int256 eloDelta, int256 pnlDelta, uint256 newElo, uint8 newTier, bytes32 indexed matchId)",
  "event MatchCreated(bytes32 indexed matchId, address indexed creator, uint256 entryFee, uint8 maxPlayers, uint256 timeoutAt)",
  "event PlayerJoined(bytes32 indexed matchId, address indexed player, uint256 currentPot, uint8 playerCount)",
  "event MatchSettled(bytes32 indexed matchId, address[] winners, uint256[] payouts, uint256 protocolFee)",
]);

export function getRpcClient() {
  const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";
  const isSepolia = rpcUrl.includes("sepolia");
  const chain = isSepolia ? baseSepolia : base;

  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

export function getSignerWalletClient() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY as Hex | undefined;
  if (!privateKey) {
    return null;
  }

  const account = privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
  const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";
  const isSepolia = rpcUrl.includes("sepolia");
  const chain = isSepolia ? baseSepolia : base;

  return {
    account,
    client: createWalletClient({
      account,
      chain,
      transport: http(rpcUrl),
    }),
  };
}

export function getArenaContractAddress(): Address | null {
  const addr = process.env.ARENA_CONTRACT_ADDRESS as Address | undefined;
  if (!addr || !addr.startsWith("0x")) return null;
  return addr;
}
