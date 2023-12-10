import { ethers } from "hardhat";

export async function deployStorages() {
    const GuardianStorage = await ethers.getContractFactory("GuardianStorage");
    const guardianStorageDeployment = await GuardianStorage.deploy();
    await guardianStorageDeployment.waitForDeployment();

    const TransferStorage = await ethers.getContractFactory("TransferStorage");
    const transferStorageDeployment = await TransferStorage.deploy();
    await transferStorageDeployment.waitForDeployment()

    return { guardianStorage: guardianStorageDeployment, transferStorage: transferStorageDeployment };
}
