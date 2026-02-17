// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface Ihelper {
    struct UserDetails {
        uint userJoiningTime;
        uint userTradingTime;
        uint userTradingLimitTime;
        uint userLimitUtilized;
        uint tradingLevelBonus;
        uint packageLevelBonus;
        uint tradeXHours;
        uint tradingReferralBonus;
        uint packageReferralBonus;
        uint selfTradingProfit;
        uint packageUpgraded;
        uint future1;
        uint future2;
        uint tradeYHours;
    }

    struct User {
        address referrer;
        address parent;
        address[] children;
        address[] indirect;
        address[] direct;
        bool registered;
        UserDetails data;
    }

    struct Package {
        uint id;
        uint price;
        uint time;
        uint team;
        uint limit;
        uint levelUnlock;
        uint8 future;
    }

    function getUser(address _user) external view returns (User memory);
    function getUplines(address user) external view returns (address[] memory);
    function userPackage(address user) external view returns (Package memory);
}

interface IpriceOracle {
    function price() external view returns (uint256);
}

contract GameEngine is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public hexa;
    address public incomeWallet;
    address public settler;
    Ihelper public helper;
    IpriceOracle public priceOracle;
    address public feeder;

    struct Scheme {
        uint start;
        uint end;
        uint perToDepositor;
        uint perToReferrer;
    }

    struct Bid {
        address user;
        uint amount;
        uint8 color;
        uint time;
        uint gameId;
        bool won;
        uint8 duration;
        uint8 slots;
        bool settled;
    }

    struct Game {
        uint8 slots; // 3,6,9
        uint8 duration; // 1,3,5,10 minutes
        Bid[] bids;
        bool active;
    }

    Game[] public games;
    Bid[] public bids;

    mapping(address => uint) public totalSpent;
    mapping(address => uint) public totalWon;
    mapping(uint => uint) public gameRan;
    mapping(address => uint) public balance;
    mapping(uint => uint) public typeAmount;
    Scheme public scheme;
    mapping(address => bool) public settlers;
    event GameCreated(uint indexed gameId, uint8 slots, uint8 duration);
    event GameSettled(uint indexed gameId, uint8 winningColor, uint payout);
    uint public totalWon1;
    uint public totalLost1;
    mapping(address => mapping(uint => uint)) public userRewardTypeAmount;
    mapping(address => uint) public totalLost;

    struct Reward {
        uint time;
        uint _type;
        uint amount;
        uint achievement;
        address user;
        uint future1;
        uint future2;
    }
    mapping(address => Reward[]) public userRewardArray;
    mapping(uint => Reward) public rewardInfo;
    mapping(address => uint[]) public userGameBidIndexes;
    struct GameResult {
        bool settled;
        uint8 winningColor;
        uint totalBidded;
        uint totalPayout;
        Winner[] winners;
        uint future1;
        uint future2;
        bool future3;
    }

    struct Winner {
        address user;
        uint amountWon;
    }

    mapping(uint => GameResult) public gameResults;
    event BidSettled(
        uint indexed gameId,
        address indexed user,
        uint amount,
        uint8 color,
        bool won,
        uint payout
    );
    constructor() {
        _disableInitializers();
    }

    function initialize(
        // address _hexa,
        // address _incomeWallet,
        // address _helper,
        address[] memory _settler
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        hexa = IERC20(0x309D64381Ea67edbe9E09e719b398f0060AD4FCf);
        incomeWallet = 0x0872c88D2Ca157e4C6221c6B55BeAeba64848Df4;
        helper = Ihelper(0xd3120EF4eFA25ABE521761D3aEC8c7D87bAc5d5f);
        settler = 0x8397d56A9bec2155E63F62133C8fbDA30C61A7eF;
        priceOracle = IpriceOracle(0x6176417d8Ab5232175FFEa27b26b2dCeDf09376B);
        feeder = 0x27a25668DD7647b2aa19dAfa5c09595351565838;

        _createGames();
        setSettlers(_settler);
    }

    function setScheme(
        uint _start,
        uint _end,
        uint _perToDepositor,
        uint _perToReferrer
    ) public onlyOwner {
        scheme = Scheme(_start, _end, _perToDepositor, _perToReferrer);
    }

    function setSettlers(address[] memory _settler) public onlyOwner {
        for (uint i = 0; i < _settler.length; i++) {
            settlers[_settler[i]] = true;
        }
    }

    function deposit(uint256 _amount) public {
        // USD minimum = $5 (18 decimals)
        uint256 minUsd = 5 ether;

        // Price = USD per HEXA (18 decimals)
        uint256 price = priceOracle.price(); // e.g. 0.01e18

        // Minimum HEXA required for $5
        uint256 minHexa = (minUsd * 1e18) / price;

        // Enforce minimum deposit
        require(_amount >= minHexa, "Minimum deposit is $5");

        // Allowance check must match _amount
        require(
            hexa.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );

        hexa.transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender] += _amount;

        if (block.timestamp >= scheme.start && block.timestamp <= scheme.end) {
            uint256 depositorBonus = (_amount * scheme.perToDepositor) / 100;
            uint256 referrerBonus = (_amount * scheme.perToReferrer) / 100;

            balance[msg.sender] += depositorBonus;

            Ihelper.User memory u = helper.getUser(msg.sender);
            balance[u.referrer] += referrerBonus;
        }

        _distributeIncome(msg.sender, _amount);
    }

    function _createGames() internal {
        uint8[3] memory slotOptions = [3, 6, 9];
        uint8[4] memory timeOptions = [1, 3, 5, 10];

        for (uint i = 0; i < slotOptions.length; i++) {
            for (uint j = 0; j < timeOptions.length; j++) {
                games.push();
                Game storage g = games[games.length - 1];
                g.slots = slotOptions[i];
                g.duration = timeOptions[j];
                g.active = true;

                emit GameCreated(
                    games.length - 1,
                    slotOptions[i],
                    timeOptions[j]
                );
            }
        }
    }

    function placeBid(uint gameId, uint amount, uint8 color) external {
        Game storage g = games[gameId];

        require(g.active, "Game inactive");
        require(color < g.slots, "Invalid color");
        require(amount > 0, "Zero bid");
        require(balance[msg.sender] >= amount, "Insufficient balance");

        balance[msg.sender] -= amount;

        g.bids.push(
            Bid({
                user: msg.sender,
                amount: amount,
                color: color,
                time: block.timestamp,
                gameId: gameId,
                won: false,
                duration: g.duration,
                slots: g.slots,
                settled: false
            })
        );

        // store index of this bid for user
        userGameBidIndexes[msg.sender].push(g.bids.length - 1);

        totalSpent[msg.sender] += amount;
    }

    function _distributeIncome(address user, uint dist) internal {
        hexa.transfer(incomeWallet, (dist * 2) / 100);

        Ihelper.User memory u = helper.getUser(user);
        if (incomeEligible(u, u.referrer)) {
            hexa.transfer(u.referrer, (dist * 2) / 100);
        }

        address[] memory uplines = helper.getUplines(user);
        _processLevelIncome(uplines, (dist * 13) / 100);
        typeAmount[1] += (dist * 5) / 1000;
        typeAmount[2] += (dist * 5) / 1000;
        typeAmount[3] += (dist * 5) / 1000;
        typeAmount[4] += (dist * 5) / 1000;
        typeAmount[5] += (dist * 5) / 1000;
        typeAmount[6] += (dist * 5) / 1000;
    }

    function settleGame(uint gameId) external {
        Game storage g = games[gameId];
        GameResult storage result = gameResults[gameId];

        require(g.active, "Game inactive");
        require(!result.settled, "Already settled");

        uint bidLength = g.bids.length;
        uint slots = g.slots;

        gameRan[gameId] = block.timestamp;

        // -------------------------
        // CASE 1: No bids
        // -------------------------
        if (bidLength == 0) {
            result.settled = true;
            result.winningColor = type(uint8).max;
            result.totalBidded = 0;
            result.totalPayout = 0;

            emit GameSettled(gameId, type(uint8).max, 0);
            return;
        }

        uint[] memory totals = new uint[](slots);
        uint totalBidded;

        // -------------------------
        // STEP 1 — Calculate totals
        // -------------------------
        for (uint i = 0; i < bidLength; i++) {
            Bid storage b = g.bids[i];
            totals[b.color] += b.amount;
            totalBidded += b.amount;
        }

        // -------------------------
        // STEP 2 — Zero-color rule
        // -------------------------
        for (uint8 c = 0; c < slots; c++) {
            if (totals[c] == 0) {
                for (uint i = 0; i < bidLength; i++) {
                    Bid storage b = g.bids[i];

                    b.won = false;
                    b.settled = true;

                    totalLost[b.user] += b.amount;

                    emit BidSettled(
                        gameId,
                        b.user,
                        b.amount,
                        b.color,
                        false,
                        0
                    );
                }

                uint income = (totalBidded * 80) / 100;

                if (income > 0) {
                    hexa.transfer(incomeWallet, income);
                }

                result.settled = true;
                result.winningColor = type(uint8).max;
                result.totalBidded = totalBidded;
                result.totalPayout = 0;

                emit GameSettled(gameId, type(uint8).max, 0);
                return;
            }
        }

        // -------------------------
        // STEP 3 — Find lowest pool
        // -------------------------
        uint8 winningColor;
        uint lowest = totals[0];

        for (uint8 c = 1; c < slots; c++) {
            if (totals[c] < lowest) {
                lowest = totals[c];
                winningColor = c;
            }
        }

        // -------------------------
        // STEP 4 — Settle bids
        // -------------------------
        uint payout;

        for (uint i = 0; i < bidLength; i++) {
            Bid storage b = g.bids[i];

            if (b.color == winningColor) {
                uint winAmount = b.amount * 2;

                b.won = true;
                b.settled = true;

                hexa.transfer(b.user, winAmount);

                totalWon[b.user] += winAmount;

                payout += winAmount;

                result.winners.push(
                    Winner({user: b.user, amountWon: winAmount})
                );

                emit BidSettled(
                    gameId,
                    b.user,
                    b.amount,
                    b.color,
                    true,
                    winAmount
                );
            } else {
                b.won = false;
                b.settled = true;

                totalLost[b.user] += b.amount;

                emit BidSettled(gameId, b.user, b.amount, b.color, false, 0);
            }
        }

        // -------------------------
        // STEP 5 — Income logic
        // -------------------------
        uint remaining = totalBidded - payout;

        if (remaining > 0) {
            uint income = (remaining * 80) / 100;

            if (income > 0) {
                hexa.transfer(incomeWallet, income);
            }
        }

        // -------------------------
        // FINAL RESULT SAVE
        // -------------------------
        result.settled = true;
        result.winningColor = winningColor;
        result.totalBidded = totalBidded;
        result.totalPayout = payout;

        emit GameSettled(gameId, winningColor, payout);
    }

    function _processLevelIncome(
        address[] memory uplines,
        uint amount
    ) internal {
        uint per = amount / 25;
        uint paid;

        for (uint i; i < uplines.length; i++) {
            Ihelper.User memory u = helper.getUser(uplines[i]);
            if (u.direct.length >= 2 && incomeEligible(u, uplines[i])) {
                hexa.transfer(uplines[i], per);
                paid++;
            }
        }

        uint leftover = amount - (paid * per);
        if (leftover > 0) hexa.transfer(incomeWallet, leftover);
    }

    function incomeEligible(
        Ihelper.User memory user,
        address addr
    ) public view returns (bool) {
        return
            block.timestamp - user.data.packageUpgraded <= 45 minutes &&
            helper.userPackage(addr).id > 0 &&
            block.timestamp - user.data.userTradingTime <= 2 hours;
    }

    function getBids() public view returns (Bid[] memory) {
        return bids;
    }

    function distributeReward(
        uint _type,
        address _winner,
        address _runnerup,
        address _2ndRunnerup,
        uint _winnerAchievement,
        uint _runnerupAchievement,
        uint _2ndRunnerupAchievement
    ) public {
        require(settlers[msg.sender], "not authorized");
        require(
            _type == 1 ||
                _type == 2 ||
                _type == 3 ||
                _type == 4 ||
                _type == 5 ||
                _type == 6,
            "invalid type"
        );
        require(
            _winner != address(0) &&
                _runnerup != address(0) &&
                _2ndRunnerup != address(0),
            "invalid address"
        );
        require(
            _winner != _runnerup &&
                _runnerup != _2ndRunnerup &&
                _winner != _2ndRunnerup,
            "invalid address"
        );
        hexa.transferFrom(feeder, _winner, (typeAmount[_type] * 50) / 100);
        userRewardTypeAmount[_winner][_type] += (typeAmount[_type] * 50) / 100;
        hexa.transferFrom(feeder, _runnerup, (typeAmount[_type] * 30) / 100);
        userRewardTypeAmount[_runnerup][_type] +=
            (typeAmount[_type] * 30) / 100;
        hexa.transferFrom(feeder, _2ndRunnerup, (typeAmount[_type] * 20) / 100);
        userRewardTypeAmount[_2ndRunnerup][_type] +=
            (typeAmount[_type] * 20) / 100;
        Reward memory tx1 = Reward(
            block.timestamp,
            _type,
            (typeAmount[_type] * 50) / 100,
            _winnerAchievement,
            _winner,
            0,
            0
        );
        userRewardArray[_winner].push(tx1);
        Reward memory tx2 = Reward(
            block.timestamp,
            _type,
            (typeAmount[_type] * 30) / 100,
            _runnerupAchievement,
            _runnerup,
            0,
            0
        );
        userRewardArray[_runnerup].push(tx2);
        Reward memory tx3 = Reward(
            block.timestamp,
            _type,
            (typeAmount[_type] * 20) / 100,
            _2ndRunnerupAchievement,
            _2ndRunnerup,
            0,
            0
        );
        userRewardArray[_2ndRunnerup].push(tx3);
        rewardInfo[_type] = tx1;
    }

    function getUserGameBids(
        address user,
        uint gameId
    ) external view returns (Bid[] memory) {
        Game storage g = games[gameId];

        uint count;

        for (uint i = 0; i < g.bids.length; i++)
            if (g.bids[i].user == user) count++;

        Bid[] memory result = new Bid[](count);

        uint j;

        for (uint i = 0; i < g.bids.length; i++)
            if (g.bids[i].user == user) result[j++] = g.bids[i];

        return result;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

interface IGame {
    struct Bid {
        address user;
        uint amount;
        uint8 color;
        uint time;
        uint gameId;
        bool won;
        uint8 duration;
        uint8 slots;
        bool settled;
    }

    struct Game {
        uint8 slots; // 3,6,9
        uint8 duration; // 1,3,5,10 minutes
        Bid[] bids;
        bool active;
    }

    struct GameResult {
        bool settled;
        uint8 winningColor;
        uint totalBidded;
        uint totalPayout;
        Winner[] winners;
        uint future1;
        uint future2;
        bool future3;
    }

    struct Winner {
        address user;
        uint amountWon;
    }

    function getBids() external view returns (Bid[] memory);
    function gameResults(uint) external view returns (GameResult memory);
}

contract DataFetcherForGame is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    IGame public game;

    // address[] public oldUsers;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _game) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        game = IGame(_game);
    }

    function updateHelper(address _helper) external onlyOwner {
        game = IGame(_helper);
    }
    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function getBidsByUser(
        address _user
    ) external view returns (IGame.Bid[] memory) {
        uint count;
        IGame.Bid[] memory allBids = game.getBids();
        uint length = allBids.length;

        // First pass: count matching bids
        for (uint i; i < length; i++) {
            if (allBids[i].user == _user) {
                count++;
            }
        }

        // Create result array
        IGame.Bid[] memory result = new IGame.Bid[](count);

        // Second pass: populate result
        uint index;
        for (uint i; i < length; i++) {
            if (allBids[i].user == _user) {
                result[index] = allBids[i];
                index++;
            }
        }

        return result;
    }

    function getGameWinnersCount(uint gameId) external view returns (uint) {
        return game.gameResults(gameId).winners.length;
    }

    function getGameWinnerByIndex(
        uint gameId,
        uint index
    ) external view returns (address user, uint amountWon) {
        IGame.Winner memory w = game.gameResults(gameId).winners[index];
        return (w.user, w.amountWon);
    }

    function getUserWinningAmount(
        uint gameId,
        address user
    ) external view returns (uint) {
        IGame.Winner[] memory winners = game.gameResults(gameId).winners;

        for (uint i = 0; i < winners.length; i++) {
            if (winners[i].user == user) {
                return winners[i].amountWon;
            }
        }

        return 0;
    }
}
