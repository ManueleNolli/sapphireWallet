import {
  generateMessageHash,
  generateNonceForRelay,
  signMessage,
  signOffChain,
} from '../TransactionUtils'
import { ethers, ZeroAddress } from 'ethers'

// Mocking the Provider
const mockProvider: ethers.JsonRpcProvider = {
  getBlockNumber: jest.fn(),
} as any

describe('TransactionUtils', () => {
  describe('generateNonceForRelay', () => {
    it('should generate a valid nonce', async () => {
      const mockedBlockNumber = 123
      ;(mockProvider.getBlockNumber as jest.Mock).mockResolvedValue(
        mockedBlockNumber
      )

      const mockDate = new Date()
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
      const mockedTimestamp = mockDate.getTime()

      const nonce = await generateNonceForRelay(mockProvider)

      const expectedNonce =
        '0x' +
        ethers.zeroPadValue(ethers.toBeHex(mockedBlockNumber), 16).slice(2) +
        ethers.zeroPadValue(ethers.toBeHex(mockedTimestamp), 16).slice(2)

      expect(nonce).toEqual(expectedNonce)

      expect(mockProvider.getBlockNumber).toHaveBeenCalledTimes(1)

      jest.restoreAllMocks()
    })
  })

  describe('generateMessageHash', () => {
    it('should generate a valid message hash', () => {
      jest.restoreAllMocks()
      const from = ZeroAddress
      const value = 0
      const data = '456'
      const chainId = 123n
      const nonce = '789'
      const gasPrice = 0
      const gasLimit = 1000000
      const refundToken = ZeroAddress
      const refundAddress = ZeroAddress

      const expectedMessage =
        '0x' +
        [
          '0x19',
          '0x00',
          from,
          ethers.zeroPadValue(ethers.toBeHex(value), 32),
          data,
          ethers.zeroPadValue(ethers.toBeHex(chainId), 32),
          nonce,
          ethers.zeroPadValue(ethers.toBeHex(gasPrice), 32),
          ethers.zeroPadValue(ethers.toBeHex(gasLimit), 32),
          refundToken,
          refundAddress,
        ]
          .map((hex) => hex.slice(2))
          .join('')

      const expectedMessageHash = ethers.keccak256(expectedMessage)

      const messageHash = generateMessageHash(
        from,
        value,
        data,
        chainId,
        nonce,
        gasPrice,
        gasLimit,
        refundToken,
        refundAddress
      )

      expect(messageHash).toEqual(expectedMessageHash)
    })
  })

  describe('signMessage', () => {
    it('should sign a message', async () => {
      const message =
        '0x7f4fd3a182c7f389bf1067b73e095dd53f0abde1d2afc5d5baba2eb46bc13759'
      const mockedSignature =
        '0x123456789012345678' + //20
        '90123456789012345678' + //40
        '90123456789012345678' + //60
        '90123456789012345678' + //80
        '90123456789012345678' + //100
        '90123456789012345678' + //120
        '00000000001b' //140, 1B_hex = 27_dec

      const mockSigner = {
        signMessage: jest.fn().mockResolvedValue(mockedSignature),
      } as any

      const signature = await signMessage(message, mockSigner)

      expect(signature).toEqual(mockedSignature)
    })

    it('should throw if signature is not valid', async () => {
      const message =
        '0x7f4fd3a182c7f389bf1067b73e095dd53f0abde1d2afc5d5baba2eb46bc13759'
      const mockedSignature = 'not valid'
      const mockSigner = {
        signMessage: jest.fn().mockResolvedValue(mockedSignature),
      } as any

      await expect(signMessage(message, mockSigner)).rejects.toThrow(
        "Invalid 'v' value in signature. Expected 27 or 28."
      )
    })
  })

  describe('signOffchain', () => {
    it('should sign a transaction offchain', async () => {
      // Mock input parameters
      const data = '456'
      const chainId = 123n
      const nonce = '789'
      const mockedSignature =
        '0x123456789012345678' + //20
        '90123456789012345678' + //40
        '90123456789012345678' + //60
        '90123456789012345678' + //80
        '90123456789012345678' + //100
        '90123456789012345678' + //120
        '00000000001b' //140, 1B_hex = 27_dec

      const mockSigner = {
        signMessage: jest.fn().mockResolvedValue(mockedSignature),
      } as any

      await signOffChain(mockSigner, ZeroAddress, data, chainId, nonce)

      expect(mockSigner.signMessage).toHaveBeenCalledTimes(1)

      jest.restoreAllMocks()
    })
  })
})
