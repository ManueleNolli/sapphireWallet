import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

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
