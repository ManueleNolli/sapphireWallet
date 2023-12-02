import { ethers } from "hardhat";
import deployInfrastructure from "./deploy/deployInfrastructure";
import updateHardhatENV from "./utils/env/updateHardhatENV";
import printInfrastructure from "./utils/printInfrastructure";
import updateExternalEnv, { EnvValue } from "./external/updateExternalEnv";

export default async function deploy() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const network = await ethers.provider.getNetwork();
  const networkName = network.name.toUpperCase();

  console.log("\x1b[31mNetwork: \x1b[0m", networkName);

  ////////////
  // DEPLOY
  ////////////
  console.log("Deploying contracts with the account:", deployerAddress);
  const result = await deployInfrastructure(deployer)
    .then(updateHardhatENV)
    .then(printInfrastructure);

  ////////////////////////
  // UPDATE EXTERNAL ENV
  ////////////////////////
  console.log("\nCopy env key to external module (mobileapp, backend)...");

  console.log("Updating wallet-factory backend env...");
  const walletFactoryBackendEnv: EnvValue[] = [
    {
      key: networkName + "_" + "WALLET_FACTORY_ADDRESS",
      value: result.walletFactoryAddress,
    },
    {
      key: networkName + "_" + "ARGENT_MODULE_ADDRESS",
      value: result.argentModuleAddress,
    },
  ];
  await updateExternalEnv(
    "../backend/wallet-factory/.env",
    walletFactoryBackendEnv
  );
  console.log("Updated wallet-factory backend env!");

  console.log("\x1b[32mDone\x1b[0m");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
