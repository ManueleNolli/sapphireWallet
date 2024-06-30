import { NETWORKS } from '../../../constants/Networks'
import { BACKEND_ENDPOINTS, contactBackend, getBalancesNFTResponse } from '../../backend'
import { getNFTBalance } from '../balanceNFTs'

jest.mock('../../backend')

describe('getBalanceNFTs', () => {
  it('returns getBalanceNFTs when backend response is successful', async () => {
    const mockResponse: getBalancesNFTResponse = {
      sepolia: 1,
      amoy: 2,
    }
    ;(contactBackend as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getNFTBalance('testAddress', NETWORKS.SEPOLIA)

    expect(result).toEqual(mockResponse)
    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_NFT_BALANCE, {
      network: NETWORKS.SEPOLIA,
      walletAddress: 'testAddress',
    })
  })

  it('throws error when backend response contains error', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({ error: 'error Balance' })

    await expect(getNFTBalance('testAddress', NETWORKS.SEPOLIA)).rejects.toThrow('error Balance')

    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_NFT_BALANCE, {
      network: NETWORKS.SEPOLIA,
      walletAddress: 'testAddress',
    })
  })
})
