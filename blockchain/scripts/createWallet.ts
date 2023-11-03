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
export async function createWallet(walletFactory: WalletFactory, owner: string, guardian: string, manager: string, authorisedModule: string) {
    const salt = await generateSalt();

    const expectedAddress = await walletFactory.getAddressForCounterfactualWallet(
        owner,
        [authorisedModule],
        guardian,
        salt
    )

    const tx = await walletFactory.connect(await ethers.provider.getSigner(manager)).createCounterfactualWallet(
        owner,
        [authorisedModule],
        guardian,
        salt,
        0,
        ZeroAddress,
        "0x",
        "0x"
    )
    await tx.wait();

    return expectedAddress
}


