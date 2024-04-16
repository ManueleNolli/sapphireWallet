import React from 'react'
import { Radio, RadioGroup, Select, SelectItem, Text } from '@ui-kitten/components'
import { NETWORKS } from '../../constants/Networks'
import useNetworkSelector from './useNetworkSelector'
import { Image } from 'expo-image'
import { networkLogo } from '../../assets/AssetsRegistry'

type NetworkSelectorProps = {
  onChainChange?: () => void
}

export default function NetworkSelector({ onChainChange }: NetworkSelectorProps) {
  const { selectedNetwork, onNetworkSelect } = useNetworkSelector({ onChainChange })

  const networkUppercase = (network: string) => network.charAt(0).toUpperCase() + network.slice(1)
  function NetworkIcon(network: NETWORKS) {
    return (
      <Image
        contentFit="contain"
        style={{
          width: 32,
          height: 32,
          marginRight: 8,
        }}
        source={networkLogo(network)}
      />
    )
  }

  return (
    <Select
      testID="select"
      label="Network"
      value={networkUppercase(Object.values(NETWORKS)[selectedNetwork.row])}
      selectedIndex={selectedNetwork}
      onSelect={onNetworkSelect}
    >
      {Object.values(NETWORKS).map((network, index) => (
        <SelectItem
          testID={`selectItem-${network}`}
          title={networkUppercase(network)}
          key={index}
          accessoryLeft={() => NetworkIcon(network)}
        />
      ))}
    </Select>
  )
}
