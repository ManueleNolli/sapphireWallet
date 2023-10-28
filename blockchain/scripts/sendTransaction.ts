import { ethers } from "hardhat";
import {envConfig} from './utils/envConfig';

async function main() {

    const config = new envConfig();

    // Get network name

    // const [account1, account2] = await ethers.getSigners();
    // const account1Address = await account1.getAddress();
    // const account2Address = await account2.getAddress();
    // console.log("EAO account1:", account1Address);
    // console.log("EAO account2:", account2Address);
    //
    // // Send 10 ETH from account1 to account2
    // const tx = await account1.sendTransaction({
    //     to: account2Address,
    //     value: ethers.parseEther("10.0")
    // });
    //
    // // The operation is NOT complete yet; we must wait until it is mined
    // await tx.wait();
    //
    // console.log("Transaction complete");
    //
    // // print balances
    // const balance1 = await ethers.provider.getBalance(account1Address);
    // const balance2 = await ethers.provider.getBalance(account2Address);
    // console.log("Balance account1:", ethers.formatEther(balance1));
    // console.log("Balance account2:", ethers.formatEther(balance2));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
