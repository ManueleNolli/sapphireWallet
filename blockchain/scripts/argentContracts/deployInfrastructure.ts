import { ethers } from 'hardhat'

import { deployStorages } from './deployStorages'
import { deployBaseWalletAndFactory } from './deployBaseWalletAndFactory'
import { deployRegisters } from './deployRegisters'
import { deployArgentModule } from './deployArgentModule'
import { deployUniswapMock } from './deployUniswapMock'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { InfrastructureTypes } from './utils/infrastructureTypes'

/**
 * Deploy all infrastructure contracts
 *
 */
async function _deployInfrastructure(deployer: HardhatEthersSigner): Promise<InfrastructureTypes> {
  /* Account */
  const deployerAddress = await deployer.getAddress()

  /* Storages */
  const { guardianStorage, transferStorage } = await deployStorages()
  const guardianStorageAddress = await guardianStorage.getAddress()
  const transferStorageAddress = await transferStorage.getAddress()

  /* BaseWallet and WalletFactory */
  const { baseWallet, walletFactory } = await deployBaseWalletAndFactory(guardianStorageAddress, deployerAddress)

  // Add deployer as manager
  await walletFactory.connect(deployer).addManager(deployerAddress)

  /* Registries */
  const { moduleRegistry, dappRegistry } = await deployRegisters()
  const moduleRegistryAddress = await moduleRegistry.getAddress()
  const dappRegistryAddress = await dappRegistry.getAddress()

  /* Argent Wallet Detector : not needed for now */

  /* MultiCallHelper : not needed for now */

  /* Mock Uniswap */
  const { uniswapFactory, uniswapRouter } = await deployUniswapMock()
  const uniswapRouterAddress = await uniswapRouter.getAddress()

  /* Argent Module */
  const { argentModule } = await deployArgentModule(
    moduleRegistryAddress,
    guardianStorageAddress,
    transferStorageAddress,
    dappRegistryAddress,
    uniswapRouterAddress
  )

  // Add argentModule to moduleRegistry
  const argentModuleName = 'ArgentModule'

  // convert to bitlike
  const argentModuleBitlike = ethers.encodeBytes32String(argentModuleName)
  await moduleRegistry.connect(deployer).registerModule(await argentModule.getAddress(), argentModuleBitlike)

  // Authorise ArgentModule
  await dappRegistry.connect(deployer).setAuthorised(await argentModule.getAddress(), true)

  return {
    guardianStorage,
    transferStorage,
    baseWallet,
    walletFactory,
    moduleRegistry,
    dappRegistry,
    uniswapFactoryMock: uniswapFactory,
    uniswapRouterMock: uniswapRouter,
    argentModule,
  }
}

export default async function deployInfrastructure(deployer: HardhatEthersSigner): Promise<InfrastructureTypes> {
  try {
    return await _deployInfrastructure(deployer)
  } catch (error) {
    console.error(error)
    throw new Error('Infrastructure deployment failed')
  }
}
