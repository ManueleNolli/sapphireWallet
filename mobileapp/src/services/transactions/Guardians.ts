import { NETWORKS } from '../../constants/Networks'
import { LOCALHOST_ARGENT_MODULE_ADDRESS, SEPOLIA_ARGENT_MODULE_ADDRESS } from '@env'
import { ArgentModule__factory } from '../../contracts'
import { Signer } from 'ethers'
import { signTransaction, TransactionArgent, wrapInMultiCall } from './SapphireTransactions'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, executeTransactionResponse } from '../backend'

export async function getGuardians(provider: any, network: NETWORKS, address: string) {
  const argentModuleAddress =
    network === NETWORKS.LOCALHOST
      ? (LOCALHOST_ARGENT_MODULE_ADDRESS as string)
      : (SEPOLIA_ARGENT_MODULE_ADDRESS as string)

  const argentModule = ArgentModule__factory.connect(argentModuleAddress, provider)

  return argentModule.getGuardians(address)
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
