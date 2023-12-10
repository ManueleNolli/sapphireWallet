import { createWallet, getMnemonic, getSigner } from '../LocalWallet'
import { JsonRpcProvider, Wallet } from 'ethers'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('ethers')

describe('LocalWallet', () => {
  describe('createWallet', () => {
    it('should call Wallet.createRandom', () => {
      ;(Wallet.createRandom as jest.Mock).mockReturnValueOnce({})

      createWallet()
      expect(Wallet.createRandom).toHaveBeenCalled()
    })

    it('should get mnemonic from wallet', () => {
      ;(Wallet.createRandom as jest.Mock).mockReturnValueOnce({
        mnemonic: {
          phrase: 'a b c d e f g h i j',
        },
      })

      const wallet = createWallet()
      const mnemonic = getMnemonic(wallet)
      expect(mnemonic).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
      ])
    })

    it('should throw if mnemonic are null', () => {
      ;(Wallet.createRandom as jest.Mock).mockReturnValueOnce({})

      const wallet = createWallet()
      try {
        getMnemonic(wallet)

        // This line should not be reached
        expect(true).toEqual(false)
      } catch (e: any) {
        expect(e.message).toEqual('Mnemonic not found')
      }
    })
  })

  describe('getSigner', () => {
    it('should return localhost provider', () => {
      const privatekey = '0x1234567890'
      const network = NETWORKS.LOCALHOST

      getSigner(privatekey, network)

      expect(JsonRpcProvider).toHaveBeenCalled()
      expect(Wallet).toHaveBeenCalledWith(
        privatekey,
        expect.any(JsonRpcProvider)
      )
    })

    it('should return localhost provider', () => {
      const privatekey = '0x1234567890'
      const network = NETWORKS.SEPOLIA

      expect(() => getSigner(privatekey, network)).toThrow('Not implemented')
    })
  })
})
