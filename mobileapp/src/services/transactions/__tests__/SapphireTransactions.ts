import {
  prepareERC721TransferTransaction,
  prepareETHTransferTransaction,
  requestERC721TokenTransfer,
  requestETHTransfer,
  signTransaction,
  wrapInMultiCall,
} from '../SapphireTransactions'
import {
  ArgentModule,
  ArgentModule__factory,
  ERC721,
  SapphireNFTs__factory,
} from '../../../contracts'
import { generateNonceForRelay, signOffChain } from '../TransactionUtils'
import { contactBackend } from '../../backend'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('../TransactionUtils')
jest.mock('../../backend')

describe('TransactionUtils', () => {
  describe('prepareERC721transferTransaction', () => {
    it('should return a transactionArgent', async () => {
      const mockERC721Contract = {
        'safeTransferFrom(address,address,uint256)': {
          populateTransaction: jest.fn().mockResolvedValue({
            data: '0x1234567890123456789',
          }),
        },
        getAddress: jest.fn().mockResolvedValue('0xAAAAAAAAAA'),
      } as any as ERC721

      const transactionArgent = await prepareERC721TransferTransaction(
        mockERC721Contract,
        '0x1234567890',
        '0x1234567890',
        1
      )

      expect(transactionArgent).toEqual({
        to: '0xAAAAAAAAAA',
        value: 0n,
        data: '0x1234567890123456789',
      })
    })
  })

  describe('prepareETHTransferTransaction', () => {
    it('should return a transactionArgent', async () => {
      const transactionArgent = await prepareETHTransferTransaction(
        '0x1234567890',
        1
      )

      expect(transactionArgent).toEqual({
        to: '0x1234567890',
        value: 1000000000000000000n,
        data: '0x',
      })
    })
  })

  describe('wrapInMultiCall', () => {
    it('should return a transactionArgent', async () => {
      const mockArgentModule = {
        interface: {
          encodeFunctionData: jest
            .fn()
            .mockReturnValue('0x1234567890123456789'),
        },
      } as any as ArgentModule

      const transactionArgent = wrapInMultiCall(
        mockArgentModule,
        '0x1234567890',
        [
          {
            to: '0xAAAAAAAAAA',
            value: 0n,
            data: '0x1234567890123456789',
          },
        ]
      )

      expect(transactionArgent).toEqual('0x1234567890123456789')
    })
  })

  describe('signTransaction', () => {
    it('should return a signed transaction', async () => {
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const unsignedTransaction = '0x1234567890'
      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const signedTransaction = await signTransaction(
        unsignedTransaction,
        mockSigner as any,
        '0x1234567890'
      )

      expect(signedTransaction).toEqual({
        signedTransaction: '0x9876543210',
        nonce: '0x1234567890',
      })
    })

    it('should throw if no provider', async () => {
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const unsignedTransaction = '0x1234567890'
      const mockSigner = {}

      await expect(
        signTransaction(unsignedTransaction, mockSigner as any, '0x1234567890')
      ).rejects.toThrow('No provider, probably a connection error')
    })
  })

  describe('requestERC721TokenTransfer', () => {
    it('should call backend', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        hash: 'backendResponse',
      })
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const argentModuleMock = {
        interface: {
          encodeFunctionData: jest
            .fn()
            .mockReturnValue('ArgentModuleMockedEncodeFunctionData'),
        },
      }

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any)

      const mockSapphireNFTs = {
        transferERC721: jest.fn().mockResolvedValue('0x1234567890'),
        'safeTransferFrom(address,address,uint256)': {
          populateTransaction: jest.fn().mockResolvedValue({
            data: '0x1234567890123456789',
          }),
        },
        getAddress: jest.fn().mockResolvedValue('0xAAAAAAAAAA'),
      }

      jest
        .spyOn(SapphireNFTs__factory, 'connect')
        .mockReturnValue(mockSapphireNFTs as any)

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const result = await requestERC721TokenTransfer(
        'walletAddress',
        'to',
        0,
        mockSigner as any,
        NETWORKS.SEPOLIA
      )

      expect(result).toEqual({
        hash: 'backendResponse',
      })
    })

    it('should throw if backend response with an error', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        error: 'Failed to relay transaction',
      })

      const argentModuleMock = {
        interface: {
          encodeFunctionData: jest
            .fn()
            .mockReturnValue('ArgentModuleMockedEncodeFunctionData'),
        },
      }

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any)

      const mockSapphireNFTs = {
        transferERC721: jest.fn().mockResolvedValue('0x1234567890'),
        'safeTransferFrom(address,address,uint256)': {
          populateTransaction: jest.fn().mockResolvedValue({
            data: '0x1234567890123456789',
          }),
        },
        getAddress: jest.fn().mockResolvedValue('0xAAAAAAAAAA'),
      }

      jest
        .spyOn(SapphireNFTs__factory, 'connect')
        .mockReturnValue(mockSapphireNFTs as any)

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      await expect(
        requestERC721TokenTransfer(
          'walletAddress',
          'to',
          0,
          mockSigner as any,
          NETWORKS.SEPOLIA
        )
      ).rejects.toThrow('Failed to relay transaction')
    })
  })

  describe('requestETHTransfer', () => {
    it('should call backend', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        hash: 'backendResponse',
      })
      ;(generateNonceForRelay as jest.Mock).mockReturnValue('0x1234567890')
      ;(signOffChain as jest.Mock).mockResolvedValue('0x9876543210')

      const argentModuleMock = {
        interface: {
          encodeFunctionData: jest
            .fn()
            .mockReturnValue('ArgentModuleMockedEncodeFunctionData'),
        },
      }

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any)

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      const result = await requestETHTransfer(
        'walletAddress',
        'to',
        0.5,
        mockSigner as any,
        NETWORKS.SEPOLIA
      )

      expect(result).toEqual({
        hash: 'backendResponse',
      })
    })

    it('should throw if backend response with an error', async () => {
      ;(contactBackend as jest.Mock).mockResolvedValue({
        error: 'Failed to relay transaction',
      })

      const argentModuleMock = {
        interface: {
          encodeFunctionData: jest
            .fn()
            .mockReturnValue('ArgentModuleMockedEncodeFunctionData'),
        },
      }

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any)

      const mockSigner = {
        provider: {
          getNetwork: jest.fn().mockResolvedValue({
            chainId: 1,
          }),
        },
      }

      await expect(
        requestETHTransfer(
          'walletAddress',
          'to',
          0.5,
          mockSigner as any,
          NETWORKS.SEPOLIA
        )
      ).rejects.toThrow('Failed to relay transaction')
    })
  })
})
