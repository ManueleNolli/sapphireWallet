import { RecoverWallet, RecoverWalletToJSON, JSONToRecoverWallet } from '../RecoverWallet'

describe('RecoverWallet', () => {
  it('should convert RecoverWallet to JSON and back correctly', () => {
    const recoverWallet: RecoverWallet = {
      walletAddress: '0x123',
      chainID: '1',
      nonce: '1',
      wrappedTransaction: '0x456',
      signedTransaction: '0x789',
      mnemonic: ['word1', 'word2', 'word3', 'word4', 'word5', 'word6'],
    }

    const json = RecoverWalletToJSON(recoverWallet)
    const recovered = JSONToRecoverWallet(json)

    expect(recovered).toEqual(recoverWallet)
  })

  it('should throw error for invalid JSON', () => {
    const invalidJson = '{ walletAddress: 0x123'

    expect(() => JSONToRecoverWallet(invalidJson)).toThrow()
  })
})
