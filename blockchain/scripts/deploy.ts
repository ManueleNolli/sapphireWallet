import { ethers } from "hardhat";

import { deployStorages } from "./deploy/deployStorages";
import {deployBaseWalletAndFactory} from "./deploy/deployBaseWalletAndFactory";
import {deployRegistries} from "./deploy/deployRegistries";
import {deployArgentModule} from "./deploy/deployArgentModule";
import {deployUniswapMock} from "./deploy/deployUniswapMock";
import {setENVValue} from "./utils/envConfig";



async function main() {

    /* Accounts */
    const [deployer, account1, account2] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const account1Address = await account1.getAddress();
    const account2Address = await account2.getAddress();
    console.log("Deploying contracts with the account:", deployerAddress);
    console.log("EOA account1:", account1Address);
    console.log("EOA account2:", account2Address);


    /* Storages */
    const {guardianStorage, transferStorage} = await deployStorages();
    const guardianStorageAddress = await guardianStorage.getAddress();
    const transferStorageAddress = await transferStorage.getAddress();
    await setENVValue("GUARDIAN_STORAGE_ADDRESS", guardianStorageAddress);
    await setENVValue("TRANSFER_STORAGE_ADDRESS", transferStorageAddress);
    console.log("GuardianStorage deployed to:", guardianStorageAddress);
    console.log("TransferStorage deployed to:", transferStorageAddress);

    /* BaseWallet and WalletFactory */
    const {baseWallet, walletFactory} = await deployBaseWalletAndFactory(guardianStorageAddress, account1Address);
    const baseWalletAddress = await baseWallet.getAddress();
    const walletFactoryAddress = await walletFactory.getAddress();
    await setENVValue("BASE_WALLET_ADDRESS", baseWalletAddress);
    await setENVValue("WALLET_FACTORY_ADDRESS", walletFactoryAddress);
    console.log("BaseWallet deployed to:", baseWalletAddress);
    console.log("WalletFactory deployed to:", walletFactoryAddress);

    // Add deployer as manager
    await walletFactory.connect(deployer).addManager(deployerAddress);


    /* Registries */
    const {moduleRegistry, dapRegistry} = await deployRegistries();
    const moduleRegistryAddress = await moduleRegistry.getAddress();
    const dapRegistryAddress = await dapRegistry.getAddress();
    await setENVValue("MODULE_REGISTRY_ADDRESS", moduleRegistryAddress);
    await setENVValue("DAPP_REGISTRY_ADDRESS", dapRegistryAddress);
    console.log("ModuleRegistry deployed to:", moduleRegistryAddress);
    console.log("DappRegistry deployed to:", dapRegistryAddress);

    /* Argent Wallet Detector : not needed for now */


    /* MultiCallHelper : not needed for now */


    /* Mock Uniswap */
    const { uniswapFactory, uniswapRouter } = await deployUniswapMock();
    const uniswapFactoryAddress = await uniswapFactory.getAddress();
    const uniswapRouterAddress = await uniswapRouter.getAddress();
    await setENVValue("UNISWAP_FACTORY_ADDRESS", uniswapFactoryAddress);
    await setENVValue("UNISWAP_ROUTER_ADDRESS", uniswapRouterAddress);
    console.log("UniswapFactory deployed to:", uniswapFactoryAddress);
    console.log("UniswapRouter deployed to:", uniswapRouterAddress);

    /* Argent Module */
    const { argentModule } = await deployArgentModule(moduleRegistryAddress, guardianStorageAddress, transferStorageAddress, dapRegistryAddress, uniswapRouterAddress);
    const argentModuleAddress = await argentModule.getAddress();
    await setENVValue("ARGENT_MODULE_ADDRESS", argentModuleAddress);
    console.log("ArgentModule deployed to:", argentModuleAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
