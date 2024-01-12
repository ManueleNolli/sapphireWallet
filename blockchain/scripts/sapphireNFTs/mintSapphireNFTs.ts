import { ethers } from "hardhat";

async function mintSapphireNFTs() {
  const sapphireNFTsAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  const to = "0x66ec4895160D11bB7389E169129E36b4ed2CABCd";

  // mint
  const mintTx0 = await sapphireNFTs.safeMint(to, "/0");
  await mintTx0.wait();

  // const mintTx1 = await sapphireNFTs.safeMint(to, "/1");
  // await mintTx1.wait();
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
