import { ethers } from "hardhat";

async function sendETH() {
  const [account1] = await ethers.getSigners();

  const to = "0x58489e7b6Ded9242d5c17A169De0F965bFC1fB22";

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
