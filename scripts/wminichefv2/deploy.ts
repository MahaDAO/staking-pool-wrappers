// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { deployOrLoadAndVerify } from "../utils";

async function main() {
  const [deployer] = await ethers.getSigners();

  const gnosisProxy = "0x575e143702a015d09F298663405d1eD7fD20f0dD";
  const pid = 21;
  const lpTokenAddr = "0x79bf7147ebcd0d55e83cb42ed3ba1bb2bb23ef20";
  const chefAddr = "0xf4d73326c13a4fc5fd7a064217e12780e9bd62c3";

  console.log("Deploying WMasterChefV2...", deployer.address);

  const factory = await ethers.getContractFactory("WMasterChefV2");
  const implementation = await deployOrLoadAndVerify(
    "WMasterChefV2Impl",
    "WMasterChefV2",
    []
  );

  // deploy as proxy
  console.log("Deploying proxy...");
  const initDecode = factory.interface.encodeFunctionData("initialize", [
    "SushiSwap USDT/USDC 0.01%", // string memory _name,
    "SUSHI_USDTUSDC_0_01", // string memory _symbol,
    chefAddr, // IMiniChefV2 _chef,
    pid, // uint256 _pid,
    lpTokenAddr, // address _lpToken,
    "0xd4d42f0b6def4ce0383636770ef773390d85c61a", // address _rewardToken,
    "0x6818F17E4894CB1dAE9fD115f6da280291193C7b", // address _rewardDestination,
    30000000000, // uint256 _rewardFee = 30%
    gnosisProxy, // address _governance
  ]);

  const proxy = await deployOrLoadAndVerify(
    "WMasterChefV2",
    "TransparentUpgradeableProxy",
    [implementation.address, gnosisProxy, initDecode]
  );

  const instance = await ethers.getContractAt("WMasterChefV2", proxy.address);
  console.log("WMasterChefV2 deployed at", instance.address);

  console.log("done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
