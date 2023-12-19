import { ethers } from "hardhat";

async function mintSapphireNFTs() {
  const sapphireNFTsAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  // mint
  const mintTx = await sapphireNFTs.safeMint(
    "0x887992aa3CC4A8868c86F2A7Db0687f757286057"
  );

  await mintTx.wait();

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintSapphireNFTs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
