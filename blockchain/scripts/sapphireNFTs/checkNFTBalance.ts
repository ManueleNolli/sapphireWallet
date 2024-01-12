import { ethers } from "hardhat";

export default async function utils() {
  const sapphireNFTsAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  // check balance
  const mobileAppAddress = "0x79988E436e79aEE669F7980e55cB5102f92b91CC";
  const balanceMobileApp = await sapphireNFTs.balanceOf(mobileAppAddress);
  const balanceMobileAppETH = await ethers.provider.getBalance(
    mobileAppAddress
  );

  const receiverAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const balanceReceiver = await sapphireNFTs.balanceOf(receiverAddress);
  const balanceReceiverETH = await ethers.provider.getBalance(receiverAddress);

  console.log("balanceMobileApp ETH: ", balanceMobileAppETH.toString());
  console.log("balanceReceiver ETH: ", balanceReceiverETH.toString());
  console.log("balanceMobileApp NFT: ", balanceMobileApp.toString());
  console.log("balanceReceiver NFT: ", balanceReceiver.toString());

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
utils().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
