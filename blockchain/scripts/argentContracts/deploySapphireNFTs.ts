import { ethers } from "hardhat";

export async function deploySapphireNFTs() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const SapphireNFT = await ethers.getContractFactory("SapphireNFTs");

  const sapphireNFTDeployment = await SapphireNFT.deploy(deployerAddress);
  const contract = await sapphireNFTDeployment.waitForDeployment();

  // Print address
  console.log("SapphireNFT deployed to: ", await contract.getAddress());
  console.log("SapphireNFT deployer: ", deployerAddress);
}

deploySapphireNFTs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
