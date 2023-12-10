import { ethers } from "hardhat";

async function sendETH() {
  const [account1] = await ethers.getSigners();

  const to = "0x6adA85aAb4D1Cb8ecbf843F685Dc473C2c1cE388";

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
