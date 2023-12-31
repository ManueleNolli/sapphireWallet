import React, { useRef } from 'react'
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { ImageBackground } from 'expo-image'
import { appStyles, vh, vw } from '../../Styles'
import { BlurView } from 'expo-blur'
import { formatBlockchainAddress } from '../../utils/formatBlockchainData'
import useHome from './useHome'

export default function Home({ navigation }: any) {
  const {
    backgroundImage,
    balance,
    getWalletContractAddress,
    copyAddressToClipboard,
  } = useHome()
  const styles = useStyleSheet(themedStyles)

  return (
    <Layout style={{ flex: 1 }}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={backgroundImage}
          contentFit="cover"
          style={styles.imageBackground}
        >
          <View style={styles.balanceContainer}>
            <BlurView intensity={20} style={styles.balanceBlurContainer}>
              <Text style={styles.balanceText} category="h4">
                {balance} ETH
              </Text>
            </BlurView>
          </View>
        </ImageBackground>

        <View style={styles.addressContainer}>
          <TouchableWithoutFeedback
            onPress={copyAddressToClipboard}
            style={{ flex: 1 }}
          >
            <BlurView style={appStyles.center} intensity={100}>
              <Text category="label">
                {formatBlockchainAddress(getWalletContractAddress())}
              </Text>
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View>
        <View
          style={{
            width: '100%',
            height: 1000,
            marginTop: 56 * vh,
            paddingTop: 8 * vh,
          }}
        >
          <Text>Ciao</Text>
        </View>
      </View>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: -20 * vw,
    zIndex: 1,
    height: 60 * vh,
    width: 140 * vw,
  },
  imageBackground: {
    ...appStyles.center,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },

  balanceContainer: {
    width: 50 * vw,
    height: 10 * vh,
    borderRadius: 20,
    overflow: 'hidden',
  },
  balanceBlurContainer: {
    ...appStyles.center,
    flexDirection: 'row',
  },
  balanceText: {
    color: 'white',
  },
  addressContainer: {
    position: 'absolute',
    bottom: -4 * vh,
    left: 50 * vw,
    zIndex: 2,
    width: 40 * vw,
    height: 8 * vh,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'color-primary-400',
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
})
