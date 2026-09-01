// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IERC20
 * @notice Minimal interface for USDC / ERC20 token interactions.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

/**
 * @title IERC5192
 * @notice ERC-5192 Minimal Soulbound NFT Interface for non-transferable AI Agent Passports.
 */
interface IERC5192 {
    event Locked(uint256 indexed tokenId);
    event Unlocked(uint256 indexed tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

/**
 * @title IERC8004ReputationRegistry
 * @notice Standard interface for on-chain AI Agent Identity & Reputation recording.
 */
interface IERC8004ReputationRegistry {
    enum QuantTier { Bronze, Silver, Gold, Diamond }

    struct AgentPassport {
        address agentAddress;
        uint256 tokenId;
        uint256 eloScore;
        uint32 totalMatches;
        uint32 wins;
        int256 totalPnlUsdc;
        uint32 sharpeIndexBps;
        uint32 brierScoreBps;
        QuantTier tier;
        uint256 registeredAt;
        uint256 lastActiveAt;
        bool isSoulbound;
    }

    event AgentRegistered(address indexed agentAddress, uint256 indexed tokenId, string metadataUri);
    event ReputationSignalRecorded(
        address indexed agentAddress,
        int256 eloDelta,
        int256 pnlDelta,
        uint256 newElo,
        QuantTier newTier,
        bytes32 indexed matchId
    );
}

/**
 * @title SafeERC20
 * @notice Safe operations around ERC20 transfers without revert assumption bugs.
 */
library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(token.transfer.selector, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER_FAILED");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(token.transferFrom.selector, from, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TRANSFER_FROM_FAILED");
    }
}

/**
 * @title PlayableArena
 * @notice Verifiable Financial Simulation Arena & ERC-8004 / ERC-5192 On-Chain Reputation Registry on Base.
 * @dev Combines non-custodial USDC escrows, EIP-712 settlement verification, and soulbound agent reputation scoring.
 */
