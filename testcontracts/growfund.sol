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
        uint levelUnlock;
        uint8 future;
    }

    function userPackage(address user) external view returns (Package memory);
    function getUser(address _user) external view returns (User memory);
    function getUplines(address user) external view returns (address[] memory);
}

interface IpriceOracle {
    function price() external view returns (uint256);
}

contract Grow is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public HEXA;
    address public incomeWallet;
    Ihelper public helperv2;

    struct Types {
        uint duration;
        uint amount;
        uint redemption;
    }

    struct Stake {
        uint id;
        address user;
        uint256 amount;
        uint256 time;
        uint stakeType;
        uint256 claimable;
        bool amountClaimed;
    }

    mapping(uint => Stake) public stakeMapping;

    uint public stakeIndex;
    mapping(uint => Types) public typeMapping;

    uint public totalStaked;
    uint public totalEarned;
    address public feeder;
    mapping(uint => uint) public stakeDone;
    uint public stakeDoneTime;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        // address _hexa,
        // address _helper,
        // address _incomeWallet,
        // address _feeder
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        HEXA = IERC20(0x309D64381Ea67edbe9E09e719b398f0060AD4FCf);
        helperv2 = Ihelper(0xd3120EF4eFA25ABE521761D3aEC8c7D87bAc5d5f);
        incomeWallet = 0x0872c88D2Ca157e4C6221c6B55BeAeba64848Df4;

        feeder = 0xCdB22dc563949646836a3a4076E797e34B0f13Ae;
        typeMapping[1] = Types({
            duration: 10 minutes,
            amount: 1000 ether,
            redemption: 1100 ether
        });

        typeMapping[2] = Types({
            duration: 20 minutes,
            amount: 1000 ether,
            redemption: 1250 ether
        });

        typeMapping[3] = Types({
            duration: 30 days,
            amount: 1000 ether,
            redemption: 1450 ether
        });
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function stake(uint _id) public {
        if (block.timestamp > stakeDoneTime + 24 hours) {
            stakeDone[1] = 0;
            stakeDone[2] = 0;
            stakeDone[3] = 0;
            stakeDoneTime = block.timestamp;
        }

        require(
            stakeDone[_id] < 15,
            "You can't stake more than 15 times in a day"
        );

        stakeDone[_id]++;

        require(
            HEXA.allowance(msg.sender, address(this)) >=
                typeMapping[_id].amount,
            "Invalid stake amount"
        );

        stakeMapping[stakeIndex] = Stake({
            id: stakeIndex,
            user: msg.sender,
            amount: typeMapping[_id].amount,
            time: block.timestamp,
            stakeType: _id,
            claimable: typeMapping[_id].redemption,
            amountClaimed: false
        });

        HEXA.transferFrom(msg.sender, address(this), typeMapping[_id].amount);

        stakeIndex++;
        totalStaked += typeMapping[_id].amount;
    }

    function incomeEligible(
        Ihelper.User memory _user,
        address _up
    ) public view returns (bool) {
        return
            block.timestamp - _user.data.packageUpgraded <= 60 * 60 * 24 * 45 &&
            helperv2.userPackage(_up).id > 0 &&
            block.timestamp - _user.data.userTradingTime <= 60 * 60 * 24 * 30;
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
                HEXA.transfer(up, perLevelAmount);

                paidCount++;
            }
        }

        // Remaining amount goes to admin

        uint adminAmount = _amount - (perLevelAmount * paidCount);

        if (adminAmount > 0) {
            HEXA.transfer(incomeWallet, adminAmount);
        }
    }

    function checkActive(
        address[] memory _users
    ) public view returns (uint count) {
        for (uint i = 0; i < _users.length; i++) {
            Ihelper.User memory user = helperv2.getUser(_users[i]);
            if (block.timestamp - user.data.packageUpgraded <= 60 * 45) {
                count++;
            }
        }
    }

    function claim(uint _id) public {
        Stake storage _stake = stakeMapping[_id];
        require(msg.sender == _stake.user, "You are not owner");
        require(
            block.timestamp >=
                _stake.time + typeMapping[_stake.stakeType].duration,
            "You can't claim yet"
        );
        require(!_stake.amountClaimed, "already claimed");
        require(_id < stakeIndex, "Invalid stake ID");
        _stake.amountClaimed = true;
        uint amount = _stake.amount;

        uint premium = (amount * 50) / 100;
        uint premiumForReferrer = amount * 20/100;
        HEXA.transferFrom(feeder, address(this), (premium+premiumForReferrer));
        HEXA.transfer(_stake.user, amount);

        totalEarned += premium;
        
        HEXA.transfer(incomeWallet, (premium * 20) / 100);

        Ihelper.User memory user = helperv2.getUser(msg.sender);
        address up = user.referrer;
        Ihelper.User memory Referrer = helperv2.getUser(up);



        if (
           incomeEligible(Referrer, up)

            ) {
            HEXA.transfer(up, (premium  * 20 / 100)+premiumForReferrer    );
        }

        address[] memory uplines = helperv2.getUplines(msg.sender);

        processLevelIncome(uplines, premium * 60 /100);
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
                userStake[j] = tx1;
                j++;
            }
        }

        return userStake;
    }
}
