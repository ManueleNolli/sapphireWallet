import { ethers } from 'hardhat'
import { expect } from 'chai'
import { ArgentModule, SapphireSecurityManager, SapphireSecurityManager__factory } from '../../typechain-types'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import deployInfrastructure from '../../scripts/argentContracts/deployInfrastructure'
import { InfrastructureTypes } from '../../scripts/argentContracts/utils/infrastructureTypes'

describe('SapphireSecurityManager', function () {
  let deployer: HardhatEthersSigner
  let walletOwner: HardhatEthersSigner
  let guardian1: HardhatEthersSigner
  let guardian2: HardhatEthersSigner
  let walletAccountAbstraction: string
  let infrastructure: InfrastructureTypes

  beforeEach(async function () {
    ;[deployer, walletOwner, guardian1, guardian2] = await ethers.getSigners()
    infrastructure = await deployInfrastructure(deployer)

    // create walletAccountAbstraction
  })

  describe('addGuardian', async function () {
    it('Should allow the wallet owner to add a guardian', async function () {})
  })

  describe('removeGuardian', async function () {
    beforeEach(async function () {
      // Add guardian1
    })

    it('Should allow the wallet owner to remove a guardian', async function () {})
  })

  describe('recoverWallet', async function () {
    beforeEach(async function () {
      // Add guardian1
    })

    it('Should allow a guardian to recover the wallet', async function () {})

    it('Should revert if the new owner is the zero address', async function () {})

    it('Should revert if called by a non-guardian', async function () {})

    it('Should revert if called when the wallet is locked', async function () {})
  })
})
