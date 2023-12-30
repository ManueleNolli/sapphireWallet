import { NETWORKS } from '../../constants/Networks'
import { JsonRpcProvider, Provider } from 'ethers'
import { BACKEND_ADDRESS } from '@env'

export async function getProvider(network: NETWORKS) {
  let provider = null
  if (network === NETWORKS.LOCALHOST) {
    provider = new JsonRpcProvider(`http://${BACKEND_ADDRESS}:8545`)
  } else if (network === NETWORKS.SEPOLIA) {
    throw new Error('Not implemented')
  } else {
    throw new Error('Unknown network')
  }

  // test connection
  provider.getBlockNumber().catch((error: Error) => {
    console.error('Error connecting to blockchain', error)
    throw error
  })

  return provider
}

export function getNetwork(provider: Provider) {}
