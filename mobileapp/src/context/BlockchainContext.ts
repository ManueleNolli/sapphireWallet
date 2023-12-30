import { createContext } from 'react'
import { NETWORKS } from '../constants/Networks'

type BlockchainContextType = {
  currentNetwork: NETWORKS
  setCurrentNetwork: (network: NETWORKS) => void
  ethersProvider: any
  setEthersProvider: (network: NETWORKS) => Promise<void>
}

export const BlockchainContext = createContext<BlockchainContextType>(<
  BlockchainContextType
>{
  currentNetwork: NETWORKS.LOCALHOST,
  setCurrentNetwork: (network: NETWORKS): void => {},
  ethersProvider: null,
  setEthersProvider: async (network: NETWORKS): Promise<void> => {},
})
