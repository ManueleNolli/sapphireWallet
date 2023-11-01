import {ethers} from "hardhat";
import {getENVValue} from "./utils/env/envConfig";
import {createWallet} from "./createWallet";
import {Signer, ZeroAddress} from "ethers";

async function getNonceForRelay(): Promise<string> {
    const block = await ethers.provider.getBlockNumber();
    const timestamp = new Date().getTime();
    return `0x${ethers.zeroPadValue(ethers.toBeHex(block), 16).slice(2)}${ethers.zeroPadValue(ethers.toBeHex(timestamp), 16).slice(2)}`;
}

async function signOffchain(
    signers: Signer[],
    from: string,
    value: number,
    data: string,
    chainId: bigint,
    nonce: string,
    gasPrice: number,
    gasLimit: number,
    refundToken: string,
    refundAddress: string
): Promise<string> {
    const messageHash = getMessageHash(
        from,
        value,
        data,
        chainId,
        nonce,
        gasPrice,
        gasLimit,
        refundToken,
        refundAddress
    );

    const signatures = await Promise.all(
        signers.map(async (signer) => {
            const sig = await signMessage(messageHash, signer);
            return sig.slice(2);
        })
    );

    const joinedSignatures = '0x' + signatures.join('');

    return joinedSignatures;
}

function getMessageHash(
    from: string,
    value: number,
    data: string,
    chainId: bigint,
    nonce: string,
    gasPrice: number,
    gasLimit: number,
    refundToken: string,
    refundAddress: string
): string {
    const message = `0x${[
        '0x19',
        '0x00',
        from,
        ethers.zeroPadValue(ethers.toBeHex(value), 32),
        data,
        ethers.zeroPadValue(ethers.toBeHex(chainId), 32),
        nonce,
        ethers.zeroPadValue(ethers.toBeHex(gasPrice), 32),
        ethers.zeroPadValue(ethers.toBeHex(gasLimit), 32),
        refundToken,
        refundAddress,
    ]
        .map((hex) => hex.slice(2))
        .join('')}`;

    const messageHash = ethers.keccak256(message);
    return messageHash;
}

async function signMessage(message: string, signer: Signer): Promise<string> {
    const sig = await signer.signMessage(message);
    let v = parseInt(sig.substring(130, 132), 16);
    if (v < 27) v += 27;
    const normalizedSig = `${sig.substring(0, 130)}${v.toString(16)}`;
    return normalizedSig;
}


async function main() {

    // Accounts
    const [deployer, account1, account2] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const account1Address = await account1.getAddress();
    const account2Address = await account2.getAddress();
    console.log("Deploying contracts with the account:", deployerAddress);
    console.log("EOA account1:", account1Address);
    console.log("EOA account2:", account2Address);

    // WalletFactory
    const walletFactoryAddress = await getENVValue("WALLET_FACTORY_ADDRESS");
    console.log("WalletFactory address: ", walletFactoryAddress);
    const walletFactory = await ethers.getContractAt("WalletFactory", walletFactoryAddress);

    // Create wallet for account1
    const walletAccount1Address = await createWallet(walletFactory, account1Address, account2Address, deployerAddress)
    console.log("Wallet created for account1: ", walletAccount1Address);

    /**** Send eth from walletAccount1 to account2 EAO ****/

        // Get ArgentModule address
    const moduleAddress = await getENVValue("ARGENT_MODULE_ADDRESS");
    const module = await ethers.getContractAt("ArgentModule", moduleAddress);
    console.log("ArgentModule address: ", moduleAddress)

    // Preparing transaction to send eth from walletAccount1 to account2, it is a multiCall transaction
    const transaction = {to: account2Address, value: ethers.parseEther("10"), data: "0x"};

    // get the ABI of the function to call
    const multiCallABI = module.interface.getFunction("multiCall");
    const multiCallInterface = new ethers.Interface([multiCallABI]);
    const methodData = multiCallInterface.encodeFunctionData(multiCallABI, [walletAccount1Address, [transaction]]);

    // Sign *offChain* the transaction
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const nonce = await getNonceForRelay();
    const gasLimit = 1000000;
    const signatures = await signOffchain(
        [account1],
        moduleAddress,
        0,
        methodData,
        chainId,
        nonce,
        0,
        gasLimit,
        "0x0000000000000000000000000000000000000000",
        ZeroAddress
    );

    console.log("Signatures: ", signatures);

    // Send the transaction
    // const tx = await module.connect(account1).clearSession(walletAccount1Address);
    // console.log("walletAccount1Address: ", walletAccount1Address)
    // console.log("methodData: ", methodData)
    // console.log("nonce: ", nonce)
    // console.log("signatures: ", signatures)
    // console.log("gasLimit: ", gasLimit)

    const tx = await module.connect(deployer).execute(
        walletAccount1Address,
        methodData,
        nonce,
        signatures,
        0,
        gasLimit,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
    );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
