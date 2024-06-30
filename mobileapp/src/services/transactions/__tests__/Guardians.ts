import { ArgentModule__factory } from '../../../contracts'
import {
  addGuardian,
  concludeRecoverWallet,
  getGuardians,
  getGuardianWallets,
  prepareRecoverWallet,
  removeGuardian,
} from '../Guardians'
import { NETWORKS } from '../../../constants/Networks'
import { contactBackend } from '../../backend'
import { generateNonceForRelay, signOffChain } from '../TransactionUtils'
import { getMnemonic } from '../../wallet'

jest.mock('../../backend')
jest.mock('../TransactionUtils')
jest.mock('../../wallet')

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

  describe('getGuardianWallets', () => {
    it('should call getGuardianWallets with the right arguments', async () => {
      const argentModuleMock = {
        getGuardianWallets: jest.fn().mockResolvedValue('getGuardianWalletsMocked'),
      }

      jest.spyOn(ArgentModule__factory, 'connect').mockReturnValue(argentModuleMock as any)

      const results = await getGuardianWallets('providerMock', NETWORKS.LOCALHOST, 'addressMock')

      expect(results).toEqual('getGuardianWalletsMocked')
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

  describe('prepareRecoverWallet', () => {
    it('should return correct value', async () => {
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('101')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')
      ;(getMnemonic as jest.Mock).mockReturnValue(['mnemonic', 'mocked', 'mnemonic', 'mocked', 'mnemonic', 'mocked'])

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const newWallet = {
        address: 'newWallet',
      }

      const result = await prepareRecoverWallet(
        mockSigner as any,
        NETWORKS.LOCALHOST,
        'smartWalletToRecover',
        newWallet as any
      )

      expect(result).toEqual({
        walletAddress: 'smartWalletToRecover',
        chainID: '1',
        nonce: '101',
        wrappedTransaction: 'ArgentModuleMockedEncodeFunctionData',
        signedTransaction: '0x9876543210',
        mnemonic: ['mnemonic', 'mocked', 'mnemonic', 'mocked', 'mnemonic', 'mocked'],
      })
    })
  })

  describe('concludeRecoverWallet', () => {
    it('should call backend', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        hash: 'backendResponse',
      })
      const result = await concludeRecoverWallet(
        NETWORKS.LOCALHOST,
        'smartWalletToRecover',
        'transactionData',
        'signedTransaction',
        'nonce'
      )

      expect(result).toEqual({
        hash: 'backendResponse',
      })
    })

    it('should throw if backend response with an error', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        error: 'Failed to conclude transaction',
      })

      await expect(
        concludeRecoverWallet(
          NETWORKS.LOCALHOST,
          'smartWalletToRecover',
          'transactionData',
          'signedTransaction',
          'nonce'
        )
      ).rejects.toThrow('Failed to conclude transaction')
    })
  })
})
