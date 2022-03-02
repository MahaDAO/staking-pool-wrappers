import hre, { ethers } from "hardhat";
// const hre = require("hardhat");

async function main() {
  const constructorArguments = [""];

  // We get the contract to deploy
  const WMasterChef = await ethers.getContractFactory("WMasterChef");
  const instance = await WMasterChefz.deploy(
    String(constructorArguments[0]),
    String(constructorArguments[1]),
    String(constructorArguments[2]),
    String(constructorArguments[3]),
    String(constructorArguments[4]),
    constructorArguments[5]
  );

  await instance.deployed();
  console.log("WMasterChef deployed to:", instance.address);

  await hre.run("verify:verify", {
    address: instanceof.address,
    contract: "contracts/WMasterChef.sol:WMasterChef",
    constructorArguments,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
