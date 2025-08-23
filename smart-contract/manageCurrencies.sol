// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract ManageCurrencies is Ownable{
        constructor(address initialOwner)
        Ownable(initialOwner) {}

    mapping(address => bool) public supportedCurrencies;

    event addedSupportForCurrency(address indexed token);
    event removedSupportForCurrency(address indexed token);

    function addSupportedCurrency(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!supportedCurrencies[token], "Token was already supported before!");
        supportedCurrencies[token] = true;
        emit addedSupportForCurrency(token);
    }

    function removeSupportedCurrency(address token) external onlyOwner {
        require(supportedCurrencies[token], "Token was not supported before!");
        supportedCurrencies[token] = false;
        emit removedSupportForCurrency(token);
    }

    function isCurrencySupported(address token) external view returns (bool) {
        return supportedCurrencies[token];
    }
}