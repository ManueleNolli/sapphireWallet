import { HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { BACKEND_ADDRESS } from '@env'
import { getProvider } from '../blockchain/'

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

export function getSigner(privateKey: string, network: NETWORKS) {
  let provider = getProvider(network)
  return new Wallet(privateKey, provider)
}
