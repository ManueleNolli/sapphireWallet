import { ethers } from "hardhat";

async function sendETH() {
  const [account1] = await ethers.getSigners();

  const to = "0x66ec4895160D11bB7389E169129E36b4ed2CABCd";

  const tx = await account1.sendTransaction({
    to,
    value: ethers.parseEther("1.5"),
  });

  await tx.wait();

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
sendETH().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
