import { ethers } from "hardhat";

async function mintSapphireNFTs() {
  const sapphireNFTsAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  const to = "0x58489e7b6Ded9242d5c17A169De0F965bFC1fB22";

  // mint
  const mintTx0 = await sapphireNFTs.safeMint(to, "/0");
  await mintTx0.wait();

  const mintTx1 = await sapphireNFTs.safeMint(to, "/1");
  await mintTx1.wait();

  const mintTx2 = await sapphireNFTs.safeMint(to, "/2");
  await mintTx2.wait();

  const mintTx3 = await sapphireNFTs.safeMint(to, "/3");
  await mintTx3.wait();

  const mintTx4 = await sapphireNFTs.safeMint(to, "/4");
  await mintTx4.wait();

  console.log("Done!");

  const tokenURI = await sapphireNFTs.tokenURI(3);
  console.log("tokenURI Example", tokenURI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintSapphireNFTs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
