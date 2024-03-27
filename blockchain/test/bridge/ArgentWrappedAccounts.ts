import { ethers } from 'hardhat'
import { expect } from 'chai'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { ArgentWrappedAccounts, NFTStorage } from '../../typechain-types'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { signOffChainForBridge } from '../../scripts/argentContracts/utils/genericUtils'
import { ZeroAddress } from 'ethers'

describe('ArgentWrappedAccounts', function () {
  let deployer: HardhatEthersSigner
  let account1: HardhatEthersSigner
  let account2: HardhatEthersSigner
  let ArgentWrappedAccounts: ArgentWrappedAccounts
  let NFTStorage: NFTStorage

  beforeEach(async function () {
    ;[deployer, account1, account2] = await ethers.getSigners()
    const ArgentWrappedAccountsContract = await ethers.getContractFactory('ArgentWrappedAccounts')

    const NFTStorageContract = await ethers.getContractFactory('NFTStorage')
    NFTStorage = await NFTStorageContract.connect(deployer).deploy()
    const NFTStorageAddress = await NFTStorage.getAddress()

    ArgentWrappedAccounts = await ArgentWrappedAccountsContract.connect(deployer).deploy(NFTStorageAddress)

    await NFTStorage.transferOwnership(await ArgentWrappedAccounts.getAddress())
  })

  describe('createAccountContract', async function () {
    it('should throw if account contract already exists', async function () {
      await ArgentWrappedAccounts.createAccountContract(account1.address)
      await expect(ArgentWrappedAccounts.createAccountContract(account1.address)).to.be.revertedWith('Account contract already exists')
    })

    it('should create account contract', async function () {
      await ArgentWrappedAccounts.createAccountContract(account1.address)
      const accountContract = await ArgentWrappedAccounts.getAccountContract(account1.address)
      expect(accountContract).to.not.equal(ethers.ZeroAddress)

      const accountContract2 = await ethers.getContractAt('AccountContract', accountContract)
      expect(await accountContract2.getAddress()).to.equal(accountContract)
    })
    it('should emit event AccountContractCreated', async function () {
      await expect(ArgentWrappedAccounts.createAccountContract(account1.address))
        .to.emit(ArgentWrappedAccounts, 'AccountContractCreated')
        .withArgs(account1.address, anyValue)
    })
  })

  describe('deposit', async function () {
    it('anyone should be able to deposit to smart contract balance', async function () {
      await expect(
        ArgentWrappedAccounts.deposit({
          value: ethers.parseEther('1'),
        })
      ).to.not.be.reverted

      const balance = await ethers.provider.getBalance(await ArgentWrappedAccounts.getAddress())
      expect(balance).to.equal(ethers.parseEther('1'))
    })

    it('should emit event Deposit', async function () {
      await expect(
        ArgentWrappedAccounts.connect(account1).deposit({
          value: ethers.parseEther('1'),
        })
      )
        .to.emit(ArgentWrappedAccounts, 'Deposit')
        .withArgs(account1.address, await ArgentWrappedAccounts.getAddress(), '1000000000000000000')
    })

    it('should revert if deposit is less than 0', async function () {
      await expect(
        ArgentWrappedAccounts.deposit({
          value: ethers.parseEther('0'),
        })
      ).to.be.revertedWith('Deposit amount must be greater than 0')
    })

    it('should be possible to send eth without deposit function', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      const balance = await ethers.provider.getBalance(await ArgentWrappedAccounts.getAddress())
      expect(balance).to.equal(ethers.parseEther('1'))
    })
  })

  describe('depositToAccountContract', async function () {
    it('only owner can call the function', async function () {
      // should revert with revert OwnableUnauthorizedAccount error
      await expect(ArgentWrappedAccounts.connect(account1).depositToAccountContract(account1.address, ethers.parseEther('1'))).to.be.reverted
    })

    it('should emit event Deposit', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      await ArgentWrappedAccounts.createAccountContract(account1.address)

      await expect(ArgentWrappedAccounts.connect(deployer).depositToAccountContract(account1.address, ethers.parseEther('0.5')))
        .to.emit(ArgentWrappedAccounts, 'Deposit')
        .withArgs(await ArgentWrappedAccounts.getAddress(), account1.address, '500000000000000000')
    })

    it('should revert if deposit is less than 0', async function () {
      // should revert with revert OwnableUnauthorizedAccount error
      await expect(ArgentWrappedAccounts.depositToAccountContract(account1.address, ethers.parseEther('0'))).to.be.revertedWith(
        'Deposit amount must be greater than 0'
      )
    })

    it('should revert if smart contract balance is less than value', async function () {
      // should revert with revert Account contract does not exist
      await expect(ArgentWrappedAccounts.depositToAccountContract(account1.address, ethers.parseEther('1'))).to.be.revertedWith(
        'Insufficient balance inside ArgentWrappedAccounts'
      )
    })

    it('should deposit to an existing account contract', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      await ArgentWrappedAccounts.createAccountContract(account1.address)
      await ArgentWrappedAccounts.depositToAccountContract(account1.address, ethers.parseEther('0.5'))

      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)
      const balance = await ethers.provider.getBalance(accountContractAddress)
      expect(balance).to.equal(ethers.parseEther('0.5'))

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt('AccountContract', accountContractAddress)
      expect(await accountContract.getAddress()).to.equal(accountContractAddress)
    })

    it('should deposit to a non existing account contract', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      await ArgentWrappedAccounts.depositToAccountContract(account1.address, ethers.parseEther('0.5'))

      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)
      expect(accountContractAddress).to.not.equal(ethers.ZeroAddress)
      const balance = await ethers.provider.getBalance(accountContractAddress)
      expect(balance).to.equal(ethers.parseEther('0.5'))

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt('AccountContract', accountContractAddress)
      expect(await accountContract.getAddress()).to.equal(accountContractAddress)
    })
  })

  describe('getAccountBalance', async function () {
    it('should revert if account does not exist', async function () {
      await expect(ArgentWrappedAccounts.getAccountBalance(account1.address)).to.be.revertedWith('Account contract does not exist')
    })

    it('should get correct balance', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      await ArgentWrappedAccounts.depositToAccountContract(account1.address, ethers.parseEther('0.5'))

      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)
      expect(accountContractAddress).to.not.equal(ethers.ZeroAddress)
      const balance = await ethers.provider.getBalance(accountContractAddress)
      expect(balance).to.equal(ethers.parseEther('0.5'))

      const balanceViaArgentWrappedAccounts = await ArgentWrappedAccounts.getAccountBalance(account1.address)
      expect(balanceViaArgentWrappedAccounts).to.equal(balance)

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt('AccountContract', accountContractAddress)
      expect(await accountContract.getAddress()).to.equal(accountContractAddress)
    })
  })

  describe('safeMint', async function () {
    it('only owner can call the function', async function () {
      // should revert with revert OwnableUnauthorizedAccount error
      await expect(ArgentWrappedAccounts.connect(account1).safeMint(account1.address, 'https://www.google.com', ZeroAddress, 0)).to.be.reverted
    })

    it('should emit event NFTMinted', async function () {
      await account1.sendTransaction({
        to: await ArgentWrappedAccounts.getAddress(),
        value: ethers.parseEther('1'),
      })

      await ArgentWrappedAccounts.createAccountContract(account1.address)
      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)

      await expect(ArgentWrappedAccounts.connect(deployer).safeMint(account1.address, 'https://www.google.com', accountContractAddress, 0))
        .to.emit(ArgentWrappedAccounts, 'NFTMinted')
        .withArgs(account1.address, 'https://www.google.com', accountContractAddress, 0)
    })

    it('should mint to an existing account contract', async function () {
      await ArgentWrappedAccounts.createAccountContract(account1.address)
      await ArgentWrappedAccounts.connect(deployer).safeMint(account1.address, 'https://www.google.com', ZeroAddress, 0)

      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)

      const balance = await NFTStorage.balanceOf(accountContractAddress)
      expect(balance).to.equal(1)

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt('AccountContract', accountContractAddress)
      expect(await accountContract.getAddress()).to.equal(accountContractAddress)
    })

    it('should mint to a non existing account contract', async function () {
      await ArgentWrappedAccounts.safeMint(account1.address, 'https://www.google.com', ZeroAddress, 0)

      const accountContractAddress = await ArgentWrappedAccounts.getAccountContract(account1.address)
      expect(accountContractAddress).to.not.equal(ethers.ZeroAddress)
      const balance = await NFTStorage.balanceOf(accountContractAddress)
      expect(balance).to.equal(1)

      // check if accountContractAddress is a AccountContract type
      const accountContract = await ethers.getContractAt('AccountContract', accountContractAddress)
      expect(await accountContract.getAddress()).to.equal(accountContractAddress)
    })
  })

  describe('execute', async function () {
    it('should revert if account contract does not exist', async function () {
      await expect(ArgentWrappedAccounts.connect(deployer).execute(account1, account1, '0x1234', '0x1234')).to.be.revertedWith(
        'Account contract does not exist'
      )
    })

    it('should emit event Execute', async function () {
      const transaction = {
        to: account2.address,
        value: ethers.parseEther('10'),
        data: '0x',
      }

      await ArgentWrappedAccounts.createAccountContract(account1.address)
      const accountContract = await ArgentWrappedAccounts.getAccountContract(account1.address)

      const AccountContract = await ethers.getContractAt('AccountContract', accountContract)

      const methodData = AccountContract.interface.encodeFunctionData('execute', [transaction.to, transaction.value, transaction.data])

      const chainId = (await ethers.provider.getNetwork()).chainId

      const signatures = await signOffChainForBridge(
        account1,
        account1.address, // In bridge that will be the Wallet Smart Contract
        methodData,
        chainId
      )

      expect(await ArgentWrappedAccounts.connect(deployer).execute(account1.address, account1.address, methodData, signatures)).to.emit(
        ArgentWrappedAccounts,
        'TransactionExecuted'
      )
    })

    it('should revert if signature is not valid', async function () {
      const transaction = {
        to: account2.address,
        value: ethers.parseEther('10'),
        data: '0x',
      }

      await ArgentWrappedAccounts.createAccountContract(account1.address)
      const accountContract = await ArgentWrappedAccounts.getAccountContract(account1.address)

      const AccountContract = await ethers.getContractAt('AccountContract', accountContract)

      const methodData = AccountContract.interface.encodeFunctionData('execute', [transaction.to, transaction.value, transaction.data])

      const chainId = (await ethers.provider.getNetwork()).chainId

      const signatures = await signOffChainForBridge(
        account1,
        account2.address, // WRONG address
        methodData,
        chainId
      )

      await expect(ArgentWrappedAccounts.connect(deployer).execute(account1.address, account1.address, methodData, signatures)).to.be.revertedWith(
        'Invalid signature'
      )
    })
  })

  describe('Integration with Account Contract', async function () {
    it('execute', async function () {
      // Check account 2 balance
      const startBalance = await ethers.provider.getBalance(account2.address)

      const transaction = {
        to: account2.address,
        value: ethers.parseEther('10'),
        data: '0x',
      }

      await ArgentWrappedAccounts.createAccountContract(account1.address)
      const accountContract = await ArgentWrappedAccounts.getAccountContract(account1.address)

      // send 10 eth to accountContract
      await deployer.sendTransaction({
        to: accountContract,
        value: ethers.parseEther('10'),
      })

      const AccountContract = await ethers.getContractAt('AccountContract', accountContract)

      const methodData = AccountContract.interface.encodeFunctionData('execute', [transaction.to, transaction.value, transaction.data])

      const chainId = (await ethers.provider.getNetwork()).chainId

      const signatures = await signOffChainForBridge(
        account1,
        account1.address, // In bridge that will be the Wallet Smart Contract
        methodData,
        chainId
      )

      expect(await ArgentWrappedAccounts.connect(deployer).execute(account1.address, account1.address, methodData, signatures)).to.emit(
        ArgentWrappedAccounts,
        'TransactionExecuted'
      )

      const balance = await ethers.provider.getBalance(account2.address)
      expect(balance).to.equal(BigInt(startBalance) + BigInt(ethers.parseEther('10')))
    })
  })
})
