/**
 * @fileoverview This file contains all the functions that are used to interact with the Sapphire/Argent contracts with the aim of executing transactions by a relayer.
 */

import {
  ArgentModule,
  ArgentModule__factory,
  SapphireNFTs__factory,
  ERC721,
} from '../../contracts'
import { parseEther, Signer } from 'ethers'
import { generateNonceForRelay, signOffchain } from './TransactionUtils'
import {
  BACKEND_ENDPOINTS,
  backendErrorResponse,
  contactBackend,
  executeTransactionResponse,
} from '../backend/'
import { NETWORKS } from '../../constants/Networks'
import {
  LOCALHOST_ARGENT_MODULE_ADDRESS,
  LOCALHOST_SAPPHIRE_NFTS_ADDRESS,
  SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
} from '@env'

export type TransactionArgent = {
  to: string
  value: bigint
  data: string
}

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
  const transferTransaction = await ERC721Contract[
    'safeTransferFrom(address,address,uint256)'
  ].populateTransaction(from, to, tokenId)

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
export async function prepareETHTransferTransaction(
  to: string,
  value: number
): Promise<TransactionArgent> {
  // Argent transaction
  return {
    to: to,
    value: parseEther(value.toString()),
    data: '0x',
  }
}

/**
 * All the transactions that require external connection (contracts that are not Argent's) need to be wrapped in a multiCall.
 * @param ArgentModule
 * @param from
 * @param transactionArgent
 */
export function wrapInMultiCall(
  ArgentModule: ArgentModule,
  from: string,
  transactionArgent: TransactionArgent[]
) {
  return ArgentModule.interface.encodeFunctionData('multiCall', [
    from,
    transactionArgent,
  ])
}

export async function signTransaction(
  unsignedTransaction: string,
  signer: Signer
) {
  const provider = signer.provider
  if (!provider) {
    throw new Error('No provider, probably a connection error')
  }

  const chainId = (await provider.getNetwork()).chainId
  const nonce = await generateNonceForRelay(provider)
  const signedTransaction = await signOffchain(
    signer,
    LOCALHOST_ARGENT_MODULE_ADDRESS,
    unsignedTransaction,
    chainId,
    nonce
  )

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
    LOCALHOST_ARGENT_MODULE_ADDRESS as string,
    signer
  )

  const SapphireNFTs = SapphireNFTs__factory.connect(
    network === NETWORKS.LOCALHOST
      ? LOCALHOST_SAPPHIRE_NFTS_ADDRESS
      : SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
    signer
  )

  const erc721TransferTransaction = await prepareERC721TransferTransaction(
    SapphireNFTs,
    walletAddress,
    to,
    tokenId
  )

  const transactionData = wrapInMultiCall(ArgentModule, walletAddress, [
    erc721TransferTransaction,
  ])

  const { signedTransaction, nonce } = await signTransaction(
    transactionData,
    signer
  )

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network: network,
    walletAddress: walletAddress,
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
  signer: Signer
) {
  const ArgentModule = ArgentModule__factory.connect(
    LOCALHOST_ARGENT_MODULE_ADDRESS as string,
    signer
  )

  const ethTransferTransaction = await prepareETHTransferTransaction(to, value)

  const transactionData = wrapInMultiCall(ArgentModule, walletAddress, [
    ethTransferTransaction,
  ])

  const { signedTransaction, nonce } = await signTransaction(
    transactionData,
    signer
  )

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network: NETWORKS.LOCALHOST,
    walletAddress: walletAddress,
    nonce,
    signedTransaction,
    transactionData,
  })) as executeTransactionResponse | backendErrorResponse
  console.log('result', result)
  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}
