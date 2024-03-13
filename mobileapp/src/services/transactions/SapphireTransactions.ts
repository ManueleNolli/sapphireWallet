/**
 * @fileoverview This file contains all the functions that are used to interact with the Sapphire/Argent contracts with the aim of executing transactions by a relayer.
 */

import { ArgentModule, ArgentModule__factory, ERC721, SapphireNFTs__factory } from '../../contracts'
import { parseEther, Signer } from 'ethers'
import { generateNonceForRelay, signOffChain } from './TransactionUtils'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, executeTransactionResponse } from '../backend/'
import { NETWORKS } from '../../constants/Networks'
import {
  LOCALHOST_ARGENT_MODULE_ADDRESS,
  LOCALHOST_SAPPHIRE_NFTS_ADDRESS,
  SEPOLIA_ARGENT_MODULE_ADDRESS,
  SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
} from '@env'

export type TransactionArgent = {
  to: string
  value: bigint
  data: string
}

enum BridgeCallType {
  DEST,
  BRIDGE_ETH,
  BRIDGE_NFT,
}

export type BridgeTransactionArgent = {
  callType: BridgeCallType
  signature: string
} & TransactionArgent

/**
 * This function prepares a transfer ERC721 to be executed by a relayer.
 * @param ERC721Contract
 * @param from
 * @param to
 * @param tokenId
 */
export async function prepareERC721TransferTransaction(
  ERC721Contract: ERC721,
  from: string,
  to: string,
  tokenId: number
): Promise<TransactionArgent> {
  // Real transaction
  const transferTransaction = await ERC721Contract['safeTransferFrom(address,address,uint256)'].populateTransaction(
    from,
    to,
    tokenId
  )

  // Argent transaction
  return {
    to: await ERC721Contract.getAddress(),
    value: 0n,
    data: transferTransaction.data,
  }
}

/**
 * This function prepares a transfer ETH to be executed by a relayer.
 * @param to
 * @param value
 */
export async function prepareETHTransferTransaction(to: string, value: number): Promise<TransactionArgent> {
  // Argent transaction
  return {
    to,
    value: parseEther(value.toString()),
    data: '0x',
  }
}

/**
 * This function prepares a Bridge call.
 * @param callType
 * @param to
 * @param value
 * @param data
 * @param signature
 */
export async function prepareBridgeTransaction(
  callType: BridgeCallType,
  to: string,
  value: bigint,
  data: string,
  signature: string
): Promise<BridgeTransactionArgent> {
  // Argent transaction
  return {
    callType,
    to,
    value,
    data,
    signature,
  }
}

/**
 * All the transactions that require external connection (contracts that are not Argent's) need to be wrapped in a multiCall.
 * @param ArgentModule
 * @param from
 * @param transactionArgent
 */
export function wrapInMultiCall(ArgentModule: ArgentModule, from: string, transactionArgent: TransactionArgent[]) {
  return ArgentModule.interface.encodeFunctionData('multiCall', [from, transactionArgent])
}

export function wrapInBridgeCall(ArgentModule: ArgentModule, from: string, transactionArgent: TransactionArgent) {
  return ArgentModule.interface.encodeFunctionData('bridgeCall', [from, transactionArgent])
}

export async function signTransaction(unsignedTransaction: string, signer: Signer, argentModuleAddress: string) {
  const provider = signer.provider
  if (!provider) {
    throw new Error('No provider, probably a connection error')
  }

  const chainId = (await provider.getNetwork()).chainId
  const nonce = await generateNonceForRelay(provider)
  const signedTransaction = await signOffChain(signer, argentModuleAddress, unsignedTransaction, chainId, nonce)

  return {
    signedTransaction,
    nonce,
  }
}

export async function requestERC721TokenTransfer(
  walletAddress: string,
  to: string,
  tokenId: number,
  signer: Signer,
  network: NETWORKS
) {
  const ArgentModule = ArgentModule__factory.connect(
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string),
    signer
  )

  const SapphireNFTs = SapphireNFTs__factory.connect(
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_SAPPHIRE_NFTS_ADDRESS as string)
      : (SEPOLIA_SAPPHIRE_NFTS_ADDRESS as string),
    signer
  )

  const erc721TransferTransaction = await prepareERC721TransferTransaction(SapphireNFTs, walletAddress, to, tokenId)

  const transactionData = wrapInMultiCall(ArgentModule, walletAddress, [erc721TransferTransaction])

  const { signedTransaction, nonce } = await signTransaction(
    transactionData,
    signer,
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)
  )

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress,
    nonce,
    signedTransaction,
    transactionData,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

export async function requestETHTransfer(
  walletAddress: string,
  to: string,
  value: number,
  signer: Signer,
  network: NETWORKS
) {
  const ArgentModule = ArgentModule__factory.connect(
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string),
    signer
  )

  const ethTransferTransaction = await prepareETHTransferTransaction(to, value)

  const transactionData = wrapInMultiCall(ArgentModule, walletAddress, [ethTransferTransaction])

  const { signedTransaction, nonce } = await signTransaction(
    transactionData,
    signer,
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)
  )

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress,
    nonce,
    signedTransaction,
    transactionData,
  })) as executeTransactionResponse | backendErrorResponse
  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

export async function requestETHBridgeCall(
  walletAddress: string,
  to: string,
  value: number,
  signer: Signer,
  network: NETWORKS
) {
  const ArgentModule = ArgentModule__factory.connect(
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string),
    signer
  )
  console.log('Bridge 1')
  const ethTransferTransaction = await prepareBridgeTransaction(
    BridgeCallType.BRIDGE_ETH,
    to,
    parseEther(value.toString()),
    '0x',
    '0x'
  )
  console.log('Bridge 2')

  const transactionData = wrapInBridgeCall(ArgentModule, walletAddress, ethTransferTransaction)
  console.log('Bridge 3')

  const { signedTransaction, nonce } = await signTransaction(
    transactionData,
    signer,
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)
  )

  console.log('Bridge 4')
  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress,
    nonce,
    signedTransaction,
    transactionData,
  })) as executeTransactionResponse | backendErrorResponse
  console.log('Bridge 5')

  if ('error' in result) {
    console.log('Bridge error', result)
    throw new Error(result.error)
  }
  console.log('Bridge 6')

  return result
}
