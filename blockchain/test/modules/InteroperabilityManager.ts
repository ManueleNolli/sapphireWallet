import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ArgentModule } from "../../typechain-types";
import {
  generateNonceForRelay,
  signOffchain,
} from "../../scripts/argentContracts/utils/genericUtils";
import { EventLog, ZeroAddress, parseEther } from "ethers";
import { InfrastructureTypes } from "../../scripts/argentContracts/utils/infrastructureTypes";
import deployInfrastructure from "../../scripts/argentContracts/deployInfrastructure";
import { createWallet } from "../../scripts/argentContracts/createWallet";

async function utilsSignTransaction(
  signer: HardhatEthersSigner,
  signerContractWallet: string,
  deployer: HardhatEthersSigner,
  argentModule: ArgentModule,
  to: string,
  value: number,
  data: string
) {
  const transaction = {
    to,
    value: parseEther(value.toString()),
    data,
  };

  const methodData = argentModule.interface.encodeFunctionData("bridgeCall", [
    signerContractWallet,
    transaction,
  ]);

  const chainId = (await ethers.provider.getNetwork()).chainId;
  const nonce = await generateNonceForRelay();
  const gasLimit = 1000000;
  const signedTransaction = await signOffchain(
    [signer],
    await argentModule.getAddress(),
    0,
    methodData,
    chainId,
    nonce,
    0,
    gasLimit,
    ZeroAddress,
    ZeroAddress
  );

  return await argentModule
    .connect(deployer)
    .execute(
      signerContractWallet,
      methodData,
      nonce,
      signedTransaction,
      0,
      gasLimit,
      ZeroAddress,
      ZeroAddress
    );
}

describe("InteroperabilityManager", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let account2: HardhatEthersSigner;
  let infrastructure: InfrastructureTypes;

  beforeEach(async function () {
    [deployer, account1, account2] = await ethers.getSigners();
    infrastructure = await deployInfrastructure(deployer);
  });

  describe("bridgeCall", async function () {
    it("Should revert if value is zero and transaction data has zero bytes", async function () {
      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        0,
        "0x"
      );

      let txResponse = await tx.wait();

      // Check if the event was emitted
      const event = txResponse?.logs[0] as EventLog;
      const eventName = event?.fragment.name;
      expect(eventName).to.equal("TransactionExecuted");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(walletAccount1Address);
      expect(eventArgs[1]).to.be.false;

      const returnData = eventArgs[2];
      const expectedError = ethers.solidityPacked(
        ["string"],
        [
          "InteroperabilityManager: Invalid transaction. Only value or data can be set",
        ]
      );
      expect(returnData).to.include(expectedError.slice(2));
    });

    it("Should revert if value and data are provided", async function () {
      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        10,
        "0x1234"
      );

      let txResponse = await tx.wait();

      // Check if the event was emitted
      const event = txResponse?.logs[0] as EventLog;
      const eventName = event?.fragment.name;
      expect(eventName).to.equal("TransactionExecuted");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(walletAccount1Address);
      expect(eventArgs[1]).to.be.false;

      const returnData = eventArgs[2];
      const expectedError = ethers.solidityPacked(
        ["string"],
        [
          "InteroperabilityManager: Invalid transaction. Only value or data can be set",
        ]
      );
      expect(returnData).to.include(expectedError.slice(2));
    });

    it("Should not revert if data has some value", async function () {
      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        0,
        "0x1234"
      );

      let txResponse = await tx.wait();
      // Check if the event was emitted
      const event = txResponse?.logs[0] as EventLog;
      const eventName = event?.fragment.name;
      expect(eventName).to.equal("BridgeCall");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(0);
      expect(eventArgs[1]).to.equal(walletAccount1Address);
      expect(eventArgs[2]).to.equal(account2.address);
      expect(eventArgs[3]).to.equal(0);
      expect(eventArgs[4]).to.equal("0x1234");
    });

    it("Should revert if value is valid but not enough", async function () {
      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      // ATTENTION: walletAccount1Address has no funds

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        10,
        "0x"
      );

      let txResponse = await tx.wait();

      const event = txResponse?.logs[0] as EventLog;
      const eventName = event?.fragment.name;
      expect(eventName).to.equal("TransactionExecuted");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(walletAccount1Address);
      expect(eventArgs[1]).to.be.false;

      const returnData = eventArgs[2];
      const expectedError = ethers.solidityPacked(
        ["string"],
        ["InteroperabilityManager: Not enough balance"]
      );
      expect(returnData).to.include(expectedError.slice(2));
    });

    it("Should not revert if value is valid", async function () {
      const argentModuleBalanceBefore = await ethers.provider.getBalance(
        await infrastructure.argentModule.getAddress()
      );

      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      // SENDING 10 ETH TO walletAccount1Address
      await deployer.sendTransaction({
        to: walletAccount1Address,
        value: parseEther("10"),
      });

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        10,
        "0x"
      );

      let txResponse = await tx.wait();

      /* Check if the events was emitted */
      // EVENT 0 = something else
      // EVENT 2 = BridgeCall
      const event = txResponse?.logs[1] as EventLog;

      const eventName = event?.fragment.name;
      expect(eventName).to.equal("BridgeCall");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(0);
      expect(eventArgs[1]).to.equal(walletAccount1Address);
      expect(eventArgs[2]).to.equal(account2.address);
      expect(eventArgs[3]).to.equal(parseEther("10"));
      expect(eventArgs[4]).to.equal("0x");

      // EVENT 2 = TransactionExecuted
      const event2 = txResponse?.logs[2] as EventLog;
      const eventName2 = event2?.fragment.name;
      expect(eventName2).to.equal("TransactionExecuted");
      const eventArgs2 = event2?.args;
      expect(eventArgs2[0]).to.equal(walletAccount1Address);
      expect(eventArgs2[1]).to.be.true;

      const argentModuleBalanceAfter = await ethers.provider.getBalance(
        await infrastructure.argentModule.getAddress()
      );
      expect(argentModuleBalanceAfter).to.equal(
        argentModuleBalanceBefore + parseEther("10")
      );
    });
  });

  describe("bridgeCallCount", async function () {
    it("Should increment, starting from 0", async function () {
      const walletAccount1Address = await createWallet(
        infrastructure.walletFactory,
        account1.address,
        account2.address,
        deployer.address,
        await infrastructure.argentModule.getAddress()
      );

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        0,
        "0x1234"
      );

      let txResponse = await tx.wait();

      const event = txResponse?.logs[0] as EventLog;
      const eventName = event?.fragment.name;
      expect(eventName).to.equal("BridgeCall");
      const eventArgs = event?.args;
      expect(eventArgs[0]).to.equal(0);

      // second call
      let tx2 = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        account2.address,
        0,
        "0x1234"
      );

      let txResponse2 = await tx2.wait();

      const event2 = txResponse2?.logs[0] as EventLog;
      const eventName2 = event2?.fragment.name;
      expect(eventName2).to.equal("BridgeCall");
      const eventArgs2 = event2?.args;
      expect(eventArgs2[0]).to.equal(1);
    });
  });
});
