import { ethers } from "hardhat";
import updateExternalEnv, { EnvValue } from "../utils/env/updateExternalEnv";

export default async function deploy() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const network = await ethers.provider.getNetwork();
  const networkName = network.name.toUpperCase();

  console.log("\x1b[31mNetwork: \x1b[0m", networkName);

  ////////////
  // DEPLOY
  ////////////
  const SapphireNFTs = await ethers.getContractFactory("SapphireNFTs");
  const sapphireNFTsDeployment = await SapphireNFTs.deploy(deployerAddress);
  await sapphireNFTsDeployment.waitForDeployment();
  const contractAddress = await sapphireNFTsDeployment.getAddress();
  console.log("SapphireNFTs deployed to:", contractAddress);

  ////////////////////////
  // UPDATE EXTERNAL ENV
  ////////////////////////
  console.log("\nCopy env key to external module mobileapp...");

  // MobileApp
  console.log("Updating mobileapp env...");
  const mobileappEnv: EnvValue[] = [
    {
      key: networkName + "_" + "SAPPHIRE_NFTS_ADDRESS",
      value: contractAddress,
    },
  ];
  await updateExternalEnv("../mobileapp/.env", mobileappEnv);
  console.log("Updated mobileapp env!");

  ////////////
  // DONE :)
  ////////////
  console.log("\x1b[32mDone\x1b[0m");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
