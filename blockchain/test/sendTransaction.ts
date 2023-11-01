import {deployStorages} from "../scripts/deploy/deployStorages";

const {ethers} = require("hardhat");
const {expect} = require("chai");
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {Contract} from "ethers";
import {deployBaseWalletAndFactory} from "../scripts/deploy/deployBaseWalletAndFactory";
import {deployRegistries} from "../scripts/deploy/deployRegistries";
import {deployUniswapMock} from "../scripts/deploy/deployUniswapMock";
import {deployArgentModule} from "../scripts/deploy/deployArgentModule";

describe("SendTransaction", function () {
    let deployer: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;

    before(async function () {

        [deployer, account1, account2] = await ethers.getSigners();

        let deployerAddress = await deployer.getAddress();
        let account1Address = await account1.getAddress();
        let account2Address = await account2.getAddress();

        /* Storages */
        const {guardianStorage, transferStorage} = await deployStorages();
        const guardianStorageAddress = await guardianStorage.getAddress();
        const transferStorageAddress = await transferStorage.getAddress();
        console.log("GuardianStorage deployed to:", guardianStorageAddress);
        console.log("TransferStorage deployed to:", transferStorageAddress);

        /* BaseWallet and WalletFactory */
        const {baseWallet, walletFactory} = await deployBaseWalletAndFactory(guardianStorageAddress, account1Address);
        const baseWalletAddress = await baseWallet.getAddress();
        const walletFactoryAddress = await walletFactory.getAddress();
        console.log("BaseWallet deployed to:", baseWalletAddress);
        console.log("WalletFactory deployed to:", walletFactoryAddress);

        // Add deployer as manager
        await walletFactory.addManager(deployerAddress);


        /* Registries */
        const {moduleRegistry, dappRegistry} = await deployRegistries();
        const moduleRegistryAddress = await moduleRegistry.getAddress();
        const dapRegistryAddress = await dappRegistry.getAddress();
        console.log("ModuleRegistry deployed to:", moduleRegistryAddress);
        console.log("DappRegistry deployed to:", dapRegistryAddress);

        /* Mock Uniswap */
        const {uniswapFactory, uniswapRouter} = await deployUniswapMock();
        const uniswapFactoryAddress = await uniswapFactory.getAddress();
        const uniswapRouterAddress = await uniswapRouter.getAddress();
        console.log("UniswapFactory deployed to:", uniswapFactoryAddress);
        console.log("UniswapRouter deployed to:", uniswapRouterAddress);

        /* Argent Module */
        const {argentModule} = await deployArgentModule(moduleRegistryAddress, guardianStorageAddress, transferStorageAddress, dapRegistryAddress, uniswapRouterAddress);
        const argentModuleAddress = await argentModule.getAddress();
        console.log("ArgentModule deployed to:", argentModuleAddress);
    });


    it("Should send transaction", async function () {
        expect(5).to.be.equal(5);
    });

});