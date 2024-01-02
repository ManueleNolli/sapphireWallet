import { NETWORKS } from '../../constants/Networks'
import { AlchemyProvider, JsonRpcProvider } from 'ethers'
import { BACKEND_ADDRESS, SEPOLIA_API_KEY } from '@env'

export async function getProvider(network: NETWORKS) {
  let provider = null
  if (network === NETWORKS.LOCALHOST) {
    provider = new JsonRpcProvider(`http://${BACKEND_ADDRESS}:8545`)
  } else if (network === NETWORKS.SEPOLIA) {
    provider = new AlchemyProvider('sepolia', SEPOLIA_API_KEY)
  } else {
    throw new Error('Unknown network')
  }

  // test connection
  try {
    await provider.getBlockNumber()
  } catch (error) {
    console.error('Error connecting to blockchain')
    throw new Error('Unable to test connection to blockchain')
  }

  return provider
}
