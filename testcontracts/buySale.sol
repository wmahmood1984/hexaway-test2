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





contract buysale is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    Ip2p public p2p;

    IERC20 public usdt;
    IERC20 public hexa;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _p2p,
        address _usdt,
        address _hexa
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        p2p = Ip2p(_p2p);
        usdt = IERC20(_usdt);
        hexa = IERC20(_hexa);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    /**
     * @notice Approves USDT and places a buy order on P2P
     * @param amount Amount of USDT to use for buy order
     */
    function setBuyOrder(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");

        // Approve USDT to P2P contract
        bool approved = usdt.approve(address(p2p), amount);
        require(approved, "USDT approval failed");

        // Place buy order
        p2p.setBuyOrder(amount);
    }

    /**
     * @notice Approves HEXA and places a sale order on P2P
     * @param amount Amount of HEXA to sell
     */
    function setSaleOrder(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");

        // Approve HEXA to P2P contract
        bool approved = hexa.approve(address(p2p), amount);
        require(approved, "HEXA approval failed");

        // Place sale order
        p2p.setSaleOrder(amount);
    }
}
