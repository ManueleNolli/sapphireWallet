import { createWallet, getMnemonic, getSigner } from '../LocalWallet'
import { AlchemyProvider, JsonRpcProvider, Wallet } from 'ethers'
import { NETWORKS } from '../../../constants/Networks'
import { getProvider } from '../../blockchain'

jest.mock('ethers')
jest.mock('../../blockchain')

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
    it('should return localhost provider', async () => {
      ;(getProvider as jest.Mock).mockReturnValueOnce({} as JsonRpcProvider)
      const privatekey = '0x1234567890'
      const network = NETWORKS.LOCALHOST

      await getSigner(privatekey, network)

      expect(Wallet).toHaveBeenCalledWith(privatekey, {})
    })

    it('should return sepolia provider', async () => {
      ;(getProvider as jest.Mock).mockReturnValueOnce({} as AlchemyProvider)

      const privatekey = '0x1234567890'
      const network = NETWORKS.SEPOLIA

      await getSigner(privatekey, network)

      expect(Wallet).toHaveBeenCalledWith(privatekey, {})
    })
  })
})
