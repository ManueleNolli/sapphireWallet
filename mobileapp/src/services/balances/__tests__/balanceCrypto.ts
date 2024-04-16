import { getBalance } from '../balanceCrypto'
import { NETWORKS } from '../../../constants/Networks'
import { BACKEND_ENDPOINTS, contactBackend, getBalanceResponse } from '../../backend'

jest.mock('../../backend')

describe('getBalance', () => {
  it('returns balance when backend response is successful', async () => {
    const mockResponse: getBalanceResponse = {
      sepolia: {
        balance: '1000',
        chainID: '1',
        crypto: 'ETH',
      },
    }
    ;(contactBackend as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getBalance('testAddress', NETWORKS.SEPOLIA)

    expect(result).toEqual(mockResponse)
    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_BALANCE, {
      network: NETWORKS.SEPOLIA,
      walletAddress: 'testAddress',
    })
  })

  it('throws error when backend response contains error', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({ error: 'error Balance' })

    await expect(getBalance('testAddress', NETWORKS.SEPOLIA)).rejects.toThrow('error Balance')

    expect(contactBackend).toHaveBeenCalledWith(BACKEND_ENDPOINTS.GET_BALANCE, {
      network: NETWORKS.SEPOLIA,
      walletAddress: 'testAddress',
    })
  })
})
