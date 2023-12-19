import { HDNodeWallet, JsonRpcProvider, Wallet } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { BACKEND_ADDRESS } from '@env'

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
  let provider
  if (network === NETWORKS.LOCALHOST) {
    console.log(`http://${BACKEND_ADDRESS}:8545`)
    provider = new JsonRpcProvider(`http://${BACKEND_ADDRESS}:8545`)
  } else if (network === NETWORKS.SEPOLIA) {
    throw new Error('Not implemented')
  }
  return new Wallet(privateKey, provider)
}
