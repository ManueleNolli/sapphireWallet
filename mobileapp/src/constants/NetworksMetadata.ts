import { NETWORKS } from './Networks'
import { BRIDGE_NETWORKS } from './BridgeNetworks'

const ALL_NETWORKS = { ...NETWORKS, ...BRIDGE_NETWORKS }

type ChainIdsToNetwork = {
  [key: string]: (typeof ALL_NETWORKS)[keyof typeof ALL_NETWORKS]
}

export const CHAIN_IDS_TO_NETWORK: ChainIdsToNetwork = {
  '1337': ALL_NETWORKS.LOCALHOST,
  '11155111': ALL_NETWORKS.SEPOLIA,
  '80001': ALL_NETWORKS.MUMBAI,
}

type NetworkToChainIds = {
  [key: string]: string
}

export const NETWORK_TO_CHAIN_IDS: NetworkToChainIds = {
  [ALL_NETWORKS.LOCALHOST]: '1337',
  [ALL_NETWORKS.SEPOLIA]: '11155111',
  [ALL_NETWORKS.MUMBAI]: '80001',
}

type ChainCryptos = {
  [key: string]: string
}

export const CHAIN_CRYPTOS: ChainCryptos = {
  '1337': 'ETH',
  '11155111': 'ETH',
  '80001': 'MATIC',
}
