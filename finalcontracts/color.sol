// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

//import "./contract1.sol";

interface IERC201 {
    function transferFrom(address from, address to, uint amount) external;
    function blockFunds(address _user, uint _funds) external;
}

interface MyNFT {
    function safeTransferFrom(address _from, address _to, uint amount) external;
}

interface IHelper {
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

    function userPackage(
        address user
    )
        external
        view
        returns (uint, uint, uint, uint, uint, uint, uint, uint8, uint);

    function users(
        address _user
    ) external view returns (address referrer, address parent);

    function userJoiningTime(address user) external view returns (uint);

    function getNFTs() external view returns (NFT[] memory);
    function getNFTused() external view returns (NFT[] memory);
    function idPurchasedtime(uint256 id) external view returns (uint256);
    function getusers() external view returns (address[] memory);
}

contract Color is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    IERC721Receiver
{
    IHelper public helper;
    MyNFT public NftContract;
    IERC201 public HexaToken;

    // gameIndex => encoded game data
    mapping(uint256 => bytes) public gameMapping;
    uint256 public gameIndex;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        address _helper,
        address _myNft,
        address _hexa
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        helper = IHelper(_helper);
        NftContract = MyNFT(_myNft);
        HexaToken = IERC201(_hexa);
    }

    function changeHelperNFT(
        address _helper,
        address _nft,
        address _hexa
    ) external onlyOwner {
        helper = IHelper(_helper);
        NftContract = MyNFT(_nft);
        HexaToken = IERC201(_hexa);
    }

    function convert(uint256 _id) external {
        IHelper.NFT memory nft = helper.getNFTs()[_id - 1];
        require(nft._owner != address(0), "nft burnt");

        NftContract.safeTransferFrom(msg.sender, address(this), _id);

        uint256 price = nft.price - 50 ether;
        HexaToken.transferFrom(address(this), msg.sender, price);
        HexaToken.blockFunds(msg.sender, price);
    }

    /**
     * Store game as encoded bytes
     * Encoding order MUST remain append-only in future upgrades
     */
    function issueGame(bytes calldata payload) external onlyOwner {
        gameMapping[gameIndex] = payload;
        gameIndex++;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}

contract DataFetcherColor is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable
{
    Color public color;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _color) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        color = Color(_color);
    }

    function updatecolor(address _color) external onlyOwner {
        color = Color(_color);
    }

    function getGames() external view returns (bytes[] memory) {
        uint256 total = color.gameIndex();
        bytes[] memory arr = new bytes[](total);

        for (uint256 i = 0; i < total; i++) {
            arr[i] = color.gameMapping(i);
        }

        return arr;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}
