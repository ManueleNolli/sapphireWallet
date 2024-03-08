import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ArgentModule, SapphireNFTs__factory } from "../../typechain-types";
import {
  generateNonceForRelay,
  signOffchain,
} from "../../scripts/argentContracts/utils/genericUtils";
import { EventLog, ZeroAddress, parseEther } from "ethers";
import { InfrastructureTypes } from "../../scripts/argentContracts/utils/infrastructureTypes";
import deployInfrastructure from "../../scripts/argentContracts/deployInfrastructure";
import { createWallet } from "../../scripts/argentContracts/createWallet";

enum BridgeCallType {
  DEST,
  BRIDGE_ETH,
  BRIDGE_NFT,
}

async function utilsSignTransaction(
  signer: HardhatEthersSigner,
  signerContractWallet: string,
  deployer: HardhatEthersSigner,
  argentModule: ArgentModule,
  callType: BridgeCallType,
  to: string,
  value: number,
  data: string,
  signature: string
) {
  const transaction = {
    callType,
    to,
    value: parseEther(value.toString()),
    data,
    signature,
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
        BridgeCallType.BRIDGE_ETH,
        account2.address,
        0,
        "0x",
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

    it("Should revert if both value and data are provided", async function () {
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
        BridgeCallType.BRIDGE_ETH,
        account2.address,
        10,
        "0x1234",
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

    describe("BRIDGE_ETH callType", async function () {
      it("Should revert if value is valid but wallet has no enough balance", async function () {
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
          BridgeCallType.BRIDGE_ETH,
          account2.address,
          10,
          "0x",
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

      it("Should be valid if value is something", async function () {
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
          BridgeCallType.BRIDGE_ETH,
          account2.address,
          10,
          "0x",
          "0x"
        );

        let txResponse = await tx.wait();

        /* Check if the events was emitted */
        // EVENT 0 = something else
        // EVENT 1 = BridgeCall
        const event = txResponse?.logs[1] as EventLog;

        const eventName = event?.fragment.name;
        expect(eventName).to.equal("BridgeCall");
        const eventArgs = event?.args;
        expect(eventArgs[0]).to.equal(0);
        expect(eventArgs[1]).to.equal(walletAccount1Address);
        expect(eventArgs[2]).to.equal(BridgeCallType.BRIDGE_ETH);
        expect(eventArgs[3]).to.equal(account2.address);
        expect(eventArgs[4]).to.equal(parseEther("10"));
        expect(eventArgs[5]).to.equal("0x");

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
    describe("BRIDGE_NFT callType", async function () {
      it("Should revert if value is not zero", async function () {
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
          BridgeCallType.BRIDGE_NFT,
          account2.address,
          10,
          "0x",
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
          [
            "InteroperabilityManager: Invalid transaction. Value can not be set in type BRIDGE_NFT",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if data is not >= 100 bytes", async function () {
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
          BridgeCallType.BRIDGE_NFT,
          account2.address,
          0,
          "0x1234",
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
          [
            "InteroperabilityManager: Invalid transaction. Data has to be at least 100 bytes long",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if data is not a safeTransferFrom tx", async function () {
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
          BridgeCallType.BRIDGE_NFT,
          account2.address,
          0,
          "0xAAAAAAAA00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc0000000000000000000000000000000000000000000000000000000000000000",
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
          [
            "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if safeTransferFrom param to is not the InteroperabilityManager", async function () {
        const walletAccount1Address = await createWallet(
          infrastructure.walletFactory,
          account1.address,
          account2.address,
          deployer.address,
          await infrastructure.argentModule.getAddress()
        );

        const data = SapphireNFTs__factory.createInterface().encodeFunctionData(
          "safeTransferFrom(address,address,uint256)",
          [account1.address, account2.address, 0]
        );

        let tx = await utilsSignTransaction(
          account1,
          walletAccount1Address,
          deployer,
          infrastructure.argentModule,
          BridgeCallType.BRIDGE_NFT,
          account2.address,
          0,
          data,
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
          [
            "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom, where to value is this contract",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if safeTransferFrom param from is not the owner", async function () {
        const walletAccount1Address = await createWallet(
          infrastructure.walletFactory,
          account1.address,
          account2.address,
          deployer.address,
          await infrastructure.argentModule.getAddress()
        );

        const data = SapphireNFTs__factory.createInterface().encodeFunctionData(
          "safeTransferFrom(address,address,uint256)",
          [account1.address, await infrastructure.argentModule.getAddress(), 0]
        );

        let tx = await utilsSignTransaction(
          account1,
          walletAccount1Address,
          deployer,
          infrastructure.argentModule,
          BridgeCallType.BRIDGE_NFT,
          account2.address,
          0,
          data,
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
          [
            "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom, where from value is the owner",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if NFT transfer fails", async function () {
        const walletAccount1Address = await createWallet(
          infrastructure.walletFactory,
          account1.address,
          account2.address,
          deployer.address,
          await infrastructure.argentModule.getAddress()
        );

        const data = SapphireNFTs__factory.createInterface().encodeFunctionData(
          "safeTransferFrom(address,address,uint256)",
          [
            walletAccount1Address,
            await infrastructure.argentModule.getAddress(),
            0,
          ]
        );

        const SapphireNFT = await ethers.getContractFactory("SapphireNFTs");
        const sapphireNFTDeployment = await SapphireNFT.deploy(
          await deployer.getAddress()
        );
        const sapphireNFT = await sapphireNFTDeployment.waitForDeployment();

        let tx = await utilsSignTransaction(
          account1,
          walletAccount1Address,
          deployer,
          infrastructure.argentModule,
          BridgeCallType.BRIDGE_NFT,
          await sapphireNFT.getAddress(), // NFT contract address
          0,
          data,
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
          [
            "InteroperabilityManager: NFT transfer to InteroperabilityManager failed",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should be valid", async function () {
        const walletAccount1Address = await createWallet(
          infrastructure.walletFactory,
          account1.address,
          account2.address,
          deployer.address,
          await infrastructure.argentModule.getAddress()
        );

        const data = SapphireNFTs__factory.createInterface().encodeFunctionData(
          "safeTransferFrom(address,address,uint256)",
          [
            walletAccount1Address,
            await infrastructure.argentModule.getAddress(),
            0,
          ]
        );

        const SapphireNFT = await ethers.getContractFactory("SapphireNFTs");
        const sapphireNFTDeployment = await SapphireNFT.deploy(
          await deployer.getAddress()
        );
        const sapphireNFT = await sapphireNFTDeployment.waitForDeployment();

        await sapphireNFT.safeMint(walletAccount1Address, "https://sapphire/");
        const ownerBefore = await sapphireNFT.ownerOf(0);
        expect(ownerBefore).to.equal(walletAccount1Address);

        let tx = await utilsSignTransaction(
          account1,
          walletAccount1Address,
          deployer,
          infrastructure.argentModule,
          BridgeCallType.BRIDGE_NFT,
          await sapphireNFT.getAddress(), // NFT contract address
          0,
          data,
          "0x"
        );

        let txResponse = await tx.wait();
        /* Check if the events was emitted */
        // EVENT 0-1 = something else
        // EVENT 2 = BridgeCall
        const event1 = txResponse?.logs[2] as EventLog;
        console.log(event1);
        const eventName = event1?.fragment.name;
        expect(eventName).to.equal("BridgeCall");
        const eventArgs = event1?.args;
        expect(eventArgs[0]).to.equal(0);
        expect(eventArgs[1]).to.equal(walletAccount1Address);
        expect(eventArgs[2]).to.equal(BridgeCallType.BRIDGE_NFT);
        expect(eventArgs[3]).to.equal(await sapphireNFT.getAddress());
        expect(eventArgs[4]).to.equal(0);
        expect(eventArgs[5]).to.equal(data);
        expect(eventArgs[6]).to.equal("0x");

        // EVENT 3 = TransactionExecuted
        const event2 = txResponse?.logs[3] as EventLog;
        const eventName2 = event2?.fragment.name;
        expect(eventName2).to.equal("TransactionExecuted");
        const eventArgs2 = event2?.args;
        expect(eventArgs2[0]).to.equal(walletAccount1Address);
        expect(eventArgs2[1]).to.be.true;

        const ownerAfter = await sapphireNFT.ownerOf(0);
        expect(ownerAfter).to.equal(
          await infrastructure.argentModule.getAddress()
        );
      });
    });

    describe("DEST callType", async function () {
      it("Should revert if value is not zero", async function () {
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
          BridgeCallType.DEST,
          account2.address,
          10,
          "0x",
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
          [
            "InteroperabilityManager: Invalid transaction. Value can not be set in type DEST",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should revert if data is something but no signature", async function () {
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
          BridgeCallType.DEST,
          account2.address,
          0,
          "0x1234",
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
          [
            "InteroperabilityManager: Invalid transaction. Signature must be set in type DEST",
          ]
        );
        expect(returnData).to.include(expectedError.slice(2));
      });

      it("Should be valid if data is something", async function () {
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
          BridgeCallType.DEST,
          account2.address,
          0,
          "0x1234",
          "0x4321"
        );

        let txResponse = await tx.wait();

        /* Check if the events was emitted */
        // EVENT 1 = BridgeCall
        const event = txResponse?.logs[0] as EventLog;

        const eventName = event?.fragment.name;
        expect(eventName).to.equal("BridgeCall");
        const eventArgs = event?.args;
        expect(eventArgs[0]).to.equal(0);
        expect(eventArgs[1]).to.equal(walletAccount1Address);
        expect(eventArgs[2]).to.equal(BridgeCallType.DEST);
        expect(eventArgs[3]).to.equal(account2.address);
        expect(eventArgs[4]).to.equal(parseEther("0"));
        expect(eventArgs[5]).to.equal("0x1234");
        expect(eventArgs[6]).to.equal("0x4321");

        // EVENT 2 = TransactionExecuted
        const event2 = txResponse?.logs[1] as EventLog;
        const eventName2 = event2?.fragment.name;
        expect(eventName2).to.equal("TransactionExecuted");
        const eventArgs2 = event2?.args;
        expect(eventArgs2[0]).to.equal(walletAccount1Address);
        expect(eventArgs2[1]).to.be.true;
      });
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

      await deployer.sendTransaction({
        to: walletAccount1Address,
        value: parseEther("10"),
      });

      let tx = await utilsSignTransaction(
        account1,
        walletAccount1Address,
        deployer,
        infrastructure.argentModule,
        BridgeCallType.BRIDGE_ETH,
        account2.address,
        5,
        "0x",
        "0x"
      );

      let txResponse = await tx.wait();

      /* Check if the events was emitted */
      // EVENT 0 = something else
      // EVENT 1 = BridgeCall
      const event = txResponse?.logs[1] as EventLog;
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
        BridgeCallType.BRIDGE_ETH,
        account2.address,
        5,
        "0x",
        "0x"
      );

      let txResponse2 = await tx2.wait();

      /* Check if the events was emitted */
      // EVENT 0 = something else
      // EVENT 1 = BridgeCall
      const event2 = txResponse2?.logs[1] as EventLog;
      const eventName2 = event2?.fragment.name;
      expect(eventName2).to.equal("BridgeCall");
      const eventArgs2 = event2?.args;
      expect(eventArgs2[0]).to.equal(1);
    });
  });
});
