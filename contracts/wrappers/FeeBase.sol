// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20Wrapper} from "../interfaces/IERC20Wrapper.sol";

contract FeeBase is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    uint256 public pct100;
    uint256 public rewardFeeRate;
    address public rewardFeeDestination;

    event RewardFeeChanged(uint256 _old, uint256 _new);
    event RewardAddressChanged(address _old, address _new);
    event RewardFeeCharged(
        uint256 initialAmount,
        uint256 feeAmount,
        address feeDestination
    );

    function initializeFeeBase(
        uint256 _rewardFeeRate,
        address _rewardFeeDestination,
        address _owner
    ) internal {
        pct100 = 100000000000;
        rewardFeeRate = _rewardFeeRate; // 0.5% in 10^9
        rewardFeeDestination = _rewardFeeDestination;
        _transferOwnership(_owner);
    }

    function setRewardFeeRate(uint256 _new) external onlyOwner {
        _setRewardFeeRate(_new);
    }

    function setRewardFeeAddress(address _new) external onlyOwner {
        _setRewardFeeAddress(_new);
    }

    function _setRewardFeeAddress(address _new) internal {
        emit RewardAddressChanged(rewardFeeDestination, _new);
        rewardFeeDestination = _new;
    }

    function _setRewardFeeRate(uint256 _new) internal {
        require(_new >= 0, "fee is not >= 0%");
        require(_new <= pct100, "fee is not <= 100%");

        emit RewardFeeChanged(rewardFeeRate, _new);
        rewardFeeRate = _new;
    }

    function _chargeFee(IERC20 token, uint256 earnings) internal {
        if (earnings == 0) return;

        // pay out fees to governance
        uint256 feeToCharge = earnings.mul(rewardFeeRate).div(pct100);
        if (feeToCharge > 0 && rewardFeeDestination != address(0)) {
            token.safeTransfer(rewardFeeDestination, feeToCharge);
            emit RewardFeeCharged(earnings, feeToCharge, rewardFeeDestination);
        }
    }
}
