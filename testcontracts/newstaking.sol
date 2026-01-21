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

interface IpriceOracle {
    function price() external view returns (uint256);
}

contract Staking is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public HEXA;
    IERC20 public USDT;
    IpriceOracle public priceOracle;
    Ihelper public helperv2;
    uint public APR;
    uint public stakeAmount;
    uint public stakeDone;
    uint public stakeDoneTime;
    address public incomeWallet;

    struct Stake {
        uint id;
        address user;
        uint256 amount;
        uint256 time;
        uint256 lastClaimTime;
        uint256 claimable;
        uint256 amountClaimed;
    }

    struct Claim {
        uint time;
        address user;
        uint amountClaimed;
    }

    mapping(uint => Stake) public stakeMapping;
    uint public stakeIndex;
    mapping(uint => Claim) public claimMapping;
    uint public claimIndex;
    uint public totalStaked;
    uint public totalEarned;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _hexa,
        address _usdt,
        address _priceOracle,
        address _incomeWallet,
        address _helperv2
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        HEXA = IERC20(_hexa);
        USDT = IERC20(_usdt);
        stakeAmount = 50 ether;
        APR = 100;
        priceOracle = IpriceOracle(_priceOracle);
        incomeWallet = _incomeWallet;
        helperv2 = Ihelper(_helperv2);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function changeAPR(uint _apr, uint _stakeAmount) public onlyOwner {
        APR = _apr;
        stakeAmount = _stakeAmount;
    }

    function stake() public {
        if (block.timestamp > stakeDoneTime + 30 minutes) {
            stakeDone = 0;
            stakeDoneTime = block.timestamp;
        }

        require(stakeDone < 10, "You can't stake more than 10 times in a day");

        stakeDone++;

        require(
            USDT.allowance(msg.sender, address(this)) >= stakeAmount,
            "Invalid stake amount"
        );
        USDT.transferFrom(msg.sender, address(this), stakeAmount);
        stakeMapping[stakeIndex] = Stake({
            id: stakeIndex,
            user: msg.sender,
            amount: stakeAmount,
            time: block.timestamp,
            lastClaimTime: block.timestamp,
            claimable: 0,
            amountClaimed: 0
        });

        uint amount = 5 ether;

        USDT.transfer(incomeWallet, (amount * 20) / 100);

        Ihelper.User memory user = helperv2.getUser(msg.sender);

        address up = user.referrer;

        if (incomeEligible(user, up)) {
            USDT.transfer(up, (amount * 20) / 100);
        }

        address[] memory uplines = helperv2.getUplines(msg.sender);

        processLevelIncome(uplines, amount);

        stakeIndex++;
        totalStaked += stakeAmount;
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
                USDT.transfer(up, perLevelAmount);

                paidCount++;
            }
        }

        // Remaining amount goes to admin

        uint adminAmount = _amount - (perLevelAmount * paidCount);

        if (adminAmount > 0) {
            USDT.transfer(incomeWallet, adminAmount);
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

    function getAmounts(uint _id) public view returns (uint claimable) {
        uint amount = stakeMapping[_id].amount;
        uint daysPassed = (block.timestamp - stakeMapping[_id].time) / (60) >
            150
            ? 150
            : (block.timestamp - stakeMapping[_id].time) / (60);
        claimable = (amount * APR * daysPassed) / 10000;
    }

    function claim(uint _id) public {
        address user = stakeMapping[_id].user;
        require(_id < stakeIndex, "Invalid stake ID");
        require(user == msg.sender, "you are not authorized");
        uint amount = getAmounts(_id);
        stakeMapping[_id].claimable = amount;
        uint claimable = amount - stakeMapping[_id].amountClaimed;
        stakeMapping[_id].amountClaimed = amount;
        require(
            HEXA.balanceOf(address(this)) >= claimable,
            "Insufficient reward balance"
        );
        HEXA.transfer(user, claimable);
        claimMapping[claimIndex] = (Claim(block.timestamp, user, claimable));
        stakeMapping[_id].lastClaimTime = block.timestamp;
        claimIndex++;
        totalEarned += amount;
    }

    function getTicketsByUser(
        address _user
    ) public view returns (Stake[] memory) {
        uint count = 0;
        for (uint i = 0; i < stakeIndex; i++) {
            Stake memory tx2 = stakeMapping[i];
            if (_user == address(0) || tx2.user == _user) {
                count++;
            }
        }

        // Allocate exact-sized array
        Stake[] memory userStake = new Stake[](count);

        // Second pass: fill array
        uint j = 0;
        for (uint i = 0; i < stakeIndex; i++) {
            Stake memory tx1 = stakeMapping[i];
            if (_user == address(0)) {
                userStake[j] = tx1;
                j++;
            } else if (tx1.user == _user) {
                tx1.claimable = getAmounts(tx1.id);
                userStake[j] = tx1;
                j++;
            }
        }

        return userStake;
    }

    function getClaimsByUser(
        address _user
    ) public view returns (Claim[] memory) {
        uint count = 0;
        for (uint i = 0; i < claimIndex; i++) {
            Claim memory tx2 = claimMapping[i];
            if (_user == address(0) || tx2.user == _user) {
                count++;
            }
        }

        // Allocate exact-sized array
        Claim[] memory userStake = new Claim[](count);

        // Second pass: fill array
        uint j = 0;
        for (uint i = 0; i < claimIndex; i++) {
            Claim memory tx1 = claimMapping[i];
            if (_user == address(0)) {
                userStake[j] = tx1;
                j++;
            } else if (tx1.user == _user) {
                userStake[j] = tx1;
                j++;
            }
        }

        return userStake;
    }
}
