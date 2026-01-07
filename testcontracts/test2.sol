// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface Ihelper {
    struct User {
        address referrer;
        address parent;
        address[] children;
        address[] indirect;
        address[] direct;
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

    function users(
        address _user
    ) external view returns (address referrer, address parent);

    function userJoiningTime(address user) external view returns (uint);
    function userTradingTime(address user) external view returns (uint);
    function userTradingLimitTime(address user) external view returns (uint);
    function userLimitUtilized(address user) external view returns (uint);
    function userLevelIncomeBlockTime(
        address user
    ) external view returns (uint);
    function packageLevelBonus(address user) external view returns (uint);
    function tradingLevelBonus(address user) external view returns (uint);

    function getNFTs() external view returns (NFT[] memory);
    function getNFTused() external view returns (NFT[] memory);
    function idPurchasedtime(uint256 id) external view returns (uint256);
    function getusers() external view returns (address[] memory);
    function getUser(address _user) external view returns (User memory);
}

contract Helperv2 is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    IERC721Receiver
{
    struct Package {
        uint id;
        uint price;
        uint time;
        uint team;
        uint limit;
        uint levelUnlock;
        uint8 directrequired;
    }

    struct User {
        address referrer;
        address parent;
        address[] children;
        address[] indirect;
        address[] direct;
        uint packageUpgraded;
        uint userJoiningTime;
        uint userTradingTime;
        uint userTradingLimitTime;
        uint userLimitUtilized;
        uint tradingLevelBonus;
        uint packageLevelBonus;
        uint userLevelIncomeBlockTime;
    }

    struct ticket {
        address user;
        uint income;
    }

    IERC20 public paymentToken;
    Package[] public packages;
    mapping(address => Package) public userPackage;
    mapping(address => User) public users;
    mapping(address => bool) public userRegistered;
    address[] usersArray;
    address public incomeWallet;
    uint public packageExpiry;
    uint public timelimit;
    Ihelper helper;
    mapping(uint => ticket) public ticketMapping;
    uint public ticketIndex;
    uint public activeTicketIndex;
    address public adminWallet;
    mapping(address => uint) public balance;

    event Upgrades(uint time, uint amount, uint _type, address _user);
    event Incomes(
        uint time,
        uint amount,
        uint _type,
        address _user,
        uint level,
        uint id
    );

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _paymentToken,
        address _helper
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        paymentToken = IERC20(_paymentToken);
        packageExpiry = 60 * 60 * 24 * 45;
        packages.push(Package(0, 2 ether, 0, 0, 100 ether, 1, 0));
        packages.push(Package(1, 5 ether, packageExpiry * 1, 0, 2, 5, 2));
        packages.push(Package(2, 10 ether, packageExpiry * 2, 15, 3, 10, 3));
        packages.push(Package(3, 15 ether, packageExpiry * 3, 40, 4, 20, 4));
        packages.push(Package(4, 20 ether, packageExpiry * 4, 100, 5, 50, 5)); //100 //90
        packages.push(Package(5, 25 ether, packageExpiry * 5, 300, 6, 100, 6));
        timelimit = 60 * 60 * 48;
        helper = Ihelper(_helper);
        ticketIndex = 1;
    }

    function register(address _ref, address _user, uint funds) public {
        address _referrer = _ref != address(0) ? _ref : owner();
        uint amount = packages[0].price;
        Package memory tx1 = packages[0];
        userPackage[_user] = tx1;
        require(funds >= amount, "insufficient funds");
        require(users[_user].referrer == address(0), "zero address");
        require(_referrer != _user, "self referrer");
        require(userRegistered[_referrer], "already registered");
        address placement = findAvailableSlot(_referrer);
        users[_user].referrer = _referrer;
        users[_user].parent = placement;
        users[placement].children.push(_user);
        users[_user].packageUpgraded = block.timestamp;
        users[_user].userJoiningTime = block.timestamp;
        users[_user].userTradingLimitTime = block.timestamp;
        usersArray.push(_user);
        // Direct referral list
        users[_referrer].direct.push(_user);

        // ✅ Add to referrer's indirect network

        address current = placement;
        for (uint i = 0; i < 25; i++) {
            if (current == address(0)) break;
            users[current].indirect.push(_user);
            current = users[current].parent;
        }

        userRegistered[_user] = true;

        if (block.timestamp - users[_referrer].packageUpgraded <= userPackage[_referrer].time) {
            paymentToken.transfer(_referrer, amount / 2);
        }

        paymentToken.transfer(incomeWallet, amount / 2);

        emit Upgrades(block.timestamp, amount, 0, _user);
    }

    function findAvailableSlot(
        address _root
    ) public view returns (address placement) {
        // Quick win: if root has space, return it immediately
        if (users[_root].children.length < 2) {
            placement = _root;
            return placement;
        }

        address[] memory upline = users[_root].indirect;

        for (uint i = 0; i < upline.length; i++) {
            if (users[upline[i]].children.length < 2) {
                placement = upline[i];
                return placement;
            }
        }
    }

    function buyPackage(uint8 id, address _user, uint funds) public {
        uint amount = packages[id].price;
        require(funds >= amount, "insufficient funds");
        require(checkEligibility(_user, id), "not eligible");
        require(id >= userPackage[_user].id, "cannot upgrade old package");
        require(userRegistered[_user], "6");
        Package memory tx1 = packages[id];
        users[_user].packageUpgraded = block.timestamp;

        userPackage[_user] = tx1;
        users[_user].userLimitUtilized = 0;
        users[_user].userTradingLimitTime = block.timestamp;

        paymentToken.transfer(incomeWallet, (amount * 20) / 100);

        address up = users[_user].referrer;

        if (block.timestamp - users[up].packageUpgraded <= userPackage[up].time) {
            paymentToken.transfer(up, (amount * 20) / 100);
        }
        
        address[] memory _uplines = getUplines(_user);

        processLevelIncome(_uplines, (amount * 80) / 100, 25, 2, 0);
        emit Upgrades(block.timestamp, amount, id, _user);
    }

    function processLevelIncome(
        address[] memory _uplines,
        uint _amount,
        uint8 levelD,
        uint8 _type,
        uint _id
    ) internal {
        uint leftOver = 0;

        

        for (uint i = 0; i < _uplines.length; i++) {
            address up = _uplines[i];
            bool cond = _type == 2 // Package Buy
                ? users[up].direct.length >= 2
                : ((userPackage[up].id == 5 && // NFT buy
                    users[up].userLimitUtilized >=
                        (userPackage[up].limit / 2)) ||
                    userPackage[up].id != 5) &&
                    userPackage[up].levelUnlock >= i &&
                    users[up].direct.length >= userPackage[up].directrequired;
            uint transactionType = _type == 1 ? 2 : 3;
            if (
                cond &&
                block.timestamp - users[up].packageUpgraded <= userPackage[up].time && 
                userPackage[up].id > 0
            ) {

                    paymentToken.transfer(up, _amount  / levelD);
                    if (_type == 1) {
                        users[up].tradingLevelBonus +=
                            _amount * 60 / levelD;
                    } else {
                        users[up].packageLevelBonus +=
                            _amount / levelD;
                    }

                    emit Incomes(
                        block.timestamp,
                        _amount  / levelD,
                        transactionType,
                        up,
                        i + 1,
                        _id
                    );
                    leftOver++;

            }
        }

        uint validLeftOver = leftOver > levelD ? levelD : leftOver;
        paymentToken.transfer(
            incomeWallet,
            (_amount * (levelD - validLeftOver)) / levelD
        );
    }

    function getUplines(address user) public view returns (address[] memory) {
        address[] memory temp = new address[](25); // temporary
        uint8 count = 0;

        for (uint8 i = 0; i < 25; i++) {
            address parent = users[user].parent;
            if (parent == address(0)) break;
            temp[count] = parent;
            user = parent;
            count++;
        }

        // resize to actual count
        address[] memory uplines = new address[](count);
        for (uint8 j = 0; j < count; j++) {
            uplines[j] = temp[j];
        }

        return uplines;
    }

    function checkEligibility(
        address _user,
        uint8 _id
    ) public view returns (bool condition) {
        Package memory _package = packages[_id];

        Package memory _currentPackage = userPackage[_user];

        condition =
            block.timestamp - users[_user].packageUpgraded >=
                _currentPackage.time ||
            users[_user].indirect.length >= _package.team;
    }

    function trade(uint _ticket) public {
        uint price = 100;
        uint amount = 6 ether * price;
        uint redeemedAmount = 9 ether * price;

        require(
            paymentToken.allowance(msg.sender, address(this)) >= amount,
            "Allowance insufficient"
        );
        paymentToken.transferFrom(msg.sender, address(this), amount);

        ticket memory tx1 = ticket(msg.sender, 0);
        ticketMapping[ticketIndex] = tx1;
        ticketIndex++;

        paymentToken.transfer(adminWallet, (amount * 5) / 100);
        paymentToken.transfer(users[msg.sender].referrer, (amount * 5) / 100);
        users[msg.sender].userLimitUtilized ++;
        require(users[msg.sender].userLimitUtilized<=userPackage[msg.sender].limit,"2");

        if (block.timestamp - users[msg.sender].userTradingLimitTime > 24 hours) {
            // Reset after 3 minutes
            users[msg.sender].userTradingLimitTime = block.timestamp;
            users[msg.sender].userLimitUtilized = 0;
        }
        address [] memory _uplines = getUplines(msg.sender);
        
        if(_uplines.length==25){
            paymentToken.transfer(_uplines[24],amount*5/100);
        }else{
            paymentToken.transfer(incomeWallet,amount*5/100);
        }

        processLevelIncome(_uplines, (amount * 35) / 100, 24, 1, 0);
        balance[ticketMapping[activeTicketIndex].user] += (amount * 50) / 100;

        if (ticketMapping[activeTicketIndex].income >= (amount * 3) / 2) {
            activeTicketIndex++;
        }

        if (_ticket > 0) {
            paymentToken.transfer(msg.sender, redeemedAmount);
        }
    }

    function changePackages(
        uint id,
        Package memory _package,
        uint _packageExpiry
    ) public onlyOwner {
        packageExpiry = _packageExpiry == 0 ? packageExpiry : _packageExpiry;
        packages[id] = _package;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function getUser(address _user) external view returns (User memory) {
        return (users[_user]);
    }

    function migrate(address _user) public onlyOwner {
        Ihelper.Package memory _package = helper.userPackage(_user);
        Ihelper.User memory user = helper.getUser(_user);
        userPackage[_user] = Package(
            _package.id,
            _package.price,
            _package.time,
            _package.team,
            packages[_package.id].limit,
            _package.levelUnlock,
            _package.directrequired
        );

        users[_user] = User({
            referrer: user.referrer,
            parent: user.parent,
            children: user.children,
            indirect: user.indirect,
            direct: user.direct,
            packageUpgraded: _package.packageUpgraded,
            userJoiningTime: helper.userJoiningTime(_user),
            userTradingTime: helper.userTradingTime(_user),
            userTradingLimitTime: helper.userTradingLimitTime(_user),
            userLimitUtilized: 0,
            tradingLevelBonus: 0,
            packageLevelBonus: 0,
            userLevelIncomeBlockTime: 0
        });
    }
}
