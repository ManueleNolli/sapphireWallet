import {
  BACKEND_ENDPOINTS,
  backendErrorResponse,
  contactBackend,
  createWalletResponse,
} from '../backend/'
import { NETWORKS } from '../../constants/Networks'
import * as net from 'net'

/**
 * Service to contact wallet factory microservice through API
 */
export async function requestContractWallet(
  eoaAddress: string,
  network: NETWORKS
) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
    network: network,
    eoaAddress,
  })) as createWalletResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }
  return result
}
