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
    mapping(address=>uint) public balance;
    mapping(uint=>uint) public typeAmount;
    Scheme public scheme;
    mapping(address=>bool) public settlers;
    event GameCreated(uint indexed gameId, uint8 slots, uint8 duration);
    event GameSettled(uint indexed gameId, uint8 winningColor, uint payout);

    constructor() {
        _disableInitializers();
    }

    function initialize(
        // address _hexa,
        // address _incomeWallet,
        // address _helper,
        // address _settler
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
    }

    function setScheme(
        uint _start,
        uint _end,
        uint _perToDepositor,
        uint _perToReferrer
        ) public onlyOwner{
        scheme = Scheme(
            _start,_end,_perToDepositor,_perToReferrer
        );
    }

    function deposit(uint _amount) public {
        uint HexaRequired = 5 ether * priceOracle.price() / 1e18; 
        require(hexa.allowance(msg.sender, address(this))>=HexaRequired,"allowance should be more than 5");
        hexa.transferFrom(msg.sender, address(this), HexaRequired);
        balance[msg.sender]+=_amount;

        if(block.timestamp>=scheme.start && block.timestamp<=scheme.end){
            balance[msg.sender]+=_amount*scheme.perToDepositor/100;
            balance[msg.sender]+=_amount*scheme.perToReferrer/100;
            uint amountNeeded = _amount*scheme.perToDepositor/100 + _amount*scheme.perToReferrer/100;
            require(hexa.allowance(feeder, address(this))>=amountNeeded,"insufficient Allowance");
            hexa.transferFrom(feeder, address(this), amountNeeded);
        }

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

        require(balance[msg.sender]>=amount,"balance should be more than amount");
        balance[msg.sender]-=amount;
        Bid memory tx1 =Bid(msg.sender, amount, color,block.timestamp); 
        g.bids.push(tx1);
        bids.push(tx1);
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

    function getBids() public view returns(Bid[] memory) {
        return bids;
    }

    function distributeReward(uint _type, address _winner, address _runnerup, address _2ndRunnerup) public {
        require(settlers[msg.sender],"not authorized");
        require(_type == 1 || _type == 2 || _type == 3|| _type == 4|| _type == 5|| _type == 6,"invalid type");
        require(_winner != address(0) && _runnerup != address(0) && _2ndRunnerup != address(0),"invalid address");
        require(_winner != _runnerup && _runnerup != _2ndRunnerup && _winner != _2ndRunnerup,"invalid address");
        hexa.transferFrom(feeder, _winner, typeAmount[_type]*50/100);
        hexa.transferFrom(feeder, _runnerup, typeAmount[_type]*30/100);
        hexa.transferFrom(feeder, _2ndRunnerup, typeAmount[_type]*20/100);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
