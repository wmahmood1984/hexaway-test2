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
    //    address public feeder;

    struct Scheme {
        uint start;
        uint end;
        uint perToDepositor;
        uint perToReferrer;
    }

    struct Bid {
        uint id;
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

    struct GameResult2 {
        bool settled;
        uint8 winningColor;
        uint totalBidded;
        uint totalPayout;
        uint future1;
        uint future2;
        bool future3;
    }

    struct Winner {
        address user;
        uint amountWon;
        uint8 color;
        uint amount;
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
    uint public bidsIndex;
    GameResult2[] public gameResultsArray;

    struct Deposit {
        address depositor;
        uint amount;
        uint time;
        uint eventType;
        uint percentage;
    }

    mapping(address => Deposit[]) public userDepositArray;
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

        _createGames();
        setSettlers(_settler);
    }

    function setScheme(
        uint _start,
        uint _end,
        uint _perToDepositor,
        uint _perToReferrer
    ) public {
        require(
            msg.sender == 0xB066Ce4653576C310e9A8502e269fc54E32B28ab,
            "not authorized"
        );
        scheme = Scheme(_start, _end, _perToDepositor, _perToReferrer);
    }

    function setSettlers(address[] memory _settler) public onlyOwner {
        for (uint i = 0; i < _settler.length; i++) {
            settlers[_settler[i]] = true;
        }
    }

    function deposit(uint256 _amount) public {
        // USD minimum = $5 (18 decimals)
        uint256 minUsd = 3 ether;

        // Price = USD per HEXA (18 decimals)
        uint256 price = priceOracle.price(); // e.g. 0.01e18

        // Minimum HEXA required for $5
        uint256 minHexa = (minUsd * 1e18) / price;

        // Enforce minimum deposit
        require(_amount >= minHexa, "Minimum deposit is $3");

        // Allowance check must match _amount
        require(
            hexa.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );

        hexa.transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender] += _amount;
        Deposit memory dx1 = Deposit({
            amount: _amount,
            time: block.timestamp,
            depositor: msg.sender,
            eventType: 0,
            percentage: 0
        });
        userDepositArray[msg.sender].push(dx1);

        if (block.timestamp >= scheme.start && block.timestamp <= scheme.end) {
            uint256 depositorBonus = (_amount * scheme.perToDepositor) / 100;
            uint256 referrerBonus = (_amount * scheme.perToReferrer) / 100;

            balance[msg.sender] += depositorBonus;
            Deposit memory dx2 = Deposit({
                amount: (_amount * scheme.perToDepositor) / 100,
                time: block.timestamp,
                depositor: msg.sender,
                eventType: scheme.end,
                percentage: scheme.perToDepositor
            });
            userDepositArray[msg.sender].push(dx2);

            Ihelper.User memory u = helper.getUser(msg.sender);
            Deposit memory dx3 = Deposit({
                amount: (_amount * scheme.perToReferrer) / 100,
                time: block.timestamp,
                depositor: msg.sender,
                eventType: scheme.end,
                percentage: scheme.perToReferrer
            });
            userDepositArray[msg.sender].push(dx3);
            balance[u.referrer] += referrerBonus;
        }

        _distributeIncome(msg.sender, _amount);
    }

    function _createGames() internal {
        uint8[4] memory slotOptions = [3, 6, 9, 2];
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
                id: bidsIndex,
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
        bids.push(
            Bid({
                id: bidsIndex,
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
        bidsIndex++;
        totalSpent[msg.sender] += amount;
    }

    function _distributeIncome(address user, uint dist) internal {
        hexa.transfer(incomeWallet, (dist * 2) / 100);

        Ihelper.User memory u = helper.getUser(user);
        if (incomeEligible(u, u.referrer)) {
            hexa.transfer(u.referrer, (dist * 2) / 100);
        } else {
            hexa.transfer(incomeWallet, (dist * 2) / 100);
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
        uint winningMultiple = (gameId == 12 || gameId == 13) ? 18 : 20;
        require(g.active, "Game inactive");
        // require(!result.settled, "Already settled");

        uint bidLength = g.bids.length;
        uint slots = g.slots;
        delete result.winners;
        gameRan[gameId] = block.timestamp;

        // -------------------------
        // CASE 1: No bids
        // -------------------------
        if (bidLength == 0) {
            result.settled = true;
            result.winningColor = 0;
            result.totalBidded = 0;
            result.totalPayout = 0;

            delete g.bids;

            emit GameSettled(gameId, 0, 0);
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
                uint winAmount = (b.amount * winningMultiple) / 10;
                uint id = b.id;
                b.won = true;
                b.settled = true;
                bids[id].won = true;
                bids[id].settled = true;

                hexa.transfer(b.user, winAmount);

                totalWon[b.user] += winAmount;

                payout += winAmount;

                result.winners.push(
                    Winner({
                        user: b.user,
                        amountWon: winAmount,
                        color: b.color,
                        amount: b.amount
                    })
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
                uint id = b.id;
                bids[id].won = false;
                bids[id].settled = true;
                b.won = false;
                b.settled = true;

                totalLost[b.user] += b.amount;
                result.winners.push(
                    Winner({
                        user: b.user,
                        amountWon: 0,
                        color: b.color,
                        amount: b.amount
                    })
                );

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
        delete g.bids;
        emit GameSettled(gameId, winningColor, payout);

        GameResult2 memory tx1 = GameResult2({
            settled: result.settled,
            winningColor: result.winningColor,
            totalBidded: result.totalBidded,
            totalPayout: result.totalPayout,
            future1: block.timestamp,
            future2: result.future2,
            future3: result.future3
        });
        gameResultsArray.push(tx1);
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
        uint _winnerAchievement
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
        require(_winner != address(0), "invalid address");

        hexa.transfer(_winner, typeAmount[_type]);
        userRewardTypeAmount[_winner][_type] += typeAmount[_type];
        Reward memory tx1 = Reward(
            block.timestamp,
            _type,
            typeAmount[_type],
            _winnerAchievement,
            _winner,
            0,
            0
        );
        userRewardArray[_winner].push(tx1);
        rewardInfo[_type] = tx1;
        typeAmount[_type] = 0;
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

    function getGameResult(uint _id) public view returns (GameResult memory) {
        return gameResults[_id];
    }

    function getGameResult() public view returns (GameResult2[] memory) {
        return gameResultsArray;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function getUserDepositArray(
        address _user
    ) public view returns (Deposit[] memory) {
        return userDepositArray[_user];
    }
}

interface IGame {
    struct Bid {
        uint id;
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
        uint8 color;
        uint amount;
    }

    function getBids() external view returns (Bid[] memory);
    function getGameResult(uint _id) external view returns (GameResult memory);
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
        return game.getGameResult(gameId).winners.length;
    }

    function getGameWinnerByIndex(
        uint gameId,
        uint index
    ) external view returns (address user, uint amountWon) {
        IGame.Winner memory w = game.getGameResult(gameId).winners[index];
        return (w.user, w.amountWon);
    }

    function getUserWinningAmount(
        uint gameId,
        address user
    ) external view returns (uint, bool, uint8, uint) {
        IGame.Winner[] memory winners = game.getGameResult(gameId).winners;
        bool isInTheGame;
        uint winnerAmount;
        uint8 color;
        uint amount;

        for (uint i = 0; i < winners.length; i++) {
            if (winners[i].user == user) {
                isInTheGame = true;
                color = winners[i].color;
                winnerAmount += winners[i].amountWon;
                amount += winners[i].amount;
            }
        }

        return (winnerAmount, isInTheGame, color, winnerAmount / 2);
    }
}
