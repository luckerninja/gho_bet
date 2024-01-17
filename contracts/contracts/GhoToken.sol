// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GhoToken is ERC20 {
    // Initializes the token with a name and symbol
    constructor() ERC20("GhoToken", "GHO") {
        // Minting an initial supply of tokens to the deployer
        // Here, we are creating 1000000 tokens with 18 decimal places
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    // Additional functionalities specific to GhoToken can be added here
}