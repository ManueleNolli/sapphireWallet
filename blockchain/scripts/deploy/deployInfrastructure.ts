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

    /* BaseWallet and WalletFactory */
    const {baseWallet, walletFactory} = await deployBaseWalletAndFactory(guardianStorageAddress, deployerAddress);

    // Add deployer as manager
    await walletFactory.connect(deployer).addManager(deployerAddress);


    /* Registries */
    const {moduleRegistry, dappRegistry} = await deployRegistries();
    const moduleRegistryAddress = await moduleRegistry.getAddress();
    const dappRegistryAddress = await dappRegistry.getAddress();

    /* Argent Wallet Detector : not needed for now */


    /* MultiCallHelper : not needed for now */


    /* Mock Uniswap */
    const {uniswapFactory, uniswapRouter} = await deployUniswapMock();
    const uniswapRouterAddress = await uniswapRouter.getAddress();

    /* Argent Module */
    const {argentModule} = await deployArgentModule(moduleRegistryAddress, guardianStorageAddress, transferStorageAddress, dappRegistryAddress, uniswapRouterAddress);

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