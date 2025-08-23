// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./manageCurrencies.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20Metadata;



contract CreateQuest is ManageCurrencies, ReentrancyGuard{
     constructor(address initialOwner) ManageCurrencies(initialOwner) {}

     struct Quest {
        uint256 id;
        address brand;
        address token;
        uint256 balance;
     }
    uint256 public nextQuestId;
    mapping(uint256 => Quest) public quests;

    event QuestCreatedByBrand(uint256 indexed questId, address indexed brand, address indexed token, uint256 prizePool);
    event QuestCreatedByAdmin(uint256 indexed questId, address indexed brand, address indexed token, uint256 prizePool);

    function createQuestAsBrand(uint256 prizePool, address token) external nonReentrant returns(uint256){

        _validateQuestCreation(prizePool, token);
        // Store quest
        quests[nextQuestId] = Quest({
            id: nextQuestId,
            brand: msg.sender,
            token: token,
            balance: prizePool
        });

        emit QuestCreatedByBrand(nextQuestId, msg.sender, token, prizePool);

        nextQuestId++;
        return nextQuestId - 1; // Return the created quest ID
    }
    function createQuestAsAdmin(address brand, uint256 prizePool, address token)external nonReentrant onlyOwner returns(uint256){
        _validateQuestCreation(prizePool, token);
                // Store quest
        quests[nextQuestId] = Quest({
            id: nextQuestId,
            brand: brand,
            token: token,
            balance: prizePool
        });

        emit QuestCreatedByBrand(nextQuestId, msg.sender, token, prizePool);

        nextQuestId++;
        return nextQuestId - 1; // Return the created quest ID
    }

    function _validateQuestCreation(uint256 prizePool, address token) private{
        require(supportedCurrencies[token], "Token not supported");

        IERC20Metadata erc20 = IERC20Metadata(token);

        // Check if smart contract is allowed to spend the required amount
        uint256 allowance = erc20.allowance(msg.sender, address(this));
        require(allowance >= prizePool, "Insufficient allowance");

        // Transfer tokens from brand to this contract
        erc20.safeTransferFrom(msg.sender, address(this), prizePool);
    }
}