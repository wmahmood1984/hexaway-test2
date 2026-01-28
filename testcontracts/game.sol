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

    struct Game_Settled {
        uint slot;
        uint time;
        Bid[]  bids;
        address[] winners;
        address[] losers;
        uint winningAmount;
        uint distributedAmountToWinner;
        uint distributedAmountToAdmin;
 
    }

    struct Bid {
        address user;
        uint amount;
        uint8 color;
    }

    Game[] public gameArray;
    address public incomeWallet;
    Ihelper public helperv2;
    address public settler;
    Game_Settled[] public gamesSettled;
    mapping(address=>uint)public userSpent;
    mapping(address=>uint)public userWon;


    event GameSettled(
        uint256 indexed gameId,
        uint8 winningColor,
        address[] winners,
        uint256 totalWinningAmount
    );


    constructor() {
        _disableInitializers();
    }

    function initialize(address _hexa, address _incomeWallet, address _helperV2, address _settler) public initializer {
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
    settler = _settler;
    }

    function _addGame(uint8 slot, uint8 time) internal {
        gameArray.push();
        Game storage g = gameArray[gameArray.length - 1];
        g.slot = slot;
        g.time = time;
        // g.bids is automatically initialized as empty
    }

    function placeBid(uint _id, uint _amount, uint8 _color) public {
        Bid[] storage g = gameArray[_id].bids;
        require(hexa.allowance(msg.sender,address(this))>=_amount,"insufficient allowance");
        hexa.transferFrom(msg.sender, address(this), _amount);
        Bid memory tx1 = Bid(msg.sender,_amount,_color);
        g.push(tx1);

        uint distributableAmount = _amount * 18/100;

        hexa.transfer(incomeWallet, (distributableAmount * 20) / 100);

        Ihelper.User memory user = helperv2.getUser(msg.sender);

        address up = user.referrer;

        if (incomeEligible(user, up)) {
            hexa.transfer(up, (distributableAmount * 20) / 100);
        }

        address[] memory uplines = helperv2.getUplines(msg.sender);

        processLevelIncome(uplines, distributableAmount * 60 /100);
        userSpent[msg.sender]+=_amount;
    }

    function settlement(uint256 _id) external onlyOwner {
        require(_id < gameArray.length, "Invalid game id");


        Game storage g = gameArray[_id];
        uint256 bidsLength = g.bids.length;
        require(bidsLength > 0, "No bids");

        // -----------------------------
        // STEP 1: Aggregate by color
        // -----------------------------
        // Adjust size if you have more colors
        uint[] memory totalAmountByColor = new uint[](g.slot);
        uint256[] memory totalCountByColor = new uint[](g.slot);

        for (uint256 i = 0; i < bidsLength; i++) {
            Bid storage b = g.bids[i];
            require(b.color < g.slot, "Invalid color");

            totalAmountByColor[b.color] += b.amount;
            totalCountByColor[b.color] += 1;
        }

        // -----------------------------
        // STEP 2: Find lowest amount
        // -----------------------------
        uint8 winningColor;
        uint256 lowestAmount = type(uint256).max;

        for (uint8 c = 0; c < g.slot; c++) {
            if (totalAmountByColor[c] > 0 && totalAmountByColor[c] < lowestAmount) {
                lowestAmount = totalAmountByColor[c];
                winningColor = c;
            }
        }

        require(lowestAmount != type(uint256).max, "No valid winner");

        // -----------------------------
        // STEP 3: Collect winners
        // -----------------------------
        address[] memory winners = new address[](totalCountByColor[winningColor]);
        uint256 winnerIndex;
        uint256 totalPayout;

        for (uint256 i = 0; i < bidsLength; i++) {
            Bid storage b = g.bids[i];

            if (b.color == winningColor) {
                winners[winnerIndex++] = b.user;

                uint256 payout = b.amount * 2;
                totalPayout += payout;

                hexa.transfer(b.user, payout);
                userWon[b.user]+=payout;
                
                

            }
        }

        // -----------------------------
        // STEP 4: Income wallet logic
        // -----------------------------
        uint256 totalBidded;
        for (uint8 c = 0; c < g.slot; c++) {
            totalBidded += totalAmountByColor[c];
        }

        uint256 incomeAmount =
            totalBidded
            - ((totalBidded * 18) / 100)
            - totalPayout;

        if (incomeAmount > 0) {
            hexa.transfer(incomeWallet, incomeAmount);
        }

        // -----------------------------
        // STEP 5: Finalize
        // -----------------------------


        emit GameSettled(
            _id,
            winningColor,
            winners,
            totalAmountByColor[winningColor]
        );
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

            bool eligible = upline.direct.length >= 2;

            if (eligible && incomeEligible(upline, up)) {
                hexa.transfer(up, perLevelAmount);

                paidCount++;
            }
        }



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
