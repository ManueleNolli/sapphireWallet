import { ethers } from "hardhat";
import deployInfrastructure from "./argentContracts/deployInfrastructure";
import updateHardhatENV from "./utils/env/updateHardhatENV";
import printInfrastructure from "./argentContracts/utils/printInfrastructure";
import updateExternalEnv, { EnvValue } from "./utils/env/updateExternalEnv";
import Constants from "./constants/constants";

export default async function deployBaseChain() {
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
  console.log(
    "\nCopy env key to external module (mobileapp, backend, bridge)..."
  );

  // WalletFactory
  console.log("Updating wallet-factory backend env...");
  const walletFactoryBackendEnv: EnvValue[] = [
    {
      key: networkName + "_" + Constants.envValues.walletFactory,
      value: result.walletFactoryAddress,
    },
    {
      key: networkName + "_" + Constants.envValues.argentModule,
      value: result.argentModuleAddress,
    },
  ];
  await updateExternalEnv(
    "../backend/wallet-factory/.env",
    walletFactoryBackendEnv
  );
  console.log("Updated wallet-factory backend env!");

  // SapphireRelayer
  console.log("Updating sapphire-relayer backend env...");
  const sapphireRelayerBackendEnv: EnvValue[] = [
    {
      key: networkName + "_" + Constants.envValues.dappRegistry,
      value: result.dappRegistryAddress,
    },
    {
      key: networkName + "_" + Constants.envValues.argentModule,
      value: result.argentModuleAddress,
    },
  ];
  await updateExternalEnv(
    "../backend/sapphire-relayer/.env",
    sapphireRelayerBackendEnv
  );
  console.log("Updated sapphire-relayer backend env!");

  // MobileApp
  console.log("Updating mobileapp env...");
  const mobileappEnv: EnvValue[] = [
    {
      key: networkName + "_" + Constants.envValues.argentModule,
      value: result.argentModuleAddress,
    },
  ];
  await updateExternalEnv("../mobileapp/.env", mobileappEnv);
  console.log("Updated mobileapp env!");

  // MobileApp
  console.log("Updating bridge env...");
  const bridgeEnv: EnvValue[] = [
    {
      key: networkName + "_" + Constants.envValues.argentModule,
      value: result.argentModuleAddress,
    },
  ];
  await updateExternalEnv("../bridge/basicOffChainBridge/.env", mobileappEnv);
  console.log("Updated bridge env!");

  ////////////
  // DONE :)
  ////////////
  console.log("\x1b[32mDone\x1b[0m");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployBaseChain().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
