// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import upgradeable versions instead of regular contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract P2PTrading is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    struct Order {
        uint id;
        bool _type;
        address user;
        uint amount;
        uint price;
        uint time;
        uint amountFilled;
        uint future1;
        uint future2;
        uint future3;
    }

    Order[] public UserBuyOrders;
    Order[] public UserSaleOrders;
    IERC20 public USDT;
    IERC20 public HEXA;
    uint public price;
    uint public fee;
    address public adminWallet;

    event Trades(
        address user,
        uint originalAmount,
        uint tradeAmount,
        uint time,
        bool _type
    );
    event Settle(address user, uint originalAmount, uint time, bool _type);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        USDT = IERC20(0x2907DA57598e5dd349d768FbC0e6BC3D2CF66cB9);
        HEXA = IERC20(0x309D64381Ea67edbe9E09e719b398f0060AD4FCf);
        price = 0.01 ether;
        fee = 5;
        adminWallet = 0x8397d56A9bec2155E63F62133C8fbDA30C61A7eF;
    }

    function settle() public {
        for (uint i = 0; i < UserBuyOrders.length; i++) {
            Order storage buy = UserBuyOrders[i];
            if (buy.amountFilled >= buy.amount) continue; // already fully filled

            for (uint j = 0; j < UserSaleOrders.length; j++) {
                Order storage sale = UserSaleOrders[j];
                if (sale.amountFilled >= sale.amount) continue; // already fully filled

                // Check if match is possible
                if (buy.price < sale.price) continue;

                // Calculate amount to settle
                uint buyRemaining = buy.amount - buy.amountFilled;
                uint saleRemaining = sale.amount - sale.amountFilled;
                uint settleAmount = buyRemaining < saleRemaining
                    ? buyRemaining
                    : saleRemaining;

                // Calculate total USDT to transfer
                uint totalUSDT = (settleAmount * sale.price) / 1e18;
                uint _fee = totalUSDT * fee /100;
                uint remaining = totalUSDT - _fee;
                // Transfer USDT from buyer to seller
                require(
                    USDT.transfer(sale.user, remaining),
                    "USDT transfer failed"
                );

                // Transfer HEXA from seller to buyer
                require(
                    HEXA.transfer(buy.user, settleAmount),
                    "HEXA transfer failed"
                );

                emit Trades(
                    buy.user,
                    buy.amount,
                    settleAmount,
                    block.timestamp,
                    false
                );
                emit Trades(
                    sale.user,
                    sale.amount,
                    settleAmount,
                    block.timestamp,
                    true
                );

                // Update filled amounts
                // Update filled amounts
                buy.amountFilled += settleAmount;
                sale.amountFilled += settleAmount;

                // Emit Settle event if BUY order is fully filled
                if (buy.amountFilled == buy.amount) {
                    emit Settle(
                        buy.user,
                        buy.amount,
                        block.timestamp,
                        false // buy order
                    );
                }

                // Emit Settle event if SALE order is fully filled
                if (sale.amountFilled == sale.amount) {
                    emit Settle(
                        sale.user,
                        sale.amount,
                        block.timestamp,
                        true // sale order
                    );
                }

                // Stop matching if buy order is fully filled
                if (buy.amountFilled >= buy.amount) {
                    break;
                }
            }
        }
    }

    function setBuyOrder(uint _amount) public {
        uint requiredUSDT = (_amount * price) / 1e18;

        require(
            USDT.allowance(msg.sender, address(this)) >= requiredUSDT,
            "insufficient allowance"
        );

        USDT.transferFrom(msg.sender, address(this), requiredUSDT);

        UserBuyOrders.push(
            Order({
                id: UserBuyOrders.length,
                _type: false,
                user: msg.sender,
                amount: _amount,
                price: price,
                time: block.timestamp,
                amountFilled: 0,
                future1: 0,
                future2: 0,
                future3: 0
            })
        );

        settle();
    }

    function setSaleOrder(uint _amount) public {
        require(
            HEXA.allowance(msg.sender, address(this)) >= _amount,
            "insufficient allowance"
        );

        HEXA.transferFrom(msg.sender, address(this), _amount);

        UserSaleOrders.push(
            Order({
                id: UserSaleOrders.length,
                _type: true,
                user: msg.sender,
                amount: _amount,
                price: price,
                time: block.timestamp,
                amountFilled: 0,
                future1: 0,
                future2: 0,
                future3: 0
            })
        );

        settle();
    }

    function getOrders(bool _type) public view returns (Order[] memory) {
        return !_type ? UserBuyOrders : UserSaleOrders;
    }

    function getOrdersByUser(
        address _user,
        bool _type
    ) public view returns (Order[] memory) {
        Order[] storage orders = !_type ? UserBuyOrders : UserSaleOrders;

        // First pass: count how many orders belong to the user
        uint count = 0;
        for (uint i = 0; i < orders.length; i++) {
            if (orders[i].user == _user) {
                count++;
            }
        }

        // Allocate memory array exactly
        Order[] memory userOrders = new Order[](count);
        uint j = 0;
        for (uint i = 0; i < orders.length; i++) {
            if (orders[i].user == _user) {
                userOrders[j] = orders[i];
                j++;
            }
        }

        return userOrders;
    }

    function cancelOrder(uint id, bool _type) public {
        require(UserBuyOrders[id].user == msg.sender, "you are not authorized");
        require(
            UserSaleOrders[id].user == msg.sender,
            "you are not authorized"
        );
        Order[] storage orders = !_type ? UserBuyOrders : UserSaleOrders;

        for (uint i = id; i < orders.length - 1; i++) {
            orders[i] = orders[i + 1];
        }

        orders.pop();
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}
