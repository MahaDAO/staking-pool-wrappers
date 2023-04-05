/* eslint-disable */

import { ethers, network } from "hardhat";

async function main() {
  console.log(`Deploying to ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address is ${deployer.address}.`);

  console.log("Deploying WMiniChefV2...");
  const factory = await ethers.getContractFactory("WMasterChefV2");
  const instance = await factory.deploy();

  const pid = 21;
  const lpTokenAddr = "0x79bf7147ebcd0d55e83cb42ed3ba1bb2bb23ef20";
  const chefAddr = "0xf4d73326c13a4fc5fd7a064217e12780e9bd62c3";

  await instance.initialize(
    "SushiSwap USDT/USDC 0.01%", // string memory _name,
    "SUSHI_USDTUSDC_0_01", // string memory _symbol,
    chefAddr, // IMiniChefV2 _chef,
    pid, // uint256 _pid,
    lpTokenAddr, // address _lpToken,
    "0xd4d42f0b6def4ce0383636770ef773390d85c61a", // address _rewardToken,
    "0x575e143702a015d09F298663405d1eD7fD20f0dD", // address _rewardDestination,
    30000000000, // uint256 _rewardFee = 30%
    deployer.address // address _governance
  );

  const lpToken = await ethers.getContractAt("IERC20", lpTokenAddr);

  const balBefore = await lpToken.balanceOf(deployer.address);
  console.log("bal before", balBefore.toString());

  console.log("give approval");
  await lpToken.approve(instance.address, balBefore);

  console.log("deposit");
  await instance.deposit(balBefore);

  console.log("accumulatedRewards", await instance.accumulatedRewards());
  console.log("totalSupply", await instance.totalSupply());

  // wait for 100 days
  // suppose the current block has a timestamp of 01:00 PM
  console.log("wait sometime");
  await instance.harvest();
  await network.provider.send("evm_increaseTime", [86400 * 100]);
  await network.provider.send("evm_mine", []);

  console.log("accumulatedRewards", await instance.accumulatedRewards());

  console.log("harvest");
  await instance.harvest();

  console.log("accumulatedRewards", await instance.accumulatedRewards());
  console.log(
    "accumulatedRewardsFor",
    await instance.accumulatedRewardsFor(deployer.address)
  );

  console.log("withdraw");
  await instance.withdraw(balBefore);

  const balAfter = await lpToken.balanceOf(deployer.address);
  console.log("bal after", balAfter.toString());
  console.log("accumulatedRewards", await instance.accumulatedRewards());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
