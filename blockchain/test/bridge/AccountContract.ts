import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { AccountContract } from "../../typechain-types";

describe("AccountContract", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let AccountContract: AccountContract;

  beforeEach(async function () {
    [deployer, account1] = await ethers.getSigners();
    const AccountContractContract = await ethers.getContractFactory(
      "AccountContract"
    );

    AccountContract = await AccountContractContract.connect(deployer).deploy(
      deployer.address
    );
  });

  describe("deposit", async function () {
    it("anyone should be able to deposit to smart contract balance", async function () {
      await expect(
        AccountContract.deposit({
          value: ethers.parseEther("1"),
        })
      ).to.not.be.reverted;

      const balance = await ethers.provider.getBalance(
        await AccountContract.getAddress()
      );
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("should revert if deposit is less than 0", async function () {
      await expect(
        AccountContract.deposit({
          value: ethers.parseEther("0"),
        })
      ).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("should be possible to send eth without deposit function", async function () {
      await account1.sendTransaction({
        to: await AccountContract.getAddress(),
        value: ethers.parseEther("1"),
      });

      const balance = await ethers.provider.getBalance(
        await AccountContract.getAddress()
      );
      expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("should emit event Deposit", async function () {
      await expect(
        AccountContract.connect(account1).deposit({
          value: ethers.parseEther("1"),
        })
      )
        .to.emit(AccountContract, "Deposit")
        .withArgs(account1.address, "1000000000000000000");
    });
  });
});
