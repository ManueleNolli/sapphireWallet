import { getProvider } from '../utils'
import { NETWORKS } from '../../../constants/Networks'
import { JsonRpcProvider } from 'ethers'

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers')
  return {
    ...actual,
    JsonRpcProvider: jest.fn(() => ({
      getBlockNumber: jest.fn(() => Promise.resolve(12345)), // Replace with your desired block number
    })),
    AlchemyProvider: jest.fn(() => ({
      getBlockNumber: jest.fn(() => Promise.resolve(12345)), // Replace with your desired block number
    })),
  }
})

describe('utils', () => {
  it('Return localhost provider', async () => {
    const result = await getProvider(NETWORKS.LOCALHOST)
    expect(result).not.toBeNull()
  })

  it('Return sepolia provider', async () => {
    const result = await getProvider(NETWORKS.SEPOLIA)
    expect(result).not.toBeNull()
  })

  it('Throw error for unknown network', async () => {
    await expect(getProvider('test' as NETWORKS)).rejects.toThrow()
  })

  it('Throw error for blockchain connection error', async () => {
    ;(JsonRpcProvider as jest.Mock).mockImplementationOnce(() => ({
      getBlockNumber: jest.fn(() => Promise.reject(new Error('test error'))),
    }))
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    await expect(getProvider(NETWORKS.LOCALHOST)).rejects.toThrow()
    expect(spy).toHaveBeenCalledWith('Error connecting to blockchain')
  })
})
