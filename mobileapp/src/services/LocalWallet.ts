import { HDNodeWallet, Wallet } from 'ethers'

/**
 * Service used to manage local wallet
 */

export function createWallet() {
  return Wallet.createRandom()
}

export function getMnemonic(wallet: HDNodeWallet) {
  const mnemonic = wallet.mnemonic?.phrase
  if (!mnemonic) {
    throw new Error('Mnemonic not found')
  }
  return mnemonic.split(' ')
}
