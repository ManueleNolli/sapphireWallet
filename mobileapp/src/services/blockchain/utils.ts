import { NETWORKS } from '../../constants/Networks'
import { JsonRpcProvider } from 'ethers'
import { BACKEND_ADDRESS } from '@env'

export function getProvider(network: NETWORKS) {
  if (network === NETWORKS.LOCALHOST) {
    return new JsonRpcProvider(`http://${BACKEND_ADDRESS}:8545`)
  } else if (network === NETWORKS.SEPOLIA) {
    throw new Error('Not implemented')
  }
}
