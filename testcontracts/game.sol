// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IpriceOracle {
    function price() external view returns (uint256);
}

interface Ip2p {
        function setBuyOrder(uint _amount) external;

            function setSaleOrder(uint _amount) external;
}


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

    struct NFT {
        uint256 id;
        uint256 price;
        address _owner;
        string uri;
        uint premium;
        uint256 utilized;
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

    function userPackage(address user) external view returns (Package memory);
    function getUser(address _user) external view returns (User memory);
    function getUplines(address user) external view returns (address[] memory);
}





contract game is Initializable, UUPSUpgradeable, OwnableUpgradeable {


    IERC20 public hexa;
    struct Game {
        uint8 slot;
        uint8 time;
        Bid[]  bids;
 
    }

    struct Bid {
        address user;
        uint amount;
    }

    Game[] public gameArray;
    address public incomeWallet;
    Ihelper public helperv2;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _hexa, address _incomeWallet, address _helperV2) public initializer {
    __Ownable_init(msg.sender);
    __UUPSUpgradeable_init();

    hexa = IERC20(_hexa);

    _addGame(3, 1);
    _addGame(3, 3);
    _addGame(3, 5);
    _addGame(3, 10);

    _addGame(6, 1);
    _addGame(6, 3);
    _addGame(6, 5);
    _addGame(6, 10);

    _addGame(9, 1);
    _addGame(9, 3);
    _addGame(9, 5);
    _addGame(9, 10);
    incomeWallet = _incomeWallet;
    helperv2 = Ihelper(_helperV2);
    }

    function _addGame(uint8 slot, uint8 time) internal {
        gameArray.push();
        Game storage g = gameArray[gameArray.length - 1];
        g.slot = slot;
        g.time = time;
        // g.bids is automatically initialized as empty
    }

    function placeBid(uint _id, uint _amount) public {
        Bid[] storage g = gameArray[_id].bids;
        require(hexa.allowance(msg.sender,address(this))>=_amount,"insufficient allowance");
        hexa.transferFrom(msg.sender, address(this), _amount);
        Bid memory tx1 = Bid(msg.sender,_amount);
        g.push(tx1);

           hexa.transfer(incomeWallet, (_amount * 20) / 100);

        Ihelper.User memory user = helperv2.getUser(msg.sender);

        address up = user.referrer;

        if (incomeEligible(user, up)) {
            hexa.transfer(up, (_amount * 20) / 100);
        }

        address[] memory uplines = helperv2.getUplines(msg.sender);

        processLevelIncome(uplines, _amount * 60 /100);
    }


    function processLevelIncome(
        address[] memory _uplines,
        uint _amount
     ) internal {
        uint paidCount = 0;
        uint perLevelAmount = _amount / 25;

        for (uint i = 0; i < _uplines.length; i++) {
            address up = _uplines[i];
            Ihelper.User memory upline = helperv2.getUser(up);
            // Level number is 1-based

            // Cache active directs (important for gas + correctness)

            // Level unlocked via active directs
            bool eligible = upline.direct.length >= 2;

            if (eligible && incomeEligible(upline, up)) {
                hexa.transfer(up, perLevelAmount);

                paidCount++;
            }
        }

        // Remaining amount goes to admin

        uint adminAmount = _amount - (perLevelAmount * paidCount);

        if (adminAmount > 0) {
            hexa.transfer(incomeWallet, adminAmount);
        }
    }


    function checkActive(
        address[] memory _users
     ) public view returns (uint count) {
        for (uint i = 0; i < _users.length; i++) {
            Ihelper.User memory user = helperv2.getUser(_users[i]);
            if (
                block.timestamp - user.data.packageUpgraded <= 60  * 45
            ) {
                count++;
            }
        }
    }


    function incomeEligible(
        Ihelper.User memory _user,
        address _up
     ) public view returns (bool) {
        return
            block.timestamp - _user.data.packageUpgraded <= 60 *  45 &&
            helperv2.userPackage(_up).id > 0 &&
            block.timestamp - _user.data.userTradingTime <= 60 * 60 * 2;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setGame (uint _id, uint8 _slot, uint8 _time) public onlyOwner {
        gameArray[_id].slot = _slot;
        gameArray[_id].time = _time;
    }

    function getGame() public view returns (Game[] memory ){
        return gameArray;
    }
     
}
