import { ethers } from 'hardhat'
import deployInfrastructure from './argentContracts/deployInfrastructure'
import updateHardhatENV from './utils/env/updateHardhatENV'
import printInfrastructure from './argentContracts/utils/printInfrastructure'
import updateExternalEnv, { EnvValue } from './utils/env/updateExternalEnv'
import Constants from './constants/constants'
import { ArgentWrappedAccounts__factory } from '../typechain-types'

export default async function temp() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()

  const network = await ethers.provider.getNetwork()
  const networkName = network.name.toUpperCase()

  console.log('\x1b[31mNetwork: \x1b[0m', networkName)

  ////////////
  // DO
  ////////////
  const ArgentWrappedAccountsAddress = '0x22aEaA81882DeE54Af24679eC44A890450443464'
  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(ArgentWrappedAccountsAddress, deployer)

  const wrappedAddress = await argentWrappedAccounts.getAccountContract('0x83D12D39E774d087032D0527488Ec3393A8606fd')

  console.log('wrappedAddress', wrappedAddress)

  // wrappedAddress balance
  const balance = await ethers.provider.getBalance(wrappedAddress)
  console.log('balance', balance.toString())

  ////////////
  // DONE :)
  ////////////
  console.log('\x1b[32mDone\x1b[0m')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
temp().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
