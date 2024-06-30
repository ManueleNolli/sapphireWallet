import { requestContractWallet } from '../WalletFactory'
import { contactBackend } from '../../backend'

jest.mock('../../backend', () => ({
  ...jest.requireActual('../../backend'),
  contactBackend: jest.fn(),
}))

describe('requestContractWallet', () => {
  it('should return the correct value', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({
      eoaAddress: 'mockedAddress',
      network: 'mockedNetwork',
    })
    const eoaAddress = 'testEOAAddress'

    const result = await requestContractWallet(eoaAddress)

    expect(result).toEqual({
      eoaAddress: 'mockedAddress',
      network: 'mockedNetwork',
    })
  })

  it('should throw an error if the backend returns an error', async () => {
    ;(contactBackend as jest.Mock).mockResolvedValue({
      error: 'mockedError',
    })
    const eoaAddress = 'testEOAAddress'

    await expect(requestContractWallet(eoaAddress)).rejects.toThrow(
      'mockedError'
    )
  })
})
