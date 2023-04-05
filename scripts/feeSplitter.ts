// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deployOrLoadAndVerify } from "./utils";

async function main() {
  const [deployer] = await ethers.getSigners();

  const gnosisProxy = "0x575e143702a015d09F298663405d1eD7fD20f0dD";
  const admin = "0x77cd66d59ac48a0E7CE54fF16D9235a5fffF335E";

  const e6 = BigNumber.from(10).pow(6);
  const percentages = [e6];

  console.log("Deploying FeesSplitter...", deployer.address);

  const factory = await ethers.getContractFactory("FeesSplitter");
  const implementation = await deployOrLoadAndVerify(
    "FeesSplitterImpl",
    "FeesSplitter",
    []
  );

  // deploy as proxy
  console.log("Deploying proxy...");
  const initDecode = factory.interface.encodeFunctionData("initialize", [
    ["0x6357EDbfE5aDA570005ceB8FAd3139eF5A8863CC"],
    percentages, // uint32[] memory _percentAllocations,
    admin,
  ]);

  const proxy = await deployOrLoadAndVerify(
    "FeesSplitter",
    "TransparentUpgradeableProxy",
    [implementation.address, gnosisProxy, initDecode]
  );

  const instance = await ethers.getContractAt("FeesSplitter", proxy.address);
  console.log("FeesSplitter deployed at", instance.address);

  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
