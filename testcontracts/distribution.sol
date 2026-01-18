// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import upgradeable versions instead of regular contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract Distribution is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    address public Waqas;
    address public Doctor;
    address public Harpreet;
    address public Baldeep;
    address public expenses;
    address public Usman;
    address public Satnam;
    IERC20 public USDT;
    IERC20 public HEXA;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _usdt, address _hexa) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        USDT = IERC20(_usdt);
        HEXA = IERC20(_hexa);
        Waqas = 0xC0780E2DDA0b336CDbd6F9Bd8a722CA9Baa79Ad2;
        Doctor = 0x01c7620F3736d3576fa81fCbC5fE02448a0041F9;
        expenses =0x2733a452141bEf06289Ee8898E40519eD27dFfB3;
        Usman =0x5d5BC308E78255E104e9624C5eB46766E096f3D8;
        Satnam = 0xe3755A80c47FE9a2B2b2d62cd856df8f4916372c;
        Baldeep = 0xcc47d1115b58ec1957Bd850F326b2c926410F4a0;
        Harpreet =  0x80cFe7fc2921952df3843dD96a749ec9CcCaB446;
    }

    function setWaqas(address _user) public {
        require(msg.sender == Waqas, "you are not authorized");
        Waqas = _user;
    }

    function setDoctor(address _user) public {
        require(msg.sender == Doctor, "you are not authorized");
        Doctor = _user;
    }

    function setHarpreet(address _user) public {
        require(msg.sender == Harpreet, "you are not authorized");
        Harpreet = _user;
    }

    function setBaldeep(address _user) public {
        require(msg.sender == Baldeep, "you are not authorized");
        Baldeep = _user;
    }

    function setExpenses(address _user) public {
        require(msg.sender == Baldeep, "you are not authorized");
         expenses = _user;
    }

    function setUsman(address _user) public {
        require(msg.sender == Usman, "you are not authorized");
        Usman = _user;
    }

    function setSatnam(address _user) public {
        require(msg.sender == Satnam, "you are not authorized");
        Satnam = _user;
    }

    function settleUSDT() public {
        uint amount = USDT.balanceOf(address(this));
        uint expenseAmount = (amount * 15) / 100;
        uint remaining = amount - expenseAmount;
        USDT.transfer(expenses, expenseAmount);
        USDT.transfer(Waqas, (remaining * 95) / 1000);
        USDT.transfer(Usman, (remaining * 10) / 1000);
        USDT.transfer(Doctor, (remaining * 223) / 1000);
        USDT.transfer(Harpreet, (remaining * 223) / 1000);
        USDT.transfer(Baldeep, (remaining * 223) / 1000);
        USDT.transfer(Satnam, (remaining * 223) / 1000);
    }

    function settleHEXA() public {
        uint amount = HEXA.balanceOf(address(this));
        uint expenseAmount = (amount * 15) / 100;
        uint remaining = amount - expenseAmount;
        HEXA.transfer(expenses, expenseAmount);
        HEXA.transfer(Waqas, (remaining * 95) / 1000);
        HEXA.transfer(Usman, (remaining * 10) / 1000);
        HEXA.transfer(Doctor, (remaining * 223) / 1000);
        HEXA.transfer(Harpreet, (remaining * 223) / 1000);
        HEXA.transfer(Baldeep, (remaining * 223) / 1000);
        HEXA.transfer(Satnam, (remaining * 223) / 1000);
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}
