import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ArgentWrappedAccounts } from "../../typechain-types";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("ArgentWrappedAccounts", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let ArgentWrappedAccounts: ArgentWrappedAccounts;

  beforeEach(async function () {
    [deployer, account1] = await ethers.getSigners();
    const ArgentWrappedAccountsContract = await ethers.getContractFactory(
      "ArgentWrappedAccounts"
    );

    ArgentWrappedAccounts = await ArgentWrappedAccountsContract.connect(
      deployer
    ).deploy(deployer.address);
  });

  describe("createAccountContract", async function () {
    it("should throw if account contract already exists", async function () {
      await ArgentWrappedAccounts.createAccountContract(account1.address);
      await expect(
        ArgentWrappedAccounts.createAccountContract(account1.address)
      ).to.be.revertedWith("Account contract already exists");
    });

    it("should create account contract", async function () {
      await ArgentWrappedAccounts.createAccountContract(account1.address);
      const accountContract = await ArgentWrappedAccounts.getAccountContract(
        account1.address
      );
      expect(accountContract).to.not.equal(ethers.ZeroAddress);

      const accountContract2 = await ethers.getContractAt(
        "AccountContract",
        accountContract
      );
      expect(await accountContract2.getAddress()).to.equal(accountContract);
    });
    it("should emit event AccountContractCreated", async function () {
      await expect(
        ArgentWrappedAccounts.createAccountContract(account1.address)
      )
        .to.emit(ArgentWrappedAccounts, "AccountContractCreated")
        .withArgs(account1.address, anyValue);
    });
  });

  describe("deposit", async function () {
    it("anyone should be able to deposit to smart contract balance", async function () {
      await expect(
        ArgentWrappedAccounts.deposit({
          value: ethers.parseEther("1"),
        })
      ).to.not.be.reverted;

      const balance = await ethers.provider.getBalance(
        await ArgentWrappedAccounts.getAddress()
      );
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("should emit event Deposit", async function () {
      await expect(
        ArgentWrappedAccounts.connect(account1).deposit({
          value: ethers.parseEther("1"),
        })
      )
        .to.emit(ArgentWrappedAccounts, "Deposit")
        .withArgs(
          account1.address,
          await ArgentWrappedAccounts.getAddress(),
          "1000000000000000000"
        );
    });

    it("should revert if deposit is less than 0", async function () {
      await expect(
        ArgentWrappedAccounts.deposit({
          value: ethers.parseEther("0"),
        })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("should be possible to send eth without deposit function", async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther("1"),
      });

      const balance = await ethers.provider.getBalance(
        await ArgentWrappedAccounts.getAddress()
      );
      expect(balance).to.equal(ethers.parseEther("1"));
    });
  });

  describe("depositToAccountContract", async function () {
    it("only owner can call the function", async function () {
      // should revert with revert OwnableUnauthorizedAccount error
      await expect(
        ArgentWrappedAccounts.connect(account1).depositToAccountContract(
          account1.address,
          ethers.parseEther("1")
        )
      ).to.be.reverted;
    });

    it("should emit event Deposit", async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther("1"),
      });

      await ArgentWrappedAccounts.createAccountContract(account1.address);
      const accountContractAddress =
        await ArgentWrappedAccounts.getAccountContract(account1.address);

      await expect(
        ArgentWrappedAccounts.connect(deployer).depositToAccountContract(
          account1.address,
          ethers.parseEther("0.5")
        )
      )
        .to.emit(ArgentWrappedAccounts, "Deposit")
        .withArgs(
          await ArgentWrappedAccounts.getAddress(),
          accountContractAddress,
          "500000000000000000"
        );
    });

    it("should revert if deposit is less than 0", async function () {
      // should revert with revert OwnableUnauthorizedAccount error
      await expect(
        ArgentWrappedAccounts.depositToAccountContract(
          account1.address,
          ethers.parseEther("0")
        )
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("should revert if smart contract balance is less than value", async function () {
      // should revert with revert Account contract does not exist
      await expect(
        ArgentWrappedAccounts.depositToAccountContract(
          account1.address,
          ethers.parseEther("1")
        )
      ).to.be.revertedWith("Insufficient balance inside ArgentWrappedAccounts");
    });

    it("should deposit to an existing account contract", async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther("1"),
      });

      await ArgentWrappedAccounts.createAccountContract(account1.address);
      await ArgentWrappedAccounts.depositToAccountContract(
        account1.address,
        ethers.parseEther("0.5")
      );

      const accountContractAddress =
        await ArgentWrappedAccounts.getAccountContract(account1.address);
      const balance = await ethers.provider.getBalance(accountContractAddress);
      expect(balance).to.equal(ethers.parseEther("0.5"));

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt(
        "AccountContract",
        accountContractAddress
      );
      expect(await accountContract.getAddress()).to.equal(
        accountContractAddress
      );
    });

    it("should deposit to a non existing account contract", async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther("1"),
      });

      await ArgentWrappedAccounts.depositToAccountContract(
        account1.address,
        ethers.parseEther("0.5")
      );

      const accountContractAddress =
        await ArgentWrappedAccounts.getAccountContract(account1.address);
      expect(accountContractAddress).to.not.equal(ethers.ZeroAddress);
      const balance = await ethers.provider.getBalance(accountContractAddress);
      expect(balance).to.equal(ethers.parseEther("0.5"));

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt(
        "AccountContract",
        accountContractAddress
      );
      expect(await accountContract.getAddress()).to.equal(
        accountContractAddress
      );
    });
  });
});
