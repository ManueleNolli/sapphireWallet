import { createWallet } from "../scripts/argentContracts/createWallet";

import { ethers } from "hardhat";
import { expect } from "chai";
import deployInfrastructure from "../scripts/argentContracts/deployInfrastructure";
import { InfrastructureTypes } from "../scripts/argentContracts/utils/infrastructureTypes";
import {
  generateNonceForRelay,
  signOffchain,
} from "../scripts/argentContracts/utils/genericUtils";
import { ZeroAddress } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SendTransaction NFT", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let account2: HardhatEthersSigner;

  let infrastructure: InfrastructureTypes;

  before(async function () {
    [deployer, account1, account2] = await ethers.getSigners();
    infrastructure = await deployInfrastructure(deployer);
  });

  it("Should send transaction NFT", async function () {
    // Create wallet for account1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1.address,
      account2.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    );

    // Deploy SapphireNFTs and mint NFT
    const SapphireNFT = await ethers.getContractFactory("SapphireNFTs");
    const sapphireNFTDeployment = await SapphireNFT.deploy(
      await deployer.getAddress()
    );

    const sapphireNFT = await sapphireNFTDeployment.waitForDeployment();
    const sapphireNFTAddress = await sapphireNFT.getAddress();

    await sapphireNFT.safeMint(walletAccount1Address, "https://sapphire/");

    // Check NFT balance of account1
    const balanceAccount1 = await sapphireNFT.balanceOf(walletAccount1Address);
    expect(balanceAccount1).to.equal(1);

    // Add SapphireNFT to sapphire authoriser (dappRegistry)
    await infrastructure.dappRegistry
      .connect(deployer)
      .setAuthorised(sapphireNFTAddress, true);

    // Prepare transaction (send NFT to account2)
    // This is the real transaction
    const transferTransaction =
      await sapphireNFT.transferFrom.populateTransaction(
        walletAccount1Address,
        account2.address,
        0 // NFT Token ID
      );

    // The transaction is wrapped in a multiCall, so Argent can execute it
    const transactionArgent = {
      to: sapphireNFTAddress,
      value: 0,
      data: transferTransaction.data,
    };

    const methodData = infrastructure.argentModule.interface.encodeFunctionData(
      "multiCall",
      [walletAccount1Address, [transactionArgent]]
    );

    // Account 1 sign transaction off chain
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const nonce = await generateNonceForRelay();
    const gasLimit = 1000000;
    const signedTransaction = await signOffchain(
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
    );

    // Relayer = deployer, send transaction
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        methodData,
        nonce,
        signedTransaction,
        0,
        gasLimit,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
      );

    await tx.wait();

    // Check NFT balance of account2
    const balanceAccount2 = await sapphireNFT.balanceOf(account2.address);
    expect(balanceAccount2).to.equal(1);

    // Check NFT balance of account1
    const balanceAccount1After = await sapphireNFT.balanceOf(
      walletAccount1Address
    );
    expect(balanceAccount1After).to.equal(0);
  });
});
