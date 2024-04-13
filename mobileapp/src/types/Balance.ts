import { NETWORKS } from '../constants/Networks'
import { BRIDGE_NETWORKS } from '../constants/BridgeNetworks'

export type Balance = {
  chainID: string
  balance: string
  crypto: string
}
export type Balances = {
  [key: string]: Balance
}

export type BalancesNFT = {
  [key in NETWORKS | BRIDGE_NETWORKS]: number
}
