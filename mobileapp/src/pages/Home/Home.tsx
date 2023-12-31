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

  {
    /* SCROLL ANIMATION */
  }
  const scrollY = useRef(new Animated.Value(0)).current

  const scrollThreshold = 30 * vh

  const imageContainerTranslateY = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [0, -scrollThreshold],
    extrapolate: 'clamp',
  })

  const balanceContainerTranslateY = scrollY.interpolate({
    inputRange: [0, scrollThreshold],
    outputRange: [0, scrollThreshold / 2 + 2 * vh],
    extrapolate: 'clamp',
  })

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )

  return (
    <Layout style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ translateY: imageContainerTranslateY }],
          },
        ]}
      >
        <ImageBackground
          source={backgroundImage}
          contentFit="cover"
          style={styles.imageBackground}
        >
          <Animated.View
            style={[
              styles.balanceContainer,
              {
                transform: [{ translateY: balanceContainerTranslateY }],
              },
            ]}
          >
            <BlurView intensity={20} style={styles.balanceBlurContainer}>
              <Text style={styles.balanceText} category="h4">
                {balance} ETH
              </Text>
            </BlurView>
          </Animated.View>
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
      </Animated.View>
      <ScrollView style={{ paddingTop: 64 * vh }} onScroll={onScroll}>
        <View>
          <View
            style={{
              width: '100%',
              height: 1500,
            }}
          >
            <Text>Ciao</Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  imageContainer: {
    position: 'absolute',
    zIndex: 1,
    left: -20 * vw,
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