contract PlayableArena is IERC5192, IERC8004ReputationRegistry {
    using SafeERC20 for IERC20;

    enum MatchStatus { None, Open, Active, Settled, Cancelled }

    struct Match {
        bytes32 matchId;
        address creator;
        uint256 entryFee;
        uint8 maxPlayers;
        uint8 playerCount;
        uint256 totalPot;
        uint256 createdAt;
        uint256 timeoutAt;
        MatchStatus status;
    }

    IERC20 public immutable usdc;
    address public owner;
    address public settlementSigner;
    address public treasury;
    uint256 public protocolFeeBps; // Base fee in basis points (e.g. 250 = 2.5%)
    uint256 public constant MAX_FEE_BPS = 1000; // 10% max fee safety cap

    uint256 public totalAgentsRegistered;
    uint256 private _tokenCounter;

    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant SETTLEMENT_TYPEHASH = keccak256(
        "SettleMatch(bytes32 matchId,address[] winners,uint256[] payouts,int256[] eloDeltas,int256[] pnlDeltas,uint256 feeAmount,uint256 nonce,uint256 deadline)"
    );

    mapping(bytes32 => Match) public matches;
    mapping(bytes32 => mapping(address => bool)) public hasJoined;
    mapping(bytes32 => address[]) internal matchPlayers;
    mapping(address => uint256) public nonces;

    // Agent Passport & Reputation Mappings (ERC-8004 + ERC-5192)
    mapping(address => AgentPassport) public agentPassports;
    mapping(uint256 => address) public tokenToAgent;
    mapping(address => string) public agentMetadataUris;
    address[] public registeredAgentList;

    // Mutex lock for reentrancy safety
    uint256 private _status;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    event MatchCreated(bytes32 indexed matchId, address indexed creator, uint256 entryFee, uint8 maxPlayers, uint256 timeoutAt);
    event PlayerJoined(bytes32 indexed matchId, address indexed player, uint256 currentPot, uint8 playerCount);
    event MatchSettled(bytes32 indexed matchId, address[] winners, uint256[] payouts, uint256 protocolFee);
    event MatchCancelled(bytes32 indexed matchId, string reason);
    event EmergencyRefundClaimed(bytes32 indexed matchId, address indexed player, uint256 amount);
    event SignerUpdated(address indexed oldSigner, address indexed newSigner);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event FeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "REENTRANCY");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address _usdc, address _signer, address _treasury, uint256 _feeBps) {
        require(_usdc != address(0), "INVALID_USDC");
        require(_signer != address(0), "INVALID_SIGNER");
        require(_treasury != address(0), "INVALID_TREASURY");
        require(_feeBps <= MAX_FEE_BPS, "EXCESSIVE_FEE");

        usdc = IERC20(_usdc);
        owner = msg.sender;
        settlementSigner = _signer;
        treasury = _treasury;
        protocolFeeBps = _feeBps;
        _status = _NOT_ENTERED;

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("PlayableArena")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    /**
     * @notice ERC-5192 Soulbound query. Agent Passports are permanently locked & non-transferable.
     */
    function locked(uint256 tokenId) external view override returns (bool) {
        require(tokenToAgent[tokenId] != address(0), "NONEXISTENT_TOKEN");
        return true;
    }

    /**
     * @notice Register an autonomous AI Agent to receive an ERC-8004 Identity & ERC-5192 Soulbound Passport.
     */
    function registerAgent(address agentAddress, string calldata metadataUri) external returns (uint256) {
        require(agentAddress != address(0), "INVALID_AGENT");
        require(agentPassports[agentAddress].registeredAt == 0, "ALREADY_REGISTERED");

        _tokenCounter++;
        uint256 tokenId = _tokenCounter;

        agentPassports[agentAddress] = AgentPassport({
            agentAddress: agentAddress,
            tokenId: tokenId,
            eloScore: 1200, // Standard baseline Elo
            totalMatches: 0,
            wins: 0,
            totalPnlUsdc: 0,
            sharpeIndexBps: 100, // 1.00 base
            brierScoreBps: 5000,
            tier: QuantTier.Bronze,
            registeredAt: block.timestamp,
            lastActiveAt: block.timestamp,
            isSoulbound: true
        });

        tokenToAgent[tokenId] = agentAddress;
        agentMetadataUris[agentAddress] = metadataUri;
        registeredAgentList.push(agentAddress);
        totalAgentsRegistered++;

        emit Locked(tokenId);
        emit AgentRegistered(agentAddress, tokenId, metadataUri);

        return tokenId;
    }

    /**
     * @notice Create a new financial simulation match escrow.
     */
    function createMatch(
        bytes32 matchId,
        uint256 entryFee,
        uint8 maxPlayers,
        uint256 timeoutDuration
    ) external nonReentrant {
        require(matches[matchId].status == MatchStatus.None, "MATCH_EXISTS");
        require(maxPlayers >= 2 && maxPlayers <= 16, "INVALID_MAX_PLAYERS");
        require(timeoutDuration >= 120 && timeoutDuration <= 86400, "INVALID_TIMEOUT");

        uint256 timeoutAt = block.timestamp + timeoutDuration;

        matches[matchId] = Match({
            matchId: matchId,
            creator: msg.sender,
            entryFee: entryFee,
            maxPlayers: maxPlayers,
            playerCount: 0,
            totalPot: 0,
            createdAt: block.timestamp,
            timeoutAt: timeoutAt,
            status: MatchStatus.Open
        });

        emit MatchCreated(matchId, msg.sender, entryFee, maxPlayers, timeoutAt);

        if (entryFee > 0) {
            _join(matchId, msg.sender);
        }
    }

    /**
     * @notice Join an open simulation match.
     */
    function joinMatch(bytes32 matchId) external nonReentrant {
        _join(matchId, msg.sender);
    }

    function _join(bytes32 matchId, address player) internal {
        Match storage m = matches[matchId];
        require(m.status == MatchStatus.Open, "MATCH_NOT_OPEN");
        require(!hasJoined[matchId][player], "ALREADY_JOINED");
        require(m.playerCount < m.maxPlayers, "TABLE_FULL");

        if (m.entryFee > 0) {
            usdc.safeTransferFrom(player, address(this), m.entryFee);
            m.totalPot += m.entryFee;
        }

        hasJoined[matchId][player] = true;
        matchPlayers[matchId].push(player);
        m.playerCount += 1;

        if (m.playerCount == m.maxPlayers) {
            m.status = MatchStatus.Active;
        }

        emit PlayerJoined(matchId, player, m.totalPot, m.playerCount);
    }

    /**
     * @notice Authoritative EIP-712 settlement with simultaneous ERC-8004 reputation updates.
     */
    function settleMatchWithReputation(
        bytes32 matchId,
        address[] calldata winners,
        uint256[] calldata payouts,
        int256[] calldata eloDeltas,
        int256[] calldata pnlDeltas,
        uint256 feeAmount,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant {
        require(block.timestamp <= deadline, "SIGNATURE_EXPIRED");
        Match storage m = matches[matchId];
        require(m.status == MatchStatus.Open || m.status == MatchStatus.Active, "INVALID_MATCH_STATUS");
        require(winners.length == payouts.length, "MISMATCHED_WINNERS");
        require(matchPlayers[matchId].length == eloDeltas.length, "MISMATCHED_DELTAS");
        require(matchPlayers[matchId].length == pnlDeltas.length, "MISMATCHED_PNL");

        bytes32 structHash = keccak256(
            abi.encode(
                SETTLEMENT_TYPEHASH,
                matchId,
                keccak256(abi.encodePacked(winners)),
                keccak256(abi.encodePacked(payouts)),
                keccak256(abi.encodePacked(eloDeltas)),
                keccak256(abi.encodePacked(pnlDeltas)),
                feeAmount,
                nonces[settlementSigner]++,
                deadline
            )
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        address recovered = _recoverSigner(digest, signature);
        require(recovered == settlementSigner, "INVALID_SIGNATURE");

        uint256 totalPayout = feeAmount;
        for (uint256 i = 0; i < payouts.length; i++) {
            totalPayout += payouts[i];
        }
        require(totalPayout <= m.totalPot, "EXCEEDS_MATCH_POT");

        m.status = MatchStatus.Settled;

        // 1. Protocol Fee Transfer
        if (feeAmount > 0) {
            usdc.safeTransfer(treasury, feeAmount);
        }

        // 2. Winner Payouts
        for (uint256 i = 0; i < winners.length; i++) {
            if (payouts[i] > 0) {
                usdc.safeTransfer(winners[i], payouts[i]);
            }
        }

        // 3. Update ERC-8004 Agent Reputations for all participants
        address[] memory players = matchPlayers[matchId];
        for (uint256 i = 0; i < players.length; i++) {
            address p = players[i];
            _updateAgentReputation(p, eloDeltas[i], pnlDeltas[i], matchId, _isWinner(p, winners));
        }

        emit MatchSettled(matchId, winners, payouts, feeAmount);
    }

    function _isWinner(address player, address[] calldata winners) internal pure returns (bool) {
        for (uint256 i = 0; i < winners.length; i++) {
            if (winners[i] == player) return true;
        }
        return false;
    }

    function _updateAgentReputation(
        address agent,
        int256 eloDelta,
        int256 pnlDelta,
        bytes32 matchId,
        bool won
    ) internal {
        AgentPassport storage passport = agentPassports[agent];
        if (passport.registeredAt == 0) {
            // Auto-enroll agent if not pre-registered
            _tokenCounter++;
            passport.agentAddress = agent;
            passport.tokenId = _tokenCounter;
            passport.eloScore = 1200;
            passport.isSoulbound = true;
            passport.registeredAt = block.timestamp;
            tokenToAgent[_tokenCounter] = agent;
            registeredAgentList.push(agent);
            totalAgentsRegistered++;
            emit Locked(_tokenCounter);
        }

        passport.totalMatches++;
        if (won) passport.wins++;
        passport.totalPnlUsdc += pnlDelta;
        passport.lastActiveAt = block.timestamp;

        // Calculate new Elo with floor at 100
        if (eloDelta < 0 && uint256(-eloDelta) >= passport.eloScore) {
            passport.eloScore = 100;
        } else if (eloDelta < 0) {
            passport.eloScore -= uint256(-eloDelta);
        } else {
            passport.eloScore += uint256(eloDelta);
        }

        // Tier Determination
        if (passport.eloScore >= 2000) {
            passport.tier = QuantTier.Diamond;
        } else if (passport.eloScore >= 1600) {
            passport.tier = QuantTier.Gold;
        } else if (passport.eloScore >= 1300) {
            passport.tier = QuantTier.Silver;
        } else {
            passport.tier = QuantTier.Bronze;
        }

        emit ReputationSignalRecorded(
            agent,
            eloDelta,
            pnlDelta,
            passport.eloScore,
            passport.tier,
            matchId
        );
    }

    /**
     * @notice Permissionless emergency refund on match timeout.
     */
    function emergencyRefund(bytes32 matchId) external nonReentrant {
        Match storage m = matches[matchId];
        require(m.status == MatchStatus.Open, "REFUND_UNAVAILABLE");
        require(block.timestamp > m.timeoutAt, "TIMEOUT_NOT_REACHED");
        require(hasJoined[matchId][msg.sender], "NOT_A_PARTICIPANT");

        hasJoined[matchId][msg.sender] = false;
        m.playerCount -= 1;

        if (m.entryFee > 0) {
            m.totalPot -= m.entryFee;
            usdc.safeTransfer(msg.sender, m.entryFee);
        }

        if (m.playerCount == 0) {
            m.status = MatchStatus.Cancelled;
            emit MatchCancelled(matchId, "TIMEOUT_EMPTY_REFUNDED");
        }

        emit EmergencyRefundClaimed(matchId, msg.sender, m.entryFee);
    }

    function getAgentPassport(address agent) external view returns (AgentPassport memory) {
        return agentPassports[agent];
    }

    function getMatchPlayers(bytes32 matchId) external view returns (address[] memory) {
        return matchPlayers[matchId];
    }

    function getRegisteredAgentsCount() external view returns (uint256) {
        return registeredAgentList.length;
    }

    function setSettlementSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "INVALID_SIGNER");
        emit SignerUpdated(settlementSigner, _signer);
        settlementSigner = _signer;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "INVALID_TREASURY");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function setProtocolFeeBps(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "EXCESSIVE_FEE");
        emit FeeUpdated(protocolFeeBps, _feeBps);
        protocolFeeBps = _feeBps;
    }

    function _recoverSigner(bytes32 digest, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "INVALID_SIG_LENGTH");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        if (v < 27) v += 27;
        return ecrecover(digest, v, r, s);
    }
}
