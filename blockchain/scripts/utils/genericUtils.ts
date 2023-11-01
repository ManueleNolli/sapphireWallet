import {ethers} from "hardhat";
import {Signer} from "ethers/lib.esm";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Generate a random salt
 */
export async function generateSalt(): Promise<string> {
    return ethers.zeroPadValue(ethers.randomBytes(20), 20);
}

/**
 * Generate a random salt for relay
 */
export async function generateNonceForRelay(): Promise<string> {
    const block = await ethers.provider.getBlockNumber();
    const timestamp = new Date().getTime();
    return `0x${ethers.zeroPadValue(ethers.toBeHex(block), 16).slice(2)}${ethers.zeroPadValue(ethers.toBeHex(timestamp), 16).slice(2)}`;
}

/**
 * Sign a transaction offchain
 * @param signers
 * @param from
 * @param value
 * @param data
 * @param chainId
 * @param nonce
 * @param gasPrice
 * @param gasLimit
 * @param refundToken
 * @param refundAddress
 */
export async function signOffchain(
    signers: HardhatEthersSigner[],
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
    const messageHash = generateMessageHash(
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

/**
 * Generate a message hash
 * @param from
 * @param value
 * @param data
 * @param chainId
 * @param nonce
 * @param gasPrice
 * @param gasLimit
 * @param refundToken
 * @param refundAddress
 */
export function generateMessageHash(
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

    // Add also the text "\x19Ethereum Signed Message:\n32" to the message hash
    // https://docs.ethers.io/v5/api/utils/hashing/#utils-keccak256

    const prefix = ethers.hexlify(ethers.toUtf8Bytes("\x19Ethereum Signed Message:\n32"));
    const messageHashWithPrefix = ethers.keccak256(ethers.concat([prefix, messageHash]));

    console.log("messageHashWithPrefix: ", messageHashWithPrefix)
    return messageHash;
}

/**
 * Sign a message
 * @param message
 * @param signer
 */
export async function signMessage(message: string, signer: HardhatEthersSigner): Promise<string> {
    const sig = await signer.signMessage(message);
    let v = parseInt(sig.substring(130, 132), 16);
    if (v < 27) v += 27;
    const normalizedSig = `${sig.substring(0, 130)}${v.toString(16)}`;
    return normalizedSig;
}
