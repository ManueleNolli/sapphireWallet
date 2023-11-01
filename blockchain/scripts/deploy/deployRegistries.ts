import { ethers } from "hardhat";

export async function deployRegistries() {
    // Module Registry
    const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
    const moduleRegistryDeployment = await ModuleRegistry.deploy();
    await moduleRegistryDeployment.waitForDeployment();

    // Token Registry
    // Not needed for now

    // Dapp Registry
    const DappRegistry = await ethers.getContractFactory("DappRegistry");
    const dappRegistryDeployment = await DappRegistry.deploy(0);
    await dappRegistryDeployment.waitForDeployment();

    return { moduleRegistry: moduleRegistryDeployment, dappRegistry: dappRegistryDeployment};
}
