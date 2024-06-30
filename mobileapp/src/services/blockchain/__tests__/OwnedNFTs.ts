import { NETWORKS } from '../../../constants/Networks'
import { ownedNFTs } from '../OwnedNFTs'
import {
  BACKEND_ENDPOINTS,
  contactBackend,
  getNFTMetadataResponse,
  getWrappedAccountAddressResponse,
} from '../../backend'
import { BRIDGE_NETWORKS } from '../../../constants/BridgeNetworks'

jest.mock('../../backend')

describe('ownedNFTs Function', () => {
  it('returns nft when backend response is successful - No Bridge Network', async () => {
    const mockResponse: getNFTMetadataResponse = [
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ]
    ;(contactBackend as jest.Mock).mockResolvedValue(mockResponse)

    const result = await ownedNFTs('testAddress', NETWORKS.SEPOLIA)

    expect(result).toEqual(mockResponse)
    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_NFT_METADATA, {
      network: NETWORKS.SEPOLIA,
      address: 'testAddress',
    })
  })

  it('throws error when backend response contains error - No Bridge Network', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({ error: 'error Balance' })

    await expect(ownedNFTs('testAddress', NETWORKS.SEPOLIA)).rejects.toThrow('error Balance')

    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_NFT_METADATA, {
      network: NETWORKS.SEPOLIA,
      address: 'testAddress',
    })
  })

  it('returns nft when backend response is successful - Bridge Network', async () => {
    const wrappedAccountResponse: getWrappedAccountAddressResponse = {
      address: 'mockWrappedAccountAddress',
      network: BRIDGE_NETWORKS.AMOY,
    }
    const mockResponse: getNFTMetadataResponse = [
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ]
    ;(contactBackend as jest.Mock).mockResolvedValueOnce(wrappedAccountResponse)
    ;(contactBackend as jest.Mock).mockResolvedValueOnce(mockResponse)

    const result = await ownedNFTs('testAddress', BRIDGE_NETWORKS.AMOY)

    expect(result).toEqual(mockResponse)
    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS, {
      network: BRIDGE_NETWORKS.AMOY,
      address: 'testAddress',
    })
    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_NFT_METADATA, {
      network: BRIDGE_NETWORKS.AMOY,
      address: 'mockWrappedAccountAddress',
    })
  })

  it('throws error when backend response contains error - Bridge Network', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({ error: 'error Wrapped Account' })

    await expect(ownedNFTs('testAddress', BRIDGE_NETWORKS.AMOY)).rejects.toThrow('error Wrapped Account')

    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS, {
      network: BRIDGE_NETWORKS.AMOY,
      address: 'testAddress',
    })
  })
})
