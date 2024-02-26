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

describe("Account Abstraction Relayer: SendTransactionETH", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let account2: HardhatEthersSigner;

  let infrastructure: InfrastructureTypes;

  before(async function () {
    [deployer, account1, account2] = await ethers.getSigners();
    infrastructure = await deployInfrastructure(deployer);
  });

  it("Should send transaction", async function () {
    const startBalance = await ethers.provider.getBalance(account2.address);

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1.address,
      account2.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    );

    // check owner
    const walletAccount1 = await ethers.getContractAt(
      "BaseWallet",
      walletAccount1Address
    );
    const owner = await walletAccount1.owner();
    expect(owner).to.equal(account1.address);

    // send eth to walletAccount1
    await account1.sendTransaction({
      to: walletAccount1Address,
      value: ethers.parseEther("100"),
    });

    /* OLD BUT WORKS FOR ARGENT DAPP REGISTRY
    //It is necessary just one of those two calls (a relayer is registered globally or in the whitelist for the wallet)
    //Add dapp authorized
    await infrastructure.dappRegistry.addDapp(0, account2.address, ZeroAddress);
    */

    //Add account2 to whitelist
    await infrastructure.argentModule
      .connect(account1)
      .addToWhitelist(walletAccount1Address, account2.address);

    // Preparing transaction to send eth from walletAccount1 to account2, it is a multiCall transaction
    const transaction = {
      to: account2.address,
      value: ethers.parseEther("10"),
      data: "0x",
    };

    const methodData = infrastructure.argentModule.interface.encodeFunctionData(
      "multiCall",
      [walletAccount1Address, [transaction]]
    );

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
    );

    // Send the transaction
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        methodData,
        nonce,
        signatures,
        0,
        gasLimit,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
      );

    await tx.wait();

    const balance = await ethers.provider.getBalance(account2.address);

    // expect the balance to be 10 eth more for account2
    expect(balance).to.equal(
      BigInt(startBalance) + BigInt(ethers.parseEther("10"))
    );

    // expect the balance of the wallet to be 90 eth
    const walletBalance = await ethers.provider.getBalance(
      walletAccount1Address
    );
    expect(walletBalance).to.equal(ethers.parseEther("90"));
  });
});
