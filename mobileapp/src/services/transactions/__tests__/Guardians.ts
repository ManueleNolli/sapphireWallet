import { ArgentModule__factory } from '../../../contracts'
import { addGuardian, getGuardians, removeGuardian } from '../Guardians'
import { NETWORKS } from '../../../constants/Networks'
import { contactBackend } from '../../backend'
import { generateNonceForRelay, signOffChain } from '../TransactionUtils'

jest.mock('../../backend')
jest.mock('../TransactionUtils')

describe('SapphireTransactions', () => {
  let argentModuleMock: any

  beforeEach(() => {
    jest.clearAllMocks()
    argentModuleMock = {
      encodeFunctionData: jest.fn().mockReturnValue('ArgentModuleMockedEncodeFunctionData'),
    }

    jest.spyOn(ArgentModule__factory, 'createInterface').mockReturnValue(argentModuleMock as any)
  })

  describe('getGuardians', () => {
    it('should call getGuardians with the right arguments', async () => {
      const argentModuleMock = {
        getGuardians: jest.fn().mockResolvedValue('getGuardiansMocked'),
      }

      jest.spyOn(ArgentModule__factory, 'connect').mockReturnValue(argentModuleMock as any)

      const results = await getGuardians('providerMock', NETWORKS.LOCALHOST, 'addressMock')

      expect(results).toEqual('getGuardiansMocked')
      expect(ArgentModule__factory.connect).toHaveBeenCalledTimes(1)
    })
  })

  describe('addGuardians', () => {
    it('should call backend', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        hash: 'backendResponse',
      })
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const result = await addGuardian(mockSigner as any, NETWORKS.LOCALHOST, 'walletAddress', 'guardian')

      expect(result).toEqual({
        hash: 'backendResponse',
      })
    })

    it('should throw if backend response with an error', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        error: 'Failed to relay transaction',
      })

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      await expect(addGuardian(mockSigner as any, NETWORKS.LOCALHOST, 'walletAddress', 'guardian')).rejects.toThrow(
        'Failed to relay transaction'
      )
    })
  })

  describe('removeGuardians', () => {
    it('should call backend', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        hash: 'backendResponse',
      })
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const result = await removeGuardian(mockSigner as any, NETWORKS.LOCALHOST, 'walletAddress', 'guardian')

      expect(result).toEqual({
        hash: 'backendResponse',
      })
    })

    it('should throw if backend response with an error', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        error: 'Failed to relay transaction',
      })

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      await expect(removeGuardian(mockSigner as any, NETWORKS.LOCALHOST, 'walletAddress', 'guardian')).rejects.toThrow(
        'Failed to relay transaction'
      )
    })
  })
})
