// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MyToken is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    mapping(address => uint) public blockedSums;
    address public color;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address _initialowner
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __Ownable_init(_initialowner);
        __UUPSUpgradeable_init();

        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function addColor(address _add) public onlyOwner {
        color = _add;
    }

    function blockFunds(address _user, uint _funds) public {
        require(msg.sender == color, "not authorized");
        blockedSums[_user] += _funds;
    }

    function releaseFunds(address _user, uint _funds) public {
        require(msg.sender == color, "not authorized");
        require(blockedSums[_user] >= _funds, "not enough funds blocked");
        blockedSums[_user] -= _funds;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (from != address(0)) {
            require(
                balanceOf(from) - blockedSums[from] >= amount,
                "blocked balance"
            );
        }

        super._update(from, to, amount);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
