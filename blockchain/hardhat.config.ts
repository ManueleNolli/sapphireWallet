import { HardhatUserConfig, task, types } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import copyTypechainTypes from "./scripts/utils/copyTypechainTypes";

/**
 * Override the built-in compile task to copy the TypeChain types to the mobile app and backend
 */
task("compile")
  .addOptionalParam(
    "copyTypes",
    "Copy TypeChain types to the mobile app and backend",
    false,
    types.boolean
  )
  .setAction(async (args, hre, runSuper) => {
    await runSuper(); // runs the built-in compile task
    if (args.copyTypes) {
      await copyTypechainTypes("typechain-types", [
        "../mobileapp/src/contracts",
        "../backend/wallet-factory/src/contracts",
        "../backend/sapphire-relayer/src/contracts",
      ]);
    }
  });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        // runs: 200,
      },
    },
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
  // sepolia: {
  //   url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  //   accounts: [`0x${PRIVATE_KEY}`],
  //   gasPrice: 20000000000,
  //   gas: 8400000,
  // },
  // mainnet: {
  //   url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  //   accounts: [`0x${PRIVATE_KEY}`],
  // },
  typechain: {
    target: "ethers-v6",
  },
};

export default config;
