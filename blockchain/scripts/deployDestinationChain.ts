import { ethers } from "hardhat";
import deployInfrastructure from "./argentContracts/deployInfrastructure";
import updateHardhatENV from "./utils/env/updateHardhatENV";
import printInfrastructure from "./argentContracts/utils/printInfrastructure";
import updateExternalEnv, { EnvValue } from "./utils/env/updateExternalEnv";
import Constants from "./constants/constants";

export default async function deployDestinationChain() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const network = await ethers.provider.getNetwork();
  const networkName = network.name.toUpperCase();

  console.log("\x1b[31mNetwork: \x1b[0m", networkName);

  ////////////
  // DEPLOY
  ////////////
  console.log("Deploying contracts with the account:", deployerAddress);
  const ArgentWrappedAccounts = await ethers.getContractFactory(
    "ArgentWrappedAccounts"
  );
  const argentWrappedAccountsDeployment = await ArgentWrappedAccounts.deploy();
  await argentWrappedAccountsDeployment.waitForDeployment();

  console.log(
    "ArgentWrappedAccounts deployed to:",
    await argentWrappedAccountsDeployment.getAddress()
  );

  ////////////
  // DONE :)
  ////////////
  console.log("\x1b[32mDone\x1b[0m");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployDestinationChain().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
