import {ethers} from "hardhat";

export async function generateSalt(): Promise<string> {
    return ethers.zeroPadValue(ethers.randomBytes(20), 20);
}
