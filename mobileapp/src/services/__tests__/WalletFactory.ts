import { requestContractWallet } from '../WalletFactory'

describe('requestContractWallet', () => {
  beforeEach(() => {
    const jsonMock = jest
      .fn()
      .mockResolvedValue({ eoaAddress: 'mockedAddress' })
    const fetchMock = jest.fn().mockResolvedValue({
      json: jsonMock,
    })
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should send a POST request to the correct endpoint with the provided data', async () => {
    const eoaAddress = 'testEOAAddress'

    const result = await requestContractWallet(eoaAddress)

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}/create-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eoaAddress, network: 'localhost' }),
      }
    )

    expect(result).toEqual({ eoaAddress: 'mockedAddress' })
  })

  it('should handle errors and return a default value', async () => {
    const eoaAddress = 'testEOAAddress'

    // Mocking a rejected response (error)
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Mocked error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const result = await requestContractWallet(eoaAddress)

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}/create-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eoaAddress, network: 'localhost' }),
      }
    )

    expect(result).toEqual({ eoaAddress: 'error' })
    expect(consoleSpy).toHaveBeenCalledWith('error', new Error('Mocked error'))
  })
})
