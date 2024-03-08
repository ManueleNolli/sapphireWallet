import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { NFTStorage } from "../../typechain-types";

describe("NFTStorage", function () {
  let deployer: HardhatEthersSigner;
  let account1: HardhatEthersSigner;
  let nftStorage: NFTStorage;

  beforeEach(async function () {
    [deployer, account1] = await ethers.getSigners();
    const NFTStorageContract = await ethers.getContractFactory("NFTStorage");

    nftStorage = await NFTStorageContract.deploy(deployer);
  });

  describe("safeMint", async function () {
    it("should mint a new NFT with the provided URI and original info", async function () {
      const uri = "ipfs://12345";
      const originalContractAddress = "0x123";
      const originalTokenID = 123;

      await expect(
        nftStorage
          .connect(deployer)
          .safeMint(
            account1.address,
            uri,
            originalContractAddress,
            originalTokenID
          )
      ).to.emit(nftStorage, "Transfer");

      expect(await nftStorage.tokenURI(0)).to.equal(uri);

      const [contractAddress, tokenID] = await nftStorage.getOriginalInfo(0);
      expect(contractAddress).to.equal(originalContractAddress);
      expect(tokenID).to.equal(originalTokenID);
    });
  });

  describe("burn", async function () {
    it("should burn the specified NFT and remove its original info", async function () {
      const uri = "ipfs://12345";
      const originalContractAddress = "0x123";
      const originalTokenID = 123;

      await nftStorage
        .connect(deployer)
        .safeMint(
          account1.address,
          uri,
          originalContractAddress,
          originalTokenID
        );

      await expect(nftStorage.connect(account1).burn(0)).to.emit(
        nftStorage,
        "Transfer"
      );

      const [contractAddress, tokenID] = await nftStorage.getOriginalInfo(0);
      expect(contractAddress).to.equal("");
      expect(tokenID).to.equal(0);
    });
  });
});
