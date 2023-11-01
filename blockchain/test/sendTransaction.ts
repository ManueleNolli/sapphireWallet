import {createWallet} from "../scripts/createWallet";

import {ethers} from "hardhat";
import {expect} from "chai";
import deployInfrastructure from "../scripts/deploy/deployInfrastructure";
import {Infrastructure} from "../scripts/type/infrastructure";
import {generateMessageHash, generateNonceForRelay, signOffchain} from "../scripts/utils/genericUtils";
import {recoverAddress, ZeroAddress} from "ethers";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

describe("SendTransaction", function () {
    let deployer: HardhatEthersSigner;
    let account1: HardhatEthersSigner;
    let account2: HardhatEthersSigner;

    let infrastructure: Infrastructure;

    before(async function () {
        [deployer, account1, account2] = await ethers.getSigners();

        console.log("Deployer: ", deployer.address);
        console.log("Account1: ", account1.address);
        console.log("Account2: ", account2.address);

        const signingKey = new ethers.SigningKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

        const message ="0x4e27ebdcd4b355980e99adaca61def0c4c4568397c814bad2fa3614c19d9ee66"

        const sig = signingKey.sign(message);

        console.log("Sig: ", sig);

        const signer = ethers.recoverAddress(message, sig);

        console.log("--Signer: ", signer);


        infrastructure = await deployInfrastructure(deployer);
    });


    it("Should send transaction", async function () {
        // Create wallet for account 1
        const walletAccount1Address = await createWallet(infrastructure.walletFactory, account1.address, account2.address, deployer.address);
        console.log("Wallet created for account1: ", walletAccount1Address);

        // check owner
        const walletAccount1 = await ethers.getContractAt("BaseWallet", walletAccount1Address);
        const owner = await walletAccount1.owner();
        console.log("Owner of the created wallet: ", owner);

        // Preparing transaction to send eth from walletAccount1 to account2, it is a multiCall transaction
        const transaction = {to: account2.address, value: ethers.parseEther("10"), data: "0x"};

        // get the ABI of the function to call
        const multiCallABI = infrastructure.argentModule.interface.getFunction("multiCall");
        const multiCallInterface = new ethers.Interface([multiCallABI]);
        const methodData = multiCallInterface.encodeFunctionData(multiCallABI, [walletAccount1Address, [transaction]]);

        // Sign *offChain* the transaction
        const chainId = (await ethers.provider.getNetwork()).chainId;
        const nonce = await generateNonceForRelay();
        const gasLimit = 1000000;

        const signatures = await signOffchain(
            [account1],
            await infrastructure.argentModule.getAddress(),
            0,
            methodData,
            chainId,
            nonce,
            0,
            gasLimit,
            "0x0000000000000000000000000000000000000000",
            ZeroAddress
        )

        console.log("Signatures: ", signatures)

        // Test to retrieve the signer
        const s = recoverAddress(generateMessageHash(
            await infrastructure.argentModule.getAddress(),
            0,
            methodData,
            chainId,
            nonce,
            0,
            gasLimit,
            "0x0000000000000000000000000000000000000000",
            ZeroAddress
        ), signatures)
        console.log("Signer: ", s)

        // Send the transaction

        const tx = await infrastructure.argentModule.connect(deployer).execute(
            walletAccount1Address,
            methodData,
            nonce,
            signatures,
            0,
            gasLimit,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000"
        );


    });
});