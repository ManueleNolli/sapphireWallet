import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, createWalletResponse } from '../backend/'
import { NETWORKS } from '../../constants/Networks'
import { ZeroAddress } from 'ethers'

/**
 * Service to contact wallet factory microservice through API
 */
export async function requestContractWallet(network: NETWORKS, eoaAddress: string, guardianAddress?: string) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
    network: network,
    eoaAddress,
    guardianAddress: guardianAddress === undefined ? ZeroAddress : guardianAddress,
  })) as createWalletResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}
