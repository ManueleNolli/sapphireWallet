import React, { useContext, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { NETWORKS } from '../../constants/Networks'
import { IndexPath } from '@ui-kitten/components'

type useNetworkSelectorProps = {
  onChainChange?: () => void
}

export default function useNetworkSelector({ onChainChange }: useNetworkSelectorProps) {
  const { currentNetwork, setEthersProvider } = useContext(BlockchainContext)
  const [selectedNetwork, setSelectedNetwork] = useState(new IndexPath(Object.values(NETWORKS).indexOf(currentNetwork)))
  const onNetworkSelect = async (index: IndexPath | IndexPath[]) => {
    if (Array.isArray(index)) index = index[0]
    await setEthersProvider(Object.values(NETWORKS)[index.row])
    setSelectedNetwork(index)
    if (onChainChange) onChainChange()
  }

  return {
    selectedNetwork,
    onNetworkSelect,
  }
}
