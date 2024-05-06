import React from 'react'

import { Button, Layout, Text } from '@ui-kitten/components'
import useMnemonicViewerRecoverWallet from './useMnemonicViewerRecoverWallet'
import SafeAreaView from '../../../utils/SafeAreaView'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { appStyles, vh, vw } from '../../../Styles'
import { logo } from '../../../assets/AssetsRegistry'
import { FlashList } from '@shopify/flash-list'
import { MnemonicViewerRecoverWalletProps } from '../../../navigation/FirstAccessStack'
import Loading from '../../Loading/Loading'

export default function MnemonicViewerRecoverWallet({ route }: MnemonicViewerRecoverWalletProps) {
  const { mnemonic, copyMnemonicToClipboard, saveMnemonic, isLoading } = useMnemonicViewerRecoverWallet(route)

  const MnemonicBox = (word: string) => {
    return (
      <Layout level="4" style={styles.mnemonicBox}>
        <Text category="s1">{word}</Text>
      </Layout>
    )
  }

  if (isLoading) {
    return <Loading text="Recovering smart contract wallet..." />
  }

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Image style={appStyles.imageContain} source={logo} />
        </View>
        <View
          style={{
            justifyContent: 'center',
            marginVertical: 2 * vh,
          }}
        >
          <Text category="h6" style={{ textAlign: 'justify' }}>
            Those 12 words are the only way to recover your local wallet
          </Text>
        </View>
        <TouchableOpacity onPress={copyMnemonicToClipboard} style={{ flex: 2 }}>
          <FlashList
            data={mnemonic}
            renderItem={({ item }) => MnemonicBox(item)}
            numColumns={2}
            estimatedItemSize={12}
          />
        </TouchableOpacity>
        <View>
          <Button appearance="outline" onPress={saveMnemonic}>
            I saved these words
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  mnemonicBox: {
    width: 40 * vw,
    marginLeft: 2.5 * vw,
    marginTop: 2 * vh,
    height: 5 * vh,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
})
