import { NETWORKS } from '../../constants/Networks'
import {
  BACKEND_ENDPOINTS,
  backendErrorResponse,
  contactBackend,
  getNFTMetadataResponse,
  getWrappedAccountAddressResponse,
} from '../backend'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'

export type OwnedNFT = {
  name: string
  description: string
  image: string
  tokenId: number
  network: NETWORKS | BRIDGE_NETWORKS
  collectionAddress: string
  collectionName: string
  collectionDescription: string
}

export async function ownedNFTs(address: string, network: NETWORKS | BRIDGE_NETWORKS): Promise<OwnedNFT[]> {
  let realAddress = address

  if (network in BRIDGE_NETWORKS) {
    const result = (await contactBackend(BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS, {
      address,
      network,
    })) as getWrappedAccountAddressResponse | backendErrorResponse

    if ('error' in result) {
      throw new Error(result.error)
    }

    realAddress = result.address
  }

  const result = (await contactBackend(BACKEND_ENDPOINTS.GET_NFT_METADATA, {
    network,
    address: realAddress,
  })) as getNFTMetadataResponse | backendErrorResponse
  if ('error' in result) {
    throw new Error((result as backendErrorResponse).error)
  }

  return result
}
