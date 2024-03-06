import { createWallet } from "../../scripts/argentContracts/createWallet";

import { ethers } from "hardhat";
import { expect } from "chai";
import deployInfrastructure from "../../scripts/argentContracts/deployInfrastructure";
import { InfrastructureTypes } from "../../scripts/argentContracts/utils/infrastructureTypes";
import {
  generateNonceForRelay,
  signOffchain, signOffChainForBridge,
} from "../../scripts/argentContracts/utils/genericUtils";
import {EventLog, parseEther, ZeroAddress} from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import {
  AccountContract__factory,
  ArgentWrappedAccounts,
} from "../../typechain-types";


enum BridgeCallType {
    DEST,  // Call to be executed on the destination chain. Ex: Transfer ETH from the AccountContract in the Destination chain to the someone in the Destination chain
    BRIDGE // Call to be executed on the bridge contract    Ex: Transfer ETH from the source chain to the AccountContract in the destination chain
}

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

  it("Full ETH Transfer Bridge, type DEST", async function () {
    const startBalanceAccount2 = await ethers.provider.getBalance(account2DestChain.address);

    /////////////////////////////////////////
    //// INFRASTRUCTURE PREPARATION
    /////////////////////////////////////////

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
    await argentWrappedAccounts.createAccountContract(walletAccount1Address);

    // send eth to argentWrappedAccounts
    await deployer.sendTransaction({
      to: await argentWrappedAccounts.getAddress(),
      value: ethers.parseEther("1000"),
    });

    // Deposit ETH to AccountContract
      await argentWrappedAccounts.depositToAccountContract(
        walletAccount1Address,
        parseEther("100")
      );

      const account1DestChain = await argentWrappedAccounts.getAccountContract(
        walletAccount1Address
      );
      const startBalanceAccount1DestChain = await ethers.provider.getBalance(account1DestChain);

    /////////////////////////////////////////
    //// TRANSACTION PREPARATION
    /////////////////////////////////////////

    const transactionToBeExecutedOnDestChain = {
        to: account2DestChain.address,
        value: ethers.parseEther("10"),
        data: "0x",
    }

    const transactionWrappedForDestChain = AccountContract__factory.createInterface().encodeFunctionData(
        "execute",
        [transactionToBeExecutedOnDestChain.to, transactionToBeExecutedOnDestChain.value, transactionToBeExecutedOnDestChain.data]
      );

    const destinationChainID = (await ethers.provider.getNetwork()).chainId;

    const signedTransactionWrappedForDestChain = await signOffChainForBridge(
        account1BaseChain,
        walletAccount1Address,
        transactionWrappedForDestChain,
        destinationChainID
    )


    const transactionToBeExecutedOnBaseChain = {
        callType: BridgeCallType.DEST,
        to: account2DestChain.address,
        value: 0,
        data: transactionWrappedForDestChain,
        signature: signedTransactionWrappedForDestChain
    }

    const transactionWrappedForBaseChain = infrastructure.argentModule.interface.encodeFunctionData(
          "bridgeCall",
          [walletAccount1Address, transactionToBeExecutedOnBaseChain]
        );

    // Sign *offChain* the transaction
    const baseChainId = (await ethers.provider.getNetwork()).chainId;
    const nonce = await generateNonceForRelay();
    const gasLimit = 1000000;

    const signatures = await signOffchain(
      [account1BaseChain],
      await infrastructure.argentModule.getAddress(),
      0,
      transactionWrappedForBaseChain,
      baseChainId,
      nonce,
      0,
      gasLimit,
      "0x0000000000000000000000000000000000000000",
      ZeroAddress
    );

    /////////////////////////////////////////
    //// TRANSACTION EXECUTION
    /////////////////////////////////////////
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        transactionWrappedForBaseChain,
        nonce,
        signatures,
        0,
        gasLimit,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000"
      );

    const txResponse = await tx.wait();

    /////////////////////////////////////////
    //// BRIDGE
    /////////////////////////////////////////

    // check event emitted
    const event = txResponse?.logs[0] as EventLog;
    const eventName = event?.fragment.name;
    expect(eventName).to.equal("BridgeCall");
    const eventArgs = event?.args;
    const event_callId = eventArgs[0];
    const event_wallet = eventArgs[1];
    const event_callType = eventArgs[2];
    const event_destAddress = eventArgs[3];
    const event_value = eventArgs[4];
    const event_data = eventArgs[5];
    const event_signature = eventArgs[6];
    const event_owner = eventArgs[7];
    expect(event_callId).to.equal(0);
    expect(event_wallet).to.equal(walletAccount1Address);
    expect(event_callType).to.equal(BridgeCallType.DEST);
    expect(event_destAddress).to.equal(account2DestChain.address);
    expect(event_value).to.equal(parseEther("0"));
    expect(event_data).to.equal(transactionWrappedForDestChain);
    expect(event_signature).to.equal(signedTransactionWrappedForDestChain);
    expect(event_owner).to.equal(account1BaseChain.address);

    // Bridge will call the destination chain contract
    await argentWrappedAccounts.connect(deployer).execute(
        event_wallet,
        event_owner,
        event_data,
        event_signature
        )


    /////////////////////////////////////////
    //// Final checks
    /////////////////////////////////////////

    const endBalanceAccount2 = await ethers.provider.getBalance(account2DestChain.address);
    const endBalanceAccount1DestChain = await ethers.provider.getBalance(account1DestChain);


    expect(endBalanceAccount2).to.equal(startBalanceAccount2 + parseEther("10"));
    expect(endBalanceAccount1DestChain).to.equal(startBalanceAccount1DestChain - parseEther("10"));
  });
});
