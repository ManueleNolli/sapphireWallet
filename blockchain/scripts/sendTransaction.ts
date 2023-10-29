import {ethers} from "hardhat";
import {getENVValue} from "./utils/envConfig";
import {createWallet} from "./createWallet";

async function main() {

    // Accounts
    const [deployer, account1, account2] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const account1Address = await account1.getAddress();
    const account2Address = await account2.getAddress();

    // WalletFactory
    const walletFactoryAddress = await getENVValue("WALLET_FACTORY_ADDRESS");
    console.log("WalletFactory address: ", walletFactoryAddress);
    const walletFactory = await ethers.getContractAt("WalletFactory", walletFactoryAddress);

    // Create wallet for account1
    const walletAccount1 = await createWallet(walletFactory, account1Address, account2Address, deployerAddress)
    console.log("Wallet created for account1: ", walletAccount1);

    const baseWallet = await ethers.getContractAt("BaseWallet", walletAccount1);
    console.log("BaseWallet address: ", await baseWallet.getAddress());

    // Send eth from walletAccount1 to account2 EAO
    const moduleAddress = await getENVValue("ARGENT_MODULE_ADDRESS");
    const module = await ethers.getContractAt("ArgentModule", moduleAddress);

    const transaction = {to: account2Address, value: ethers.parseEther("10"), data: "0x"};
    const tx = await module.connect(account1).multiCall(walletAccount1, [transaction]);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
