require('dotenv').config()

import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

import '@typechain/hardhat'
import '@nomicfoundation/hardhat-ethers'
import '@nomicfoundation/hardhat-chai-matchers'
const { SEPOLIA_API_KEY, SEPOLIA_PRIVATE_KEY, AMOY_API_KEY, AMOY_PRIVATE_KEY } = process.env

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`],
      //gasPrice: 200000000000,
      //gas: 84000000,
    },
    amoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${AMOY_API_KEY}`,
      accounts: [`0x${AMOY_PRIVATE_KEY}`],
      gasPrice: 20000000000,
      gas: 8400000,
    },
  },
  typechain: {
    target: 'ethers-v6',
  },
}

export default config
