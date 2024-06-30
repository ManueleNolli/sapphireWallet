import { ethers } from "hardhat";
import { getENVValue } from "../utils/env/envConfig";
import constants from "../constants/constants";
import { ZeroAddress } from "ethers";

export default async function checkAuthorised() {
  const [deployer] = await ethers.getSigners();

  const sapphireAuthoriserAddress = await getENVValue(
    constants.envValues.dappRegistry
  );
  const sapphireAuthoriser = await ethers.getContractAt(
    "SapphireAuthoriser",
    sapphireAuthoriserAddress
  );

  const sapphireNFTsAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  const isAuthorised = await sapphireAuthoriser.isAuthorised(
    ZeroAddress,
    sapphireNFTsAddress,
    sapphireNFTsAddress,
    deployer.address
  );

  console.log("isAuthorised: ", isAuthorised);

  console.log("Done!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
checkAuthorised().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
