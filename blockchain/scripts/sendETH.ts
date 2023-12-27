import { ethers } from "hardhat";

async function sendETH() {
  const [account1] = await ethers.getSigners();

  const to = "0x111d6FB539c5126cDa7414feBE9E28e8f3D78945";

  const tx = await account1.sendTransaction({
    to,
    value: ethers.parseEther("1"),
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
