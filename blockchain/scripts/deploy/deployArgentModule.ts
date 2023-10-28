import { ethers } from "hardhat";

export async function deployArgentModule(moduleRegistryAddress: string, guardianStorageAddress: string, transferStorageAddress: string, authoriserAddress: string, uniswapRouterAddress: string){
    // Module Registry
    const ArgentModule = await ethers.getContractFactory("ArgentModule");
    const argentModuleDeployment = await ArgentModule.deploy(
        moduleRegistryAddress,
        guardianStorageAddress,
        transferStorageAddress,
        authoriserAddress,
        uniswapRouterAddress,
    0,
    0,
    0,
    0
    );
    await argentModuleDeployment.waitForDeployment();

    return { argentModule: argentModuleDeployment};
}
