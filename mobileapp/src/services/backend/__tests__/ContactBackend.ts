import { BACKEND_ENDPOINTS, contactBackend } from '../ContactBackend'
import { NETWORKS } from '../../../constants/Networks'

describe('contactBackend', () => {
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

    const result = await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
      network: NETWORKS.LOCALHOST,
      eoaAddress,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}:3000/${BACKEND_ENDPOINTS.CREATE_WALLET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network: 'Localhost', eoaAddress }),
      }
    )

    expect(result).toEqual({ eoaAddress: 'mockedAddress' })
  })

  it('should handle general error', async () => {
    const eoaAddress = 'testEOAAddress'

    // Mocking a rejected response (error)
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Mocked error'))

    const result = await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
      network: NETWORKS.LOCALHOST,
      eoaAddress,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}:3000/create-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network: 'Localhost', eoaAddress }),
      }
    )

    expect(result).toEqual({ error: 'Mocked error' })
  })

  it('should handle general error without message', async () => {
    const eoaAddress = 'testEOAAddress'

    // Mocking a rejected response (error)
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error())

    const result = await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
      network: NETWORKS.LOCALHOST,
      eoaAddress,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}:3000/create-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network: 'Localhost', eoaAddress }),
      }
    )

    expect(result).toEqual({ error: 'Unknown error' })
  })

  it('should handle backend error', async () => {
    const jsonMock = jest.fn().mockResolvedValue({
      error: 'Mocked error',
      message: 'Mocked message',
      status: 500,
    })
    const fetchMock = jest.fn().mockResolvedValue({
      json: jsonMock,
    })
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const result = await contactBackend(BACKEND_ENDPOINTS.CREATE_WALLET, {
      network: NETWORKS.LOCALHOST,
      eoaAddress: 'testEOAAddress',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `http://${process.env.BACKEND_ADDRESS}:3000/create-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: 'Localhost',
          eoaAddress: 'testEOAAddress',
        }),
      }
    )

    expect(result).toEqual({ error: 'Mocked error: Mocked message' })
  })
})
