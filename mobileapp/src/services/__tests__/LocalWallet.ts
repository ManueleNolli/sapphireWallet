import { createWallet, getMnemonic } from '../LocalWallet'
import { Wallet } from 'ethers'

jest.mock('ethers', () => ({
  HDNodeWallet: jest.fn(),
  Wallet: {
    createRandom: jest.fn(),
  },
}))

describe('createWallet', () => {
  it('should call Wallet.createRandom', () => {
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
    expect(mnemonic).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'])
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
