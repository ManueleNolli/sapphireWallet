import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, createWalletResponse } from '../backend/'
import { NETWORKS } from '../../constants/Networks'

/**
 * Service to contact wallet factory microservice through API
 */
export async function requestContractWallet(network: NETWORKS, eoaAddress: string, guardianAddress: string) {
  console.log("calling backend with: ", network, eoaAddress, guardianAddress)
  const result = (await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
    network: network,
    eoaAddress,
    guardianAddress,
  })) as createWalletResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}
