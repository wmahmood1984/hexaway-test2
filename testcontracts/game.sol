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
   mapping(uint=>Reward) public rewardInfo;
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

        require(
            balance[msg.sender] >= amount,
            "balance should be more than amount"
        );
        balance[msg.sender] -= amount;
        Bid memory tx1 = Bid(
            msg.sender,
            amount,
            color,
            block.timestamp,
            gameId,
            false,
            g.duration,
            g.slots,
            false
        );
        g.bids.push(tx1);
        bids.push(tx1);
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

    // function settleGame(uint gameId) external {
    //     // require(msg.sender == settler, "Unauthorized");
    //     gameRan[gameId] = block.timestamp;
    //     Game storage g = games[gameId];
    //     if (g.bids.length == 0) {
    //         emit GameSettled(gameId, type(uint8).max, 0);
    //         return;
    //     }

    //     uint[] memory totals = new uint[](g.slots);
    //     uint totalBidded;
    //     for (uint i; i < g.bids.length; i++) {
    //         totals[g.bids[i].color] += g.bids[i].amount;
    //         totalBidded += g.bids[i].amount;
    //     }

    //     // RULE 1: zero-bid color => no winners
    //     for (uint8 c = 0; c < g.slots; c++) {
    //         if (totals[c] == 0) {
    //             uint bal = hexa.balanceOf(address(this));
    //             if (bal > 0)
    //                 hexa.transfer(incomeWallet, (totalBidded * 80) / 100);

    //             delete g.bids;
    //             emit GameSettled(gameId, type(uint8).max, 0);
    //             return;
    //         }
    //     }

    //     // RULE 2: lowest total wins
    //     uint8 winningColor = 0;
    //     uint lowest = totals[0];

    //     for (uint8 c = 1; c < g.slots; c++) {
    //         if (totals[c] < lowest) {
    //             lowest = totals[c];
    //             winningColor = c;
    //         }
    //     }

    //     uint payout;
    //     for (uint i; i < g.bids.length; i++) {
    //         Bid memory b = g.bids[i];
    //         if (b.color == winningColor) {
    //             uint win = b.amount * 2;
    //             hexa.transfer(b.user, win);
    //             totalWon[b.user] += win;
    //             payout += win;
    //         }
    //     }

    //     uint remaining = ((totalBidded - payout) * 80) / 100;
    //     if (remaining > 0) hexa.transfer(incomeWallet, remaining);

    //     delete g.bids;
    //     emit GameSettled(gameId, winningColor, payout);
    // }

    function settleGame(uint gameId) external {
        Game storage g = games[gameId];
        // Bid[] storage bids = g.bids;
        uint bidLength = bids.length;

        gameRan[gameId] = block.timestamp;

        if (bidLength == 0) {
            emit GameSettled(gameId, type(uint8).max, 0);
            return;
        }

        uint slots = g.slots;
        uint[] memory totals = new uint[](slots);
        uint totalBidded;

        // ---- 1️⃣ Calculate totals ----
        for (uint i = 0; i < bidLength; i++) {
            Bid storage b = bids[i];
            totals[b.color] += b.amount;
            totalBidded += b.amount;
        }

        // ---- 2️⃣ Check zero-bid color rule ----
        for (uint8 c = 0; c < slots; c++) {
            if (totals[c] == 0) {
                // mark all bids as settled and lost
                for (uint i = 0; i < bidLength; i++) {
                    Bid storage b = bids[i];
                    b.won = false;
                    b.settled = true;
                    totalLost[b.user] += b.amount;
                }

                uint income = (totalBidded * 80) / 100;
                totalLost1 += totalBidded;
                if (income > 0) {
                    hexa.transfer(incomeWallet, income);
                }

                delete g.bids;

                emit GameSettled(gameId, type(uint8).max, 0);
                return;
            }
        }

        // ---- 3️⃣ Find winning color ----
        uint8 winningColor;
        uint lowest = totals[0];

        for (uint8 c = 1; c < slots; c++) {
            uint t = totals[c];
            if (t < lowest) {
                lowest = t;
                winningColor = c;
            }
        }

        // ---- 4️⃣ Settle bids and pay winners ----
        uint payout;

        for (uint i; i < bidLength; i++) {
            Bid storage b = bids[i];

            if (b.color == winningColor) {
                uint winAmount = b.amount * 2;

                b.won = true;
                b.settled = true;

                hexa.transfer(b.user, winAmount);

                totalWon[b.user] += winAmount;
                payout += winAmount;
                totalWon1 += payout;
                totalLost1 += totalBidded - payout;
            } else {
                b.won = false;
                b.settled = true;
                totalLost[b.user] += b.amount;
            }
        }

        // ---- 5️⃣ Send remaining to income wallet ----
        uint remaining = totalBidded - payout;

        if (remaining > 0) {
            uint income = (remaining * 80) / 100;
            if (income > 0) {
                hexa.transfer(incomeWallet, income);
            }
        }

        // ---- 6️⃣ Delete game bids safely ----
        delete g.bids;

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
        userRewardTypeAmount[_runnerup][_type] += (typeAmount[_type] * 30) / 100;
        hexa.transferFrom(feeder, _2ndRunnerup, (typeAmount[_type] * 20) / 100);
        userRewardTypeAmount[_2ndRunnerup][_type] += (typeAmount[_type] * 20) / 100;
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
            _runnerup,0,
            0
        );
        userRewardArray[_runnerup].push(tx2);
        Reward memory tx3 = Reward(
            block.timestamp,
            _type,
            (typeAmount[_type] * 20) / 100,
            _2ndRunnerupAchievement,_2ndRunnerup,
            0,
            0
        );
        userRewardArray[_2ndRunnerup].push(tx3);
        rewardInfo[_type]=tx1;
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

    function getBids() external view returns (Bid[] memory);
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
}
