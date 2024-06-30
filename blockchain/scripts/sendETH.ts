import { ethers } from "hardhat";

async function sendETH() {
  const [account1] = await ethers.getSigners();

  const to = "0x71e853b17aA1e92f3E8163E4feD65b50E8297FF8";

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
