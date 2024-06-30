import { ethers } from "hardhat";
import { getENVValue } from "../utils/env/envConfig";
import constants from "../constants/constants";

export default async function utils() {
  const argentModuleAddress = await getENVValue(
    constants.envValues.argentModule
  );
  const argentModuleContract = await ethers.getContractAt(
    "ArgentModule",
    argentModuleAddress
  );

  const sapphireNFTsAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const sapphireNFTs = await ethers.getContractAt(
    "SapphireNFTs",
    sapphireNFTsAddress
  );

  // check all events
  const eventsAM = await argentModuleContract.queryFilter(
    argentModuleContract.filters.TransactionExecuted()
  );

  for (const event of eventsAM) {
    console.log("ArgentModuleEvent: ", event.args);
  }

  const eventsSN = await sapphireNFTs.queryFilter(
    sapphireNFTs.filters.SapphireTransferComplete()
  );

  for (const event of eventsSN) {
    console.log("SapphireNFTEvent: ", event.args);
  }

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
utils().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
