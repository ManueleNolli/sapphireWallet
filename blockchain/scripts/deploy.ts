import { ethers } from "hardhat";

import { deployStorages } from "./deploy/deployStorages";

async function main() {
    const {guardianStorage, transferStorage} = await deployStorages();
    console.log("GuardianStorage deployed to:", await guardianStorage.getAddress());
    console.log("TransferStorage deployed to:", await transferStorage.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
