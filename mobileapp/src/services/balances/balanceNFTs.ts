import { NETWORKS } from '../../constants/Networks'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, getBalancesNFTResponse } from '../backend'

export async function getNFTBalance(walletAddress: string, baseNetwork: NETWORKS) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.GET_NFT_BALANCE, {
    network: baseNetwork,
    walletAddress,
  })) as getBalancesNFTResponse | backendErrorResponse
  if ('error' in result) {
    throw new Error((result as backendErrorResponse).error)
  }

  return result
}
