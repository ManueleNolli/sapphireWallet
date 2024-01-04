import { ethers } from "hardhat";

async function mintSapphireNFTs() {
  const sapphireNFTsAddress = "0x82CB7a678D657b0df1b46973c8faf0a4f3421964";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  const to = "0x542e269D75FB6Aa3D0621cEcff02434464542bce";

  // mint
  // const mintTx0 = await sapphireNFTs.safeMint(to, "/0");
  // await mintTx0.wait();

  const mintTx1 = await sapphireNFTs.safeMint(to, "/1");
  await mintTx1.wait();
  //
  // const mintTx2 = await sapphireNFTs.safeMint(to, "/2");
  // await mintTx2.wait();
  //
  // const mintTx3 = await sapphireNFTs.safeMint(to, "/3");
  // await mintTx3.wait();
  //
  // const mintTx4 = await sapphireNFTs.safeMint(to, "/4");
  // await mintTx4.wait();

  console.log("Done!");

  const tokenURI = await sapphireNFTs.tokenURI(1);
  console.log("tokenURI Example", tokenURI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintSapphireNFTs().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
