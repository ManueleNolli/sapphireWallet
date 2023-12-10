import { ethers } from "hardhat";

export async function deployRegisters() {
  // Module Registry
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistryDeployment = await ModuleRegistry.deploy();
  await moduleRegistryDeployment.waitForDeployment();

  // Token Registry
  // Not needed for now

  // Dapp Registry argent
  // const DappRegistry = await ethers.getContractFactory("DappRegistry");
  // const dappRegistryDeployment = await DappRegistry.deploy(0);
  // await dappRegistryDeployment.waitForDeployment();

  // Sapphire Dapp Registry
  const DappRegistry = await ethers.getContractFactory("SapphireAuthoriser");
  const dappRegistryDeployment = await DappRegistry.deploy();
  await dappRegistryDeployment.waitForDeployment();

  return {
    moduleRegistry: moduleRegistryDeployment,
    dappRegistry: dappRegistryDeployment,
  };
}
