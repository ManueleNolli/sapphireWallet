import { NETWORKS } from '../../constants/Networks'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, getBalanceResponse } from '../backend'

export async function getBalance(walletAddress: string, baseNetwork: NETWORKS) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.GET_BALANCE, {
    network: baseNetwork,
    walletAddress,
  })) as getBalanceResponse | backendErrorResponse
  if ('error' in result) {
    throw new Error(result.error)
  }

  return result
}
