import { ethers } from 'hardhat'
import updateExternalEnv, { EnvValue } from './utils/env/updateExternalEnv'
import Constants from './constants/constants'
import { setENVValue } from './utils/env/envConfig'

export default async function deployDestinationChain() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()

  const network = await ethers.provider.getNetwork()
  const networkName = network.name.toUpperCase()

  console.log('\x1b[31mNetwork: \x1b[0m', networkName)

  ////////////
  // DEPLOY
  ////////////
  console.log('Deploying contracts with the account:', deployerAddress)
  const NFTStorageContract = await ethers.getContractFactory('NFTStorage')
  const nftStorageDeployment = await NFTStorageContract.deploy()
  await nftStorageDeployment.waitForDeployment()

  const ArgentWrappedAccounts = await ethers.getContractFactory('ArgentWrappedAccounts')
  const argentWrappedAccountsDeployment = await ArgentWrappedAccounts.deploy(nftStorageDeployment.getAddress())
  await argentWrappedAccountsDeployment.waitForDeployment()

  // Transfer ownership of NFTStorage to ArgentWrappedAccounts
  await nftStorageDeployment.transferOwnership(argentWrappedAccountsDeployment.getAddress())

  // Update ENV
  await setENVValue(Constants.envValues.destChainNFTStorage, await nftStorageDeployment.getAddress())
  await setENVValue(Constants.envValues.argentWrappedAccounts, await argentWrappedAccountsDeployment.getAddress())

  ////////////////////////
  // UPDATE EXTERNAL ENV
  ////////////////////////
  // Bridge
  console.log('Updating bridge env...')
  const bridgeEnv: EnvValue[] = [
    {
      key: networkName + '_' + Constants.envValues.destChainNFTStorage,
      value: await nftStorageDeployment.getAddress(),
    },
    {
      key: networkName + '_' + Constants.envValues.argentWrappedAccounts,
      value: await argentWrappedAccountsDeployment.getAddress(),
    },
  ]
  await updateExternalEnv('../bridge/basicOffChainBridge/.env', bridgeEnv)
  console.log('Updated bridge env!')

  ////////////
  // DONE :)
  ////////////
  console.log('\x1b[32mDone\x1b[0m')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployDestinationChain().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
