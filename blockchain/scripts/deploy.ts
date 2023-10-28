import { ethers } from "hardhat";

import { deployStorages } from "./deploy/deployStorages";
import {deployBaseWalletAndFactory} from "./deploy/deployBaseWalletAndFactory";
import {deployRegistries} from "./deploy/deployRegistries";
import {deployArgentModule} from "./deploy/deployArgentModule";
import {deployUniswapMock} from "./deploy/deployUniswapMock";
import {envConfig} from "./utils/envConfig";



async function main() {

    // Config
    const config = new envConfig();
    const network = await ethers.provider.getNetwork();
    const networkName = network.name.toUpperCase();


    // Accounts
    const [deployer, account1, account2] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const account1Address = await account1.getAddress();
    const account2Address = await account2.getAddress();
    console.log("Deploying contracts with the account:", deployerAddress);
    console.log("EAO account1:", account1Address);
    console.log("EAO account2:", account2Address);


    // Storages
    const {guardianStorage, transferStorage} = await deployStorages();
    const guardianStorageAddress = await guardianStorage.getAddress();
    const transferStorageAddress = await transferStorage.getAddress();
    config.setValue(`${networkName}_GUARDIAN_STORAGE_ADDRESS`, guardianStorageAddress);
    config.setValue(`${networkName}_TRANSFER_STORAGE_ADDRESS`, transferStorageAddress);
    console.log("GuardianStorage deployed to:", guardianStorageAddress);
    console.log("TransferStorage deployed to:", transferStorageAddress);

    // BaseWallet and WalletFactory
    const {baseWallet, walletFactory} = await deployBaseWalletAndFactory(guardianStorageAddress, account1Address);
    const baseWalletAddress = await baseWallet.getAddress();
    const walletFactoryAddress = await walletFactory.getAddress();
    config.setValue(`${networkName}_BASE_WALLET_ADDRESS`, baseWalletAddress);
    config.setValue(`${networkName}_WALLET_FACTORY_ADDRESS`, walletFactoryAddress);
    console.log("BaseWallet deployed to:", baseWalletAddress);
    console.log("WalletFactory deployed to:", walletFactoryAddress);

    // Registries
    const {moduleRegistry, dapRegistry} = await deployRegistries();
    const moduleRegistryAddress = await moduleRegistry.getAddress();
    const dapRegistryAddress = await dapRegistry.getAddress();
    config.setValue(`${networkName}_MODULE_REGISTRY_ADDRESS`, moduleRegistryAddress);
    config.setValue(`${networkName}_DAP_REGISTRY_ADDRESS`, dapRegistryAddress);
    console.log("ModuleRegistry deployed to:", moduleRegistryAddress);
    console.log("DappRegistry deployed to:", dapRegistryAddress);

    // Argent Wallet Detector : not needed for now


    // MultiCallHelper : not needed for now


    // Mock Uniswap
    const { uniswapFactory, uniswapRouter } = await deployUniswapMock();
    const uniswapFactoryAddress = await uniswapFactory.getAddress();
    const uniswapRouterAddress = await uniswapRouter.getAddress();
    config.setValue(`${networkName}_UNISWAP_FACTORY_ADDRESS`, uniswapFactoryAddress);
    config.setValue(`${networkName}_UNISWAP_ROUTER_ADDRESS`, uniswapRouterAddress);
    console.log("UniswapFactory deployed to:", uniswapFactoryAddress);
    console.log("UniswapRouter deployed to:", uniswapRouterAddress);

    // Argent Module
    const { argentModule } = await deployArgentModule(moduleRegistryAddress, guardianStorageAddress, transferStorageAddress, dapRegistryAddress, uniswapRouterAddress);
    const argentModuleAddress = await argentModule.getAddress();
    config.setValue(`${networkName}_ARGENT_MODULE_ADDRESS`, argentModuleAddress);
    console.log("ArgentModule deployed to:", argentModuleAddress);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
