import React from 'react'

import { Button, Select, SelectItem } from '@ui-kitten/components'
import { View } from 'react-native'
import { appStyles, vh } from '../../../Styles'
import { Image } from 'expo-image'
import { logoWithFullText, networkLogo } from '../../../assets/AssetsRegistry'
import useCreateWallet from './useCreateWallet'
import SafeAreaView from '../../../utils/SafeAreaView'
import { CreateWalletProps } from '../../../navigation/FirstAccessStack'
import { NETWORKS } from '../../../constants/Networks'

export default function CreateWallet({ route, navigation }: CreateWalletProps) {
  const { createAndNavigate, selectedNetwork, onNetworkSelect, recoverWallet } = useCreateWallet({ route, navigation })

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
    <SafeAreaView>
      <View style={{ flex: 1, marginTop: 10 * vh }}>
        <Image style={appStyles.imageContain} source={logoWithFullText} />
      </View>
      <View style={[{ flex: 1, marginBottom: 10 * vh }, appStyles.centerNoFlex]}>
        <Button appearance="outline" size="giant" onPress={createAndNavigate}>
          Create wallet
        </Button>
        <Button appearance="ghost" onPress={recoverWallet} style={{ marginTop: 2 * vh }}>
          Recover wallet
        </Button>
      </View>

      <View style={{ bottom: 0 }}>
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
      </View>
    </SafeAreaView>
  )
}
