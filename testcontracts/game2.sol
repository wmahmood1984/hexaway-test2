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
        uint purchaseTime;
        uint levelUnlock;
        uint8 directrequired;
        uint packageUpgraded;
    }

    function getUser(address _user) external view returns (User memory);
    function getUplines(address user) external view returns (address[] memory);
    function userPackage(address user) external view returns (Package memory);
}

contract GameEngine is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public hexa;
    address public incomeWallet;
    address public settler;
    Ihelper public helper;

    struct Bid {
        address user;
        uint amount;
        uint8 color;
    }

    struct Game {
        uint8 slots; // 3,6,9
        uint8 duration; // 1,3,5,10 minutes
        Bid[] bids;
        bool active;
    }

    Game[] public games;

    mapping(address => uint) public totalSpent;
    mapping(address => uint) public totalWon;
    mapping(uint => uint) public gameRan;

    event GameCreated(uint indexed gameId, uint8 slots, uint8 duration);
    event GameSettled(uint indexed gameId, uint8 winningColor, uint payout);

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _hexa,
        address _incomeWallet,
        address _helper,
        address _settler
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        hexa = IERC20(_hexa);
        incomeWallet = _incomeWallet;
        helper = Ihelper(_helper);
        settler = _settler;

        _createGames();
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

        hexa.transferFrom(msg.sender, address(this), amount);
        g.bids.push(Bid(msg.sender, amount, color));
        totalSpent[msg.sender] += amount;

        _distributeIncome(msg.sender, amount);
    }

    function _distributeIncome(address user, uint amount) internal {
        uint dist = (amount * 18) / 100;

        hexa.transfer(incomeWallet, (dist * 20) / 100);

        Ihelper.User memory u = helper.getUser(user);
        if (incomeEligible(u, u.referrer)) {
            hexa.transfer(u.referrer, (dist * 20) / 100);
        }

        address[] memory uplines = helper.getUplines(user);
        _processLevelIncome(uplines, (dist * 60) / 100);
    }

    function settleGame(uint gameId) external {
        // require(msg.sender == settler, "Unauthorized");
        gameRan[gameId]=block.timestamp;
        Game storage g = games[gameId];
        if (g.bids.length == 0) {
            emit GameSettled(gameId, type(uint8).max, 0);
            return;
        }

        uint[] memory totals = new uint[](g.slots);

        for (uint i; i < g.bids.length; i++) {
            totals[g.bids[i].color] += g.bids[i].amount;
        }

        // RULE 1: zero-bid color => no winners
        for (uint8 c = 0; c < g.slots; c++) {
            if (totals[c] == 0) {
                uint bal = hexa.balanceOf(address(this));
                if (bal > 0) hexa.transfer(incomeWallet, bal);

                delete g.bids;
                emit GameSettled(gameId, type(uint8).max, 0);
                return;
            }
        }

        // RULE 2: lowest total wins
        uint8 winningColor = 0;
        uint lowest = totals[0];

        for (uint8 c = 1; c < g.slots; c++) {
            if (totals[c] < lowest) {
                lowest = totals[c];
                winningColor = c;
            }
        }

        uint payout;
        for (uint i; i < g.bids.length; i++) {
            Bid memory b = g.bids[i];
            if (b.color == winningColor) {
                uint win = b.amount * 2;
                hexa.transfer(b.user, win);
                totalWon[b.user] += win;
                payout += win;
            }
        }

        uint remaining = hexa.balanceOf(address(this));
        if (remaining > 0) hexa.transfer(incomeWallet, remaining);

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

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
