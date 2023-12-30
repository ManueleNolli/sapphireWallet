import React, { useMemo, useRef, useState } from 'react'
import {
  Button,
  Layout,
  Text,
  StyleService,
  useStyleSheet,
} from '@ui-kitten/components'
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { homeBackground } from '../../assets/AssetsRegistry'
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

  const scrollViewRef = useRef<ScrollView>(null)
  const [heightImageContainer, setHeightImageContainer] = useState(60 * vh)

  const imageContainerStyle = useMemo(() => {
    return [styles.imageContainer, { height: heightImageContainer }]
  }, [heightImageContainer, styles.imageContainer])

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.y
    //cast to int to avoid type error

    console.log('offset')
    // if (offset > 0) {
    // navigation.setOptions({
    //   headerTransparent: false,
    // })
    // }
    // cast to number to avoid type error

    setHeightImageContainer(60 * vh - offset)
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={1} // Adjust the throttle value as needed
      >
        <View style={imageContainerStyle}>
          <ImageBackground
            source={backgroundImage}
            contentFit={'cover'}
            style={appStyles.center}
          >
            <View style={styles.balanceContainer}>
              <BlurView intensity={20} style={styles.balanceBlurContainer}>
                <Text style={styles.balanceText} category="h4">
                  {balance} ETH
                </Text>
              </BlurView>
            </View>
          </ImageBackground>
        </View>
        <View>
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

          <View
            style={{
              width: '100%',
              height: 400,
              marginTop: 4 * vh,
            }}
          ></View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  imageContainer: {
    left: '-20%',
    width: '140%',
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
    width: 40 * vw,
    height: 8 * vh,
    position: 'absolute',
    top: -4 * vh,
    left: 30 * vw,
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
