/**
 * @fileoverview This file contains all the functions that are used to interact with the Sapphire/Argent contracts with the aim of executing transactions by a relayer.
 */

import { AccountContract__factory, ArgentModule__factory, ERC721__factory } from '../../contracts'
import { parseEther, Signer } from 'ethers'
import { generateNonceForRelay, signOffChain, signOffChainForBridge } from './TransactionUtils'
import {
  BACKEND_ENDPOINTS,
  backendErrorResponse,
  contactBackend,
  executeTransactionResponse,
  getWrappedAccountAddressResponse,
} from '../backend/'
import { NETWORKS } from '../../constants/Networks'
import {
  LOCALHOST_ARGENT_MODULE_ADDRESS,
  LOCALHOST_SAPPHIRE_NFTS_ADDRESS,
  SEPOLIA_ARGENT_MODULE_ADDRESS,
  SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
} from '@env'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import { NETWORK_TO_CHAIN_IDS } from '../../constants/NetworksMetadata'

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
  chainId: bigint
} & TransactionArgent

/**
 * This function prepares a transfer ERC721 to be executed by a relayer.
 * @param ERC721ContractAddress
 * @param from
 * @param to
 * @param tokenId
 */
export async function prepareERC721TransferTransaction(
  ERC721ContractAddress: string,
  from: string,
  to: string,
  tokenId: number
): Promise<TransactionArgent> {
  // Real transaction
  // const transferTransaction = await ERC721Contract['safeTransferFrom(address,address,uint256)'].populateTransaction(
  //   from,
  //   to,
  //   tokenId
  // )
  const transferTransaction = ERC721__factory.createInterface().encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [from, to, tokenId]
  )

  // Argent transaction
  return {
    to: ERC721ContractAddress,
    value: 0n,
    data: transferTransaction,
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
  chainId: bigint,
  to: string,
  value: bigint,
  data: string,
  signature: string
): Promise<BridgeTransactionArgent> {
  // Argent transaction
  return {
    callType,
    chainId,
    to,
    value,
    data,
    signature,
  }
}

/**
 * All the transactions that require external connection (contracts that are not Argent's) need to be wrapped in a multiCall.
 * @param from
 * @param transactionArgent
 */
export function wrapInMultiCall(from: string, transactionArgent: TransactionArgent[]) {
  return ArgentModule__factory.createInterface().encodeFunctionData('multiCall', [from, transactionArgent])
}

export function wrapInBridgeCall(from: string, transactionArgent: TransactionArgent) {
  return ArgentModule__factory.createInterface().encodeFunctionData('bridgeCall', [from, transactionArgent])
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
  const erc721TransferTransaction = await prepareERC721TransferTransaction(
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_SAPPHIRE_NFTS_ADDRESS as string)
      : (SEPOLIA_SAPPHIRE_NFTS_ADDRESS as string),
    walletAddress,
    to,
    tokenId
  )

  const transactionData = wrapInMultiCall(walletAddress, [erc721TransferTransaction])

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
    bridgeNetwork: null,
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
  const ethTransferTransaction = await prepareETHTransferTransaction(to, value)

  const transactionData = wrapInMultiCall(walletAddress, [ethTransferTransaction])

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
    bridgeNetwork: null,
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
  const ethTransferTransaction = await prepareBridgeTransaction(
    BridgeCallType.BRIDGE_ETH,
    BigInt(NETWORK_TO_CHAIN_IDS[BRIDGE_NETWORKS.AMOY]),
    to,
    parseEther(value.toString()),
    '0x',
    '0x'
  )

  const transactionData = wrapInBridgeCall(walletAddress, ethTransferTransaction)

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
    bridgeNetwork: BRIDGE_NETWORKS.AMOY,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

export async function requestNFTBridgeCall(walletAddress: string, tokenId: number, signer: Signer, network: NETWORKS) {
  const transactionData = ERC721__factory.createInterface().encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [
      walletAddress,
      network === NETWORKS.LOCALHOST
        ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
        : (SEPOLIA_ARGENT_MODULE_ADDRESS as string),
      tokenId,
    ]
  )

  const transactionToBeExecutedOnBaseChain = await prepareBridgeTransaction(
    BridgeCallType.BRIDGE_NFT,
    BigInt(NETWORK_TO_CHAIN_IDS[BRIDGE_NETWORKS.AMOY]),
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_SAPPHIRE_NFTS_ADDRESS as string)
      : (SEPOLIA_SAPPHIRE_NFTS_ADDRESS as string),
    0n,
    transactionData,
    '0x'
  )

  const transactionWrappedForBaseChain = wrapInBridgeCall(walletAddress, transactionToBeExecutedOnBaseChain)

  const { signedTransaction, nonce } = await signTransaction(
    transactionWrappedForBaseChain,
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
    transactionData: transactionWrappedForBaseChain,
    bridgeNetwork: BRIDGE_NETWORKS.AMOY,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

export async function requestMATICTransfer(
  walletAddress: string,
  to: string,
  value: number,
  signer: Signer,
  network: NETWORKS,
  destinationNetwork: BRIDGE_NETWORKS,
  internalSapphireTX: boolean
) {
  let realTo = to

  if (internalSapphireTX) {
    const result = (await contactBackend(BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS, {
      address: to,
      network: destinationNetwork,
    })) as getWrappedAccountAddressResponse | backendErrorResponse

    if ('error' in result) {
      throw new Error(result.error)
    }

    realTo = result.address
  }

  const wrappedTXForDestChain = AccountContract__factory.createInterface().encodeFunctionData('execute', [
    realTo,
    parseEther(value.toString()),
    '0x',
  ])

  const destinationChainId = NETWORK_TO_CHAIN_IDS[destinationNetwork]

  const signedTXForDestChain = await signOffChainForBridge(
    signer,
    walletAddress,
    wrappedTXForDestChain,
    BigInt(destinationChainId)
  )

  const baseChainTX = await prepareBridgeTransaction(
    BridgeCallType.DEST,
    BigInt(destinationChainId),
    realTo,
    0n,
    wrappedTXForDestChain,
    signedTXForDestChain
  )

  const wrappedBaseChainTX = wrapInBridgeCall(walletAddress, baseChainTX)

  const { signedTransaction, nonce } = await signTransaction(
    wrappedBaseChainTX,
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
    transactionData: wrappedBaseChainTX,
    bridgeNetwork: BRIDGE_NETWORKS.AMOY,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}
