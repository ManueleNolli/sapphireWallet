import {
  BACKEND_ENDPOINTS,
  backendErrorResponse,
  contactBackend,
  createWalletResponse,
} from '../backend/'
import { NETWORKS } from '../../constants/Networks'

/**
 * Service to contact wallet factory microservice through API
 */
export async function requestContractWallet(eoaAddress: string) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
    network: NETWORKS.LOCALHOST,
    eoaAddress,
  })) as createWalletResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }
  return result
}
