// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IGMUOracle } from "../interfaces/IGMUOracle.sol";

contract MockGMUOracle is IGMUOracle {
    uint256 public price;
    uint256 public decimals;

    constructor (uint256 _price, uint256 _decimals) {
        setPrice(_price, _decimals);
    }

    function setPrice (uint256 _price, uint256 _decimals) public {
        price = _price;
        decimals = _decimals;
    }

    function getPrice() external override view returns (uint256) {
        return price;
    }

    function getDecimalPercision() external override view returns (uint256) {
        return decimals;
    }
}
