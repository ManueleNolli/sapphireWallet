import { createWallet } from "../scripts/argentContracts/createWallet";

import { ethers } from "hardhat";
import { expect } from "chai";
import deployInfrastructure from "../../scripts/argentContracts/deployInfrastructure";
import { InfrastructureTypes } from "../../scripts/argentContracts/utils/infrastructureTypes";
import {
  generateNonceForRelay,
  signOffchain,
} from "../../scripts/argentContracts/utils/genericUtils";
import { ZeroAddress } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {ArgentWrappedAccounts} from "../../typechain-types";

describe("Bridge Integration", function () {
  let deployer: HardhatEthersSigner;
  let account1BaseChain: HardhatEthersSigner;
  let account2DestChain: HardhatEthersSigner;

  let infrastructure: InfrastructureTypes;
  let argentWrappedAccounts: ArgentWrappedAccounts;

  before(async function () {
    [deployer, account1BaseChain, account2DestChain] = await ethers.getSigners();
    infrastructure = await deployInfrastructure(deployer);

    const ArgentWrappedAccountsContract = await ethers.getContractFactory(
      "ArgentWrappedAccounts"
    );

    argentWrappedAccounts = await ArgentWrappedAccountsContract.connect(
      deployer
    ).deploy();
  });

  it("Full ETH Transfer Bridge, type BRIDGE", async function () {
    const startBalance = await ethers.provider.getBalance(account2DestChain.address);

    //////////////////////////////
    //// PREPARATION
    //////////////////////////////

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1BaseChain.address,
      deployer.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    );

    // send eth to walletAccount1
    await deployer.sendTransaction({
      to: walletAccount1Address,
      value: ethers.parseEther("100"),
    });

    // Create Bridge Account
      const bridgeWalletAccount1 = await argentWrappedAccounts.createAccountContract(walletAccount1Address);



    const transaction = {
      to: account2DestChain.address,
      value: ethers.parseEther("10"),
      data: "0x",
    };

    const methodData = AccountContract.interface.encodeFunctionData(
        "execute",
        [transaction.to, transaction.value, transaction.data]
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
