import { NETWORKS } from './Networks'
import { BRIDGE_NETWORKS } from './BridgeNetworks'

const ALL_NETWORKS = { ...NETWORKS, ...BRIDGE_NETWORKS }

type NetworkToChainIds = {
  [key: string]: string
}

export const NETWORK_TO_CHAIN_IDS: NetworkToChainIds = {
  [ALL_NETWORKS.LOCALHOST]: '1337',
  [ALL_NETWORKS.SEPOLIA]: '11155111',
  [ALL_NETWORKS.AMOY]: '80002',
}

type ChainCryptos = {
  [key: string]: string
}

export const CHAIN_CRYPTOS: ChainCryptos = {
  '1337': 'ETH',
  '11155111': 'ETH',
  '80002': 'MATIC',
}
