import { createWallet } from '../../scripts/argentContracts/createWallet'

import { ethers } from 'hardhat'
import { expect } from 'chai'
import deployInfrastructure from '../../scripts/argentContracts/deployInfrastructure'
import { InfrastructureTypes } from '../../scripts/argentContracts/utils/infrastructureTypes'
import { generateNonceForRelay, signOffchain, signOffChainForBridge } from '../../scripts/argentContracts/utils/genericUtils'
import { EventLog, parseEther, ZeroAddress } from 'ethers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { AccountContract__factory, ArgentWrappedAccounts, NFTStorage, SapphireNFTs, SapphireNFTs__factory } from '../../typechain-types'
import { anyUint } from '@nomicfoundation/hardhat-chai-matchers/withArgs'

enum BridgeCallType {
  DEST,
  BRIDGE_ETH,
  BRIDGE_NFT,
}

describe('Bridge Integration', function () {
  let deployer: HardhatEthersSigner
  let account1BaseChain: HardhatEthersSigner
  let account2DestChain: HardhatEthersSigner

  let infrastructure: InfrastructureTypes
  let argentWrappedAccounts: ArgentWrappedAccounts
  let nftStorage: NFTStorage
  let baseChainNFT: SapphireNFTs

  beforeEach(async function () {
    ;[deployer, account1BaseChain, account2DestChain] = await ethers.getSigners()
    infrastructure = await deployInfrastructure(deployer)

    const NFTStorageContract = await ethers.getContractFactory('NFTStorage')
    nftStorage = await NFTStorageContract.connect(deployer).deploy()

    const ArgentWrappedAccountsContract = await ethers.getContractFactory('ArgentWrappedAccounts')

    const SapphireNFTsContract = await ethers.getContractFactory('SapphireNFTs')
    baseChainNFT = await SapphireNFTsContract.connect(deployer).deploy(deployer)

    argentWrappedAccounts = await ArgentWrappedAccountsContract.connect(deployer).deploy(nftStorage)

    await nftStorage.transferOwnership(await argentWrappedAccounts.getAddress())
  })

  it('Full ETH Transfer Bridge, type BRIDGE_ETH', async function () {
    const startBalanceArgentModule = await ethers.provider.getBalance(await infrastructure.argentModule.getAddress())

    /////////////////////////////////////////
    //// INFRASTRUCTURE PREPARATION
    /////////////////////////////////////////

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1BaseChain.address,
      deployer.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    )

    // send eth to walletAccount1
    await deployer.sendTransaction({
      to: walletAccount1Address,
      value: ethers.parseEther('100'),
    })

    // send eth to argentWrappedAccounts
    await deployer.sendTransaction({
      to: await argentWrappedAccounts.getAddress(),
      value: ethers.parseEther('1000'),
    })

    const startBalanceAccount1 = await ethers.provider.getBalance(walletAccount1Address)
    /////////////////////////////////////////
    //// TRANSACTION PREPARATION
    /////////////////////////////////////////

    const transactionToBeExecutedOnBaseChain = {
      callType: BridgeCallType.BRIDGE_ETH,
      to: walletAccount1Address,
      value: ethers.parseEther('10'),
      data: '0x',
      signature: '0x',
    }

    const transactionWrappedForBaseChain = infrastructure.argentModule.interface.encodeFunctionData('bridgeCall', [
      walletAccount1Address,
      transactionToBeExecutedOnBaseChain,
    ])

    // Sign *offChain* the transaction
    const baseChainId = (await ethers.provider.getNetwork()).chainId
    const nonce = await generateNonceForRelay()
    const gasLimit = 1000000

    const signatures = await signOffchain(
      [account1BaseChain],
      await infrastructure.argentModule.getAddress(),
      0,
      transactionWrappedForBaseChain,
      baseChainId,
      nonce,
      0,
      gasLimit,
      '0x0000000000000000000000000000000000000000',
      ZeroAddress
    )

    /////////////////////////////////////////
    //// TRANSACTION EXECUTION
    /////////////////////////////////////////
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        transactionWrappedForBaseChain,
        nonce,
        signatures,
        0,
        gasLimit,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000'
      )

    const txResponse = await tx.wait()

    /////////////////////////////////////////
    //// BRIDGE
    /////////////////////////////////////////

    // check event emitted
    const event = txResponse?.logs[1] as EventLog // 0 is the transfer of ETH from walletAddress to argentModule
    const eventName = event?.fragment.name
    expect(eventName).to.equal('BridgeCall')
    const eventArgs = event?.args
    const event_callId = eventArgs[0]
    const event_wallet = eventArgs[1]
    const event_callType = eventArgs[2]
    const event_destAddress = eventArgs[3]
    const event_value = eventArgs[4]
    const event_data = eventArgs[5]
    const event_signature = eventArgs[6]
    const event_owner = eventArgs[7]
    anyUint(event_callId)
    expect(event_wallet).to.equal(walletAccount1Address)
    expect(event_callType).to.equal(BridgeCallType.BRIDGE_ETH)
    expect(event_destAddress).to.equal(walletAccount1Address)
    expect(event_value).to.equal(parseEther('10'))
    expect(event_data).to.equal('0x')
    expect(event_signature).to.equal('0x')
    expect(event_owner).to.equal(account1BaseChain.address)

    // Bridge will call the destination chain contract
    await argentWrappedAccounts.connect(deployer).depositToAccountContract(event_wallet, event_value)

    /////////////////////////////////////////
    //// Final checks
    /////////////////////////////////////////

    const endBalanceArgentModule = await ethers.provider.getBalance(await infrastructure.argentModule.getAddress())

    const endBalanceAccount1 = await ethers.provider.getBalance(walletAccount1Address)

    expect(endBalanceArgentModule).to.equal(startBalanceArgentModule + parseEther('10'))

    expect(endBalanceAccount1).to.equal(startBalanceAccount1 - parseEther('10'))

    const account1DestChain = await argentWrappedAccounts.getAccountContract(walletAccount1Address)
    const balanceAccount1DestChain = await ethers.provider.getBalance(account1DestChain)

    expect(balanceAccount1DestChain).to.equal(parseEther('10'))
  })

  it('Full NFT Transfer Bridge, type BRIDGE_NFT', async function () {
    /////////////////////////////////////////
    //// INFRASTRUCTURE PREPARATION
    /////////////////////////////////////////

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1BaseChain.address,
      deployer.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    )

    // Mint NFT in BaseChain
    const uri = 'https://ipfs.io/ipfs/ABCDEF/0'
    await baseChainNFT.safeMint(walletAccount1Address, uri)

    // Check that the NFT is minted
    const tokenId = 0
    expect(walletAccount1Address).to.equal(await baseChainNFT.ownerOf(tokenId))

    /////////////////////////////////////////
    //// TRANSACTION PREPARATION
    /////////////////////////////////////////
    const transactionData = SapphireNFTs__factory.createInterface().encodeFunctionData('safeTransferFrom(address,address,uint256)', [
      walletAccount1Address,
      await infrastructure.argentModule.getAddress(),
      0,
    ])

    const transactionToBeExecutedOnBaseChain = {
      callType: BridgeCallType.BRIDGE_NFT,
      to: await baseChainNFT.getAddress(),
      value: 0,
      data: transactionData,
      signature: '0x',
    }

    const transactionWrappedForBaseChain = infrastructure.argentModule.interface.encodeFunctionData('bridgeCall', [
      walletAccount1Address,
      transactionToBeExecutedOnBaseChain,
    ])

    // Sign *offChain* the transaction
    const baseChainId = (await ethers.provider.getNetwork()).chainId
    const nonce = await generateNonceForRelay()
    const gasLimit = 1000000

    const signatures = await signOffchain(
      [account1BaseChain],
      await infrastructure.argentModule.getAddress(),
      0,
      transactionWrappedForBaseChain,
      baseChainId,
      nonce,
      0,
      gasLimit,
      '0x0000000000000000000000000000000000000000',
      ZeroAddress
    )
    /////////////////////////////////////////
    //// TRANSACTION EXECUTION
    /////////////////////////////////////////
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        transactionWrappedForBaseChain,
        nonce,
        signatures,
        0,
        gasLimit,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000'
      )

    const txResponse = await tx.wait()

    /////////////////////////////////////////
    //// BRIDGE
    /////////////////////////////////////////

    // check event emitted
    const event = txResponse?.logs[2] as EventLog
    const eventName = event?.fragment.name
    expect(eventName).to.equal('BridgeCall')
    const eventArgs = event?.args
    const event_callId = eventArgs[0]
    const event_wallet = eventArgs[1]
    const event_callType = eventArgs[2]
    const event_destAddress = eventArgs[3]
    const event_value = eventArgs[4]
    const event_data = eventArgs[5]
    const event_signature = eventArgs[6]
    const event_owner = eventArgs[7]
    anyUint(event_callId)
    expect(event_wallet).to.equal(walletAccount1Address)
    expect(event_callType).to.equal(BridgeCallType.BRIDGE_NFT)
    expect(event_destAddress).to.equal(await baseChainNFT.getAddress())
    expect(event_value).to.equal(parseEther('0'))
    expect(event_data).to.equal(transactionData)
    expect(event_signature).to.equal('0x')
    expect(event_owner).to.equal(account1BaseChain.address)

    // owner of the new NFT = event_owner account contract in the destination chain
    // original NFT address = event_destAddress
    // original NFT id = inside event_data

    // decode data
    const decodedData = SapphireNFTs__factory.createInterface().decodeFunctionData('safeTransferFrom(address,address,uint256)', event_data)
    expect(decodedData[0]).to.equal(walletAccount1Address)
    expect(decodedData[1]).to.equal(await infrastructure.argentModule.getAddress())
    expect(decodedData[2]).to.equal(tokenId)

    // Bridge will get uri information from the original NFT
    const uri_baseChain = await baseChainNFT.tokenURI(tokenId)
    await argentWrappedAccounts.connect(deployer).safeMint(event_wallet, uri_baseChain, event_destAddress, tokenId)

    /////////////////////////////////////////
    //// Final checks
    /////////////////////////////////////////

    // Check that the NFT is minted
    const account1DestChain = await argentWrappedAccounts.getAccountContract(walletAccount1Address)

    const balanceAccount1DestChain = await nftStorage.balanceOf(account1DestChain)
    expect(balanceAccount1DestChain).to.equal(1)

    const tokenURI = await nftStorage.tokenURI(0)
    expect(tokenURI).to.equal(uri_baseChain)

    // Check base chain NFT
    const owner = await baseChainNFT.ownerOf(tokenId)
    expect(owner).to.equal(await infrastructure.argentModule.getAddress())
  })

  it('Full ETH Transfer Bridge, type DEST', async function () {
    const startBalanceAccount2 = await ethers.provider.getBalance(account2DestChain.address)

    /////////////////////////////////////////
    //// INFRASTRUCTURE PREPARATION
    /////////////////////////////////////////

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1BaseChain.address,
      deployer.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    )

    // Create Bridge Account
    await argentWrappedAccounts.createAccountContract(walletAccount1Address)

    // send eth to argentWrappedAccounts
    await deployer.sendTransaction({
      to: await argentWrappedAccounts.getAddress(),
      value: ethers.parseEther('1000'),
    })

    // Deposit ETH to AccountContract
    await argentWrappedAccounts.depositToAccountContract(walletAccount1Address, parseEther('100'))

    const account1DestChain = await argentWrappedAccounts.getAccountContract(walletAccount1Address)
    const startBalanceAccount1DestChain = await ethers.provider.getBalance(account1DestChain)

    /////////////////////////////////////////
    //// TRANSACTION PREPARATION
    /////////////////////////////////////////

    const transactionToBeExecutedOnDestChain = {
      to: account2DestChain.address,
      value: ethers.parseEther('10'),
      data: '0x',
    }

    const transactionWrappedForDestChain = AccountContract__factory.createInterface().encodeFunctionData('execute', [
      transactionToBeExecutedOnDestChain.to,
      transactionToBeExecutedOnDestChain.value,
      transactionToBeExecutedOnDestChain.data,
    ])

    const destinationChainID = (await ethers.provider.getNetwork()).chainId

    const signedTransactionWrappedForDestChain = await signOffChainForBridge(
      account1BaseChain,
      walletAccount1Address,
      transactionWrappedForDestChain,
      destinationChainID
    )

    const transactionToBeExecutedOnBaseChain = {
      callType: BridgeCallType.DEST,
      to: account2DestChain.address,
      value: 0,
      data: transactionWrappedForDestChain,
      signature: signedTransactionWrappedForDestChain,
    }

    const transactionWrappedForBaseChain = infrastructure.argentModule.interface.encodeFunctionData('bridgeCall', [
      walletAccount1Address,
      transactionToBeExecutedOnBaseChain,
    ])

    // Sign *offChain* the transaction
    const baseChainId = (await ethers.provider.getNetwork()).chainId
    const nonce = await generateNonceForRelay()
    const gasLimit = 1000000

    const signatures = await signOffchain(
      [account1BaseChain],
      await infrastructure.argentModule.getAddress(),
      0,
      transactionWrappedForBaseChain,
      baseChainId,
      nonce,
      0,
      gasLimit,
      '0x0000000000000000000000000000000000000000',
      ZeroAddress
    )

    /////////////////////////////////////////
    //// TRANSACTION EXECUTION
    /////////////////////////////////////////
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        transactionWrappedForBaseChain,
        nonce,
        signatures,
        0,
        gasLimit,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000'
      )

    const txResponse = await tx.wait()

    /////////////////////////////////////////
    //// BRIDGE
    /////////////////////////////////////////

    // check event emitted
    const event = txResponse?.logs[0] as EventLog
    const eventName = event?.fragment.name
    expect(eventName).to.equal('BridgeCall')
    const eventArgs = event?.args
    const event_callId = eventArgs[0]
    const event_wallet = eventArgs[1]
    const event_callType = eventArgs[2]
    const event_destAddress = eventArgs[3]
    const event_value = eventArgs[4]
    const event_data = eventArgs[5]
    const event_signature = eventArgs[6]
    const event_owner = eventArgs[7]
    anyUint(event_callId)
    expect(event_wallet).to.equal(walletAccount1Address)
    expect(event_callType).to.equal(BridgeCallType.DEST)
    expect(event_destAddress).to.equal(account2DestChain.address)
    expect(event_value).to.equal(parseEther('0'))
    expect(event_data).to.equal(transactionWrappedForDestChain)
    expect(event_signature).to.equal(signedTransactionWrappedForDestChain)
    expect(event_owner).to.equal(account1BaseChain.address)

    // Bridge will call the destination chain contract
    await argentWrappedAccounts.connect(deployer).execute(event_wallet, event_owner, event_data, event_signature)

    /////////////////////////////////////////
    //// Final checks
    /////////////////////////////////////////

    const endBalanceAccount2 = await ethers.provider.getBalance(account2DestChain.address)
    const endBalanceAccount1DestChain = await ethers.provider.getBalance(account1DestChain)

    expect(endBalanceAccount2).to.equal(startBalanceAccount2 + parseEther('10'))
    expect(endBalanceAccount1DestChain).to.equal(startBalanceAccount1DestChain - parseEther('10'))
  })

  it('Full NFT Transfer Bridge, type DEST', async function () {
    /////////////////////////////////////////////////////
    //// INFRASTRUCTURE PREPARATION: Mint NFT in DestChain
    /////////////////////////////////////////////////////

    // Create wallet for account 1
    const walletAccount1Address = await createWallet(
      infrastructure.walletFactory,
      account1BaseChain.address,
      deployer.address,
      deployer.address,
      await infrastructure.argentModule.getAddress()
    )

    // Mint NFT in BaseChain
    const uri = 'https://ipfs.io/ipfs/ABCDEF/0'
    const tokenId = 0
    await argentWrappedAccounts.connect(deployer).safeMint(walletAccount1Address, uri, await baseChainNFT.getAddress(), tokenId)

    expect(await nftStorage.balanceOf(await argentWrappedAccounts.getAccountContract(walletAccount1Address))).to.equal(1)
    expect(await nftStorage.tokenURI(0)).to.equal(uri)
    expect(await nftStorage.ownerOf(tokenId)).to.equal(await argentWrappedAccounts.getAccountContract(walletAccount1Address))

    // Create account2DestChain
    await argentWrappedAccounts.createAccountContract(account2DestChain)
    const account2DestChainBridgeAccount = await argentWrappedAccounts.getAccountContract(account2DestChain.address)

    /////////////////////////////////////////
    //// TRANSACTION PREPARATION
    /////////////////////////////////////////

    const transactionData = SapphireNFTs__factory.createInterface().encodeFunctionData('safeTransferFrom(address,address,uint256)', [
      await argentWrappedAccounts.getAccountContract(walletAccount1Address),
      account2DestChainBridgeAccount,
      0,
    ])

    const transactionToBeExecutedOnDestChain = {
      to: await nftStorage.getAddress(),
      value: 0,
      data: transactionData,
    }

    const transactionWrappedForDestChain = AccountContract__factory.createInterface().encodeFunctionData('execute', [
      transactionToBeExecutedOnDestChain.to,
      transactionToBeExecutedOnDestChain.value,
      transactionToBeExecutedOnDestChain.data,
    ])

    const destinationChainID = (await ethers.provider.getNetwork()).chainId

    const signedTransactionWrappedForDestChain = await signOffChainForBridge(
      account1BaseChain,
      walletAccount1Address,
      transactionWrappedForDestChain,
      destinationChainID
    )

    const transactionToBeExecutedOnBaseChain = {
      callType: BridgeCallType.DEST,
      to: account2DestChain.address,
      value: 0,
      data: transactionWrappedForDestChain,
      signature: signedTransactionWrappedForDestChain,
    }

    const transactionWrappedForBaseChain = infrastructure.argentModule.interface.encodeFunctionData('bridgeCall', [
      walletAccount1Address,
      transactionToBeExecutedOnBaseChain,
    ])

    // Sign *offChain* the transaction
    const baseChainId = (await ethers.provider.getNetwork()).chainId
    const nonce = await generateNonceForRelay()
    const gasLimit = 1000000

    const signatures = await signOffchain(
      [account1BaseChain],
      await infrastructure.argentModule.getAddress(),
      0,
      transactionWrappedForBaseChain,
      baseChainId,
      nonce,
      0,
      gasLimit,
      '0x0000000000000000000000000000000000000000',
      ZeroAddress
    )

    /////////////////////////////////////////
    //// TRANSACTION EXECUTION
    /////////////////////////////////////////
    const tx = await infrastructure.argentModule
      .connect(deployer)
      .execute(
        walletAccount1Address,
        transactionWrappedForBaseChain,
        nonce,
        signatures,
        0,
        gasLimit,
        '0x0000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000'
      )

    const txResponse = await tx.wait()

    /////////////////////////////////////////
    //// BRIDGE
    /////////////////////////////////////////

    // check event emitted
    const event = txResponse?.logs[0] as EventLog
    const eventName = event?.fragment.name
    expect(eventName).to.equal('BridgeCall')
    const eventArgs = event?.args
    const event_callId = eventArgs[0]
    const event_wallet = eventArgs[1]
    const event_callType = eventArgs[2]
    const event_destAddress = eventArgs[3]
    const event_value = eventArgs[4]
    const event_data = eventArgs[5]
    const event_signature = eventArgs[6]
    const event_owner = eventArgs[7]
    anyUint(event_callId)
    expect(event_wallet).to.equal(walletAccount1Address)
    expect(event_callType).to.equal(BridgeCallType.DEST)
    expect(event_destAddress).to.equal(account2DestChain.address)
    expect(event_value).to.equal(parseEther('0'))
    expect(event_data).to.equal(transactionWrappedForDestChain)
    expect(event_signature).to.equal(signedTransactionWrappedForDestChain)
    expect(event_owner).to.equal(account1BaseChain.address)

    // Bridge will call the destination chain contract
    await argentWrappedAccounts.connect(deployer).execute(event_wallet, event_owner, event_data, event_signature)

    /////////////////////////////////////////
    //// Final checks
    /////////////////////////////////////////
    expect(await nftStorage.balanceOf(await argentWrappedAccounts.getAccountContract(walletAccount1Address))).to.equal(0)
    expect(await nftStorage.ownerOf(tokenId)).to.equal(account2DestChainBridgeAccount)
  })
})
