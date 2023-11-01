import {ethers} from "hardhat";

import {deployStorages} from "./deployStorages";
import {deployBaseWalletAndFactory} from "./deployBaseWalletAndFactory";
import {deployRegistries} from "./deployRegistries";
import {deployArgentModule} from "./deployArgentModule";
import {deployUniswapMock} from "./deployUniswapMock";
import {setENVValue} from "../utils/env/envConfig";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {Infrastructure} from "../type/infrastructure";

/**
 * Deploy all infrastructure contracts
 *
 */
async function _deployInfrastructure(deployer: HardhatEthersSigner): Promise<Infrastructure> {

    /* Account */
    const deployerAddress = await deployer.getAddress();

    /* Storages */
    const {guardianStorage, transferStorage} = await deployStorages();
    const guardianStorageAddress = await guardianStorage.getAddress();
    const transferStorageAddress = await transferStorage.getAddress();
    // await setENVValue("GUARDIAN_STORAGE_ADDRESS", guardianStorageAddress);
    // await setENVValue("TRANSFER_STORAGE_ADDRESS", transferStorageAddress);
    // console.log("GuardianStorage deployed to:", guardianStorageAddress);
    // console.log("TransferStorage deployed to:", transferStorageAddress);

    /* BaseWallet and WalletFactory */
    const {baseWallet, walletFactory} = await deployBaseWalletAndFactory(guardianStorageAddress, deployerAddress);
    // const baseWalletAddress = await baseWallet.getAddress();
    // const walletFactoryAddress = await walletFactory.getAddress();
    // await setENVValue("BASE_WALLET_ADDRESS", baseWalletAddress);
    // await setENVValue("WALLET_FACTORY_ADDRESS", walletFactoryAddress);
    // console.log("BaseWallet deployed to:", baseWalletAddress);
    // console.log("WalletFactory deployed to:", walletFactoryAddress);

    // Add deployer as manager
    await walletFactory.connect(deployer).addManager(deployerAddress);


    /* Registries */
    const {moduleRegistry, dappRegistry} = await deployRegistries();
    const moduleRegistryAddress = await moduleRegistry.getAddress();
    const dappRegistryAddress = await dappRegistry.getAddress();
    // // await setENVValue("MODULE_REGISTRY_ADDRESS", moduleRegistryAddress);
    // // await setENVValue("DAPP_REGISTRY_ADDRESS", dappRegistryAddress);
    // console.log("ModuleRegistry deployed to:", moduleRegistryAddress);
    // console.log("DappRegistry deployed to:", dappRegistryAddress);

    /* Argent Wallet Detector : not needed for now */


    /* MultiCallHelper : not needed for now */


    /* Mock Uniswap */
    const {uniswapFactory, uniswapRouter} = await deployUniswapMock();
    // const uniswapFactoryAddress = await uniswapFactory.getAddress();
    const uniswapRouterAddress = await uniswapRouter.getAddress();
    // await setENVValue("UNISWAP_FACTORY_ADDRESS", uniswapFactoryAddress);
    // await setENVValue("UNISWAP_ROUTER_ADDRESS", uniswapRouterAddress);
    // console.log("UniswapFactory deployed to:", uniswapFactoryAddress);
    // console.log("UniswapRouter deployed to:", uniswapRouterAddress);

    /* Argent Module */
    const {argentModule} = await deployArgentModule(moduleRegistryAddress, guardianStorageAddress, transferStorageAddress, dappRegistryAddress, uniswapRouterAddress);
    // const argentModuleAddress = await argentModule.getAddress();
    // await setENVValue("ARGENT_MODULE_ADDRESS", argentModuleAddress);
    // console.log("ArgentModule deployed to:", argentModuleAddress);

    return {
        guardianStorage,
        transferStorage,
        baseWallet,
        walletFactory,
        moduleRegistry,
        dappRegistry,
        uniswapFactoryMock: uniswapFactory,
        uniswapRouterMock: uniswapRouter,
        argentModule
    }
}

export default async function deployInfrastructure(deployer: HardhatEthersSigner): Promise<Infrastructure> {
    try {
        return await _deployInfrastructure(deployer);
    } catch (error) {
        console.error(error);
        throw new Error('Infrastructure deployment failed');
    }
}