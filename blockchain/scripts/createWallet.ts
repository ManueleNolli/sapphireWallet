import {generateSalt} from "./utils/genericUtils";
import {EventLog, ZeroAddress} from "ethers";
import {WalletFactory} from "../typechain-types";
import {getENVValue} from "./utils/env/envConfig";
import {ethers} from "hardhat";

/**
 * Create a wallet
 * @param walletFactory contract
 * @param owner address
 * @param guardian address
 * @param manager address
 */
export async function createWallet(walletFactory: WalletFactory, owner: string, guardian: string, manager: string, baseWalletAddress: string) {

    const tx = await walletFactory.connect(await ethers.provider.getSigner(manager)).createCounterfactualWallet(
        owner,
        [baseWalletAddress],
        guardian,
        await generateSalt(),
        0,
        ZeroAddress,
        "0x",
        "0x"
    )
    const receipt = await tx.wait();
    const events = receipt?.logs[4];
    if (events instanceof EventLog) { // TODO: check if this is the right way to do it, I tried with listener but it didn't work
        return events.args[0]
    } else {
        throw new Error("No event found during wallet creation")
    }
}


