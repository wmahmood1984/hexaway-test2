// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public HEXA;
    IERC20 public USDT;
    uint public APR;
    uint public stakeAmount;
    uint public stakeDone;
    uint public stakeDoneTime;

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

    function initialize(address _hexa, address _usdt) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        HEXA = IERC20(_hexa);
        USDT = IERC20(_usdt);
        stakeAmount = 50 ether;
        APR = 100;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function changeAPR(uint _apr, uint _stakeAmount) public onlyOwner {
        APR = _apr;
        stakeAmount = _stakeAmount;
    }

    

    function stake() public {
        if (block.timestamp > stakeDoneTime + 24 hours) {
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

        stakeIndex++;
        totalStaked+=stakeAmount;
    }

    function getAmounts(uint _id) public view returns (uint claimable) {
        uint amount = stakeMapping[_id].amount;
        uint daysPassed = (block.timestamp - stakeMapping[_id].time) /
            (60 * 60 * 24) > 150 ? 150 : (block.timestamp - stakeMapping[_id].time) /
            (60 * 60 * 24);
        claimable = (amount * APR * daysPassed) / 100;
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
        totalEarned+=amount;
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
