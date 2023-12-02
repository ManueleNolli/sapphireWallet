import React from 'react'

import { Button, Layout } from '@ui-kitten/components'
import { View } from 'react-native'
import { appStyles, vh } from '../../../Styles'
import { Image } from 'expo-image'
import { logoWithFullText } from '../../../assets/AssetsRegistry'
import useCreateWallet from './useCreateWallet'
import SafeAreaView from '../../../utils/SafeAreaView'
import { CreateWalletProps } from '../../../navigation/FirstAccessStack'

export default function CreateWallet({ navigation }: CreateWalletProps) {
  const { createAndNavigate } = useCreateWallet(navigation)

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ marginVertical: 20 * vh }}>
        <View style={{ flex: 1 }}>
          <Image style={appStyles.imageContain} source={logoWithFullText} />
        </View>
        <View style={[{ flex: 1 }, appStyles.centerNoFlex]}>
          <Button
            appearance="outline"
            size={'giant'}
            onPress={createAndNavigate}
          >
            Create wallet
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  )
}
