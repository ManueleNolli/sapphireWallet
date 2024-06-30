import { ethers } from "hardhat";

export async function deployBaseWalletAndFactory(guardianStorageAddress: string, refundAddress: string) {
    const BaseWallet = await ethers.getContractFactory("BaseWallet");
    const baseWalletDeployment = await BaseWallet.deploy();
    await baseWalletDeployment.waitForDeployment();

    const WalletFactory = await ethers.getContractFactory("WalletFactory");
    const walletFactoryDeployment = await WalletFactory.deploy(baseWalletDeployment.getAddress(), guardianStorageAddress, refundAddress);
    await walletFactoryDeployment.waitForDeployment()

    return { baseWallet: baseWalletDeployment, walletFactory: walletFactoryDeployment };
}
