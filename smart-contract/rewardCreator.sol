// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./createQuest.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20Metadata;


contract RewardCreator is CreateQuest {
    constructor(address initialOwner) CreateQuest(initialOwner) {}

    event CreatorRewardedByBrand(uint256 questId, address indexed creator, uint256 amount, address indexed token);
    event CreatorRewardedByAdmin(uint256 questId, address indexed creator, uint256 amount, address indexed token);

    function rewardCreatorAsBrand(uint256 questId, uint256 amount, address creator)external nonReentrant {
        Quest storage quest = quests[questId];
        require(quest.brand != address(0), "Quest does not exist");
        require(msg.sender == quest.brand, "Only the brand can reward");
        require(amount > 0, "Amount must be greater than 0");
        require(quest.balance >= amount, "Insufficient quest balance");

        // Deduct from quest balance
        quest.balance -= amount;

        // Transfer reward to the creator
        IERC20Metadata(quest.token).safeTransfer(creator, amount);
        emit CreatorRewardedByBrand(questId, creator, amount, quest.token);
    }

    function rewardCreatorAsAdmin(uint256 questId, uint256 amount, address creator) external nonReentrant onlyOwner {
        Quest storage quest = quests[questId];
        require(quest.brand != address(0), "Quest does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(quest.balance >= amount, "Insufficient quest balance");

        // Deduct from quest balance
        quest.balance -= amount;

        // Transfer reward to the creator
        IERC20Metadata(quest.token).safeTransfer(creator, amount);
        emit CreatorRewardedByAdmin(questId, creator, amount, quest.token);
    }
}