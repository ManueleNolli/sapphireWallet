import { NETWORKS } from '../../constants/Networks'
import { LOCALHOST_ARGENT_MODULE_ADDRESS, SEPOLIA_ARGENT_MODULE_ADDRESS } from '@env'
import { ArgentModule__factory } from '../../contracts'
import { HDNodeWallet, Signer } from 'ethers'
import {
  signTransaction,
  TransactionArgent,
  wrapInMultiCall,
  wrapInMultiCallWithGuardians,
} from './SapphireTransactions'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, executeTransactionResponse } from '../backend'
import { NETWORK_TO_CHAIN_IDS } from '../../constants/NetworksMetadata'
import { RecoverWallet } from '../../types/RecoverWallet'
import { getMnemonic } from '../wallet'

export async function getGuardians(provider: any, network: NETWORKS, address: string) {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const argentModule = ArgentModule__factory.connect(argentModuleAddress, provider)

  return argentModule.getGuardians(address)
}

/*
 * Returns a list of which addresses an address is guarding
 */
export async function getGuardianWallets(provider: any, network: NETWORKS, address: string) {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const argentModule = ArgentModule__factory.connect(argentModuleAddress, provider)

  return argentModule.getGuardianWallets(address)
}

export async function addGuardian(signer: Signer, network: NETWORKS, walletAddress: string, guardian: string) {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const tx = ArgentModule__factory.createInterface().encodeFunctionData('addGuardian', [walletAddress, guardian])

  const preparedTx: TransactionArgent = {
    to: argentModuleAddress,
    value: 0n,
    data: tx,
  }

  const wrappedTx = wrapInMultiCall(walletAddress, [preparedTx])

  const { signedTransaction, nonce } = await signTransaction(wrappedTx, signer, argentModuleAddress)

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress,
    nonce,
    signedTransaction,
    transactionData: wrappedTx,
    bridgeNetwork: null,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

export async function removeGuardian(signer: Signer, network: NETWORKS, walletAddress: string, guardian: string) {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const tx = ArgentModule__factory.createInterface().encodeFunctionData('revokeGuardian', [walletAddress, guardian])

  const preparedTx: TransactionArgent = {
    to: argentModuleAddress,
    value: 0n,
    data: tx,
  }

  const wrappedTx = wrapInMultiCall(walletAddress, [preparedTx])

  const { signedTransaction, nonce } = await signTransaction(wrappedTx, signer, argentModuleAddress)

  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress,
    nonce,
    signedTransaction,
    transactionData: wrappedTx,
    bridgeNetwork: null,
  })) as executeTransactionResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}

/*
 * Prepare a transaction to recover a wallet
 * that operations is done by the guardian
 * @param signer
 * @param network
 * @param smartWalletToRecover: the address of the wallet to recover
 * @param newAddress: the address of the new owner
 */
export async function prepareRecoverWallet(
  signer: Signer,
  network: NETWORKS,
  smartWalletToRecover: string,
  newWallet: HDNodeWallet
): Promise<RecoverWallet> {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const tx = ArgentModule__factory.createInterface().encodeFunctionData('executeRecovery', [
    smartWalletToRecover,
    newWallet.address,
  ])

  const preparedTx: TransactionArgent = {
    to: argentModuleAddress,
    value: 0n,
    data: tx,
  }

  const wrappedTx = wrapInMultiCallWithGuardians(smartWalletToRecover, [preparedTx])

  const { signedTransaction, nonce } = await signTransaction(wrappedTx, signer, argentModuleAddress)

  const chainID = signer.provider
    ? (await signer.provider.getNetwork()).chainId.toString()
    : NETWORK_TO_CHAIN_IDS[network]

  return {
    walletAddress: smartWalletToRecover,
    chainID,
    nonce,
    wrappedTransaction: wrappedTx,
    signedTransaction,
    mnemonic: getMnemonic(newWallet),
  }
}

/*
 * Conclude the recover wallet transaction, that operation is done by the user that is recovering the wallet
 */
export async function concludeRecoverWallet(
  network: NETWORKS,
  smartWalletToRecover: string,
  transactionData: string,
  signedTransaction: string,
  nonce: string
) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.EXECUTE_TRANSACTION, {
    network,
    walletAddress: smartWalletToRecover,
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
