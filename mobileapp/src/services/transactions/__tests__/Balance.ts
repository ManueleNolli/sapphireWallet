import { Provider } from 'ethers'
import { getBalance } from '../Balance'

describe('Balance', () => {
  it('should return the balance', async () => {
    const providerMock = {
      getBalance: jest.fn().mockResolvedValueOnce('50'),
    } as unknown as Provider
    const result = await getBalance(providerMock, '0x01')
    expect(result).toEqual('50')
  })
})
