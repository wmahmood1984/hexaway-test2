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





contract bonus is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    IERC20 public token;
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _hexa
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        token = IERC20(_hexa);

    }

    function _authorizeUpgrade(
        address newImplementation
        ) internal override onlyOwner {}

    function approve(address _spender, uint amount) onlyOwner public {
        token.approve(_spender,amount);
    }

}