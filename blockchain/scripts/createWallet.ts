import {generateSalt} from "./utils/generateSalt";
import {ContractTransactionResponse, ZeroAddress} from "ethers";
import {WalletFactory} from "../typechain-types";
import {getENVValue} from "./utils/envConfig";
import {ethers} from "hardhat";

async function getEvent(tx: ContractTransactionResponse) {
    const receipt = await tx.wait();
    const events = receipt?.logs[0];
    return events?.topics
}

export async function createWallet(walletFactory: WalletFactory, owner: string, guardian: string, manager: string) {
    const tx = await walletFactory.connect(await ethers.provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")).createCounterfactualWallet(
        owner,
        [getENVValue("BASE_WALLET_ADDRESS")],
        guardian,
        await generateSalt(),
        0,
        ZeroAddress,
        "0x",
        "0x"
    )

    const eventValues = await getEvent(tx);
    if (eventValues === undefined) {
        throw new Error("No event found during wallet creation");
    }
    return eventValues[0];
}


