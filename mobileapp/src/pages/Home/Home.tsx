import React, { useRef } from 'react'
import {
  Layout,
  Text,
  StyleService,
  useStyleSheet,
  Modal, useTheme,
} from '@ui-kitten/components'
import {
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View, RefreshControl,
} from 'react-native'
import { ImageBackground } from 'expo-image'
import { appStyles, vh, vw } from '../../Styles'
import { BlurView } from 'expo-blur'
import { formatBlockchainAddress } from '../../utils/formatBlockchainData'
import useHome from './useHome'
import { qrCode, sendETH, sendNFTs } from '../../assets/AssetsRegistry'
import Receive from '../../components/Receive/Receive'
import SendETH from '../../components/SendETH/SendETH'
import SendNFT from '../../components/SendNFT/SendNFT'

export default function Home() {
  const {
    backgroundImage,
    balance,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
    modalReceiveBackdrop,
    isSendETHModalVisible,
    setIsSendETHModalVisible,
    closeSendETHModal,
    modalSendBackdrop,
    isSendNFTModalVisible,
    setIsSendNFTModalVisible,
    modalSendNFTBackdrop,
    closeSendNFTModal,
    onRefresh,
    isRefreshing
  } = useHome()
  const styles = useStyleSheet(themedStyles)
  const theme = useTheme();

  // DATA
  const buttonData = [
    {
      id: 1,
      title: 'Receive',
      description:
        'Receive ETH or NFT by showing a QR code of your wallet address',
      image: qrCode,
      action: () => {
        setIsReceiveModalVisible(true)
      },
    },
    {
      id: 2,
      title: 'Send ETH',
      description: 'Send ETH to another wallet address',
      image: sendETH,
      action: () => {
        setIsSendETHModalVisible(true)
      },
    },
    {
      id: 3,
      title: 'Send NFTs',
      description: 'Send NFTs to another wallet address',
      image: sendNFTs,
      action: () => {
        setIsSendNFTModalVisible(true)
      },
    },
  ]

  // SCROLL ANIMATION
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

  // BUTTON

  const RenderButton = ({
    title,
    description,
    image,
    action,
  }: {
    title: string
    description: string
    image: any
    action: () => void
  }) => (
    <TouchableOpacity onPress={action} style={styles.buttonContainer}>
      <View
        style={{
          paddingVertical: 1 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        <Image
          source={image}
          style={{
            width: 10 * vh,
            height: 10 * vh,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          marginLeft: 2 * vw,
          paddingVertical: 1 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        <Text category={'h6'}>{title}</Text>
        <Text category={'label'}>{description}</Text>
      </View>
    </TouchableOpacity>
  )

  // MODAL

  const ModalReceive = () => {
    return (
      <Modal
        animationType={'fade'}
        visible={isReceiveModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={modalReceiveBackdrop}
      >
        <Receive address={getWalletContractAddress()} />
      </Modal>
    )
  }

  const ModalSendETH = () => {
    return (
      <Modal
        animationType={'fade'}
        visible={isSendETHModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={modalSendBackdrop}
      >
        <SendETH
          close={closeSendETHModal}
          address={getWalletContractAddress()}
          balance={Number.parseFloat(balance)}
        />
      </Modal>
    )
  }

  const ModalSendNFT = () => {
    return (
      <Modal
        animationType={'fade'}
        visible={isSendNFTModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={modalSendNFTBackdrop}
      >
        <SendNFT
          address={getWalletContractAddress()}
          close={closeSendNFTModal}
        />
      </Modal>
    )
  }

  return (
    <Layout style={{ flex: 1 }}>
      <ModalReceive />
      <ModalSendETH />
      <ModalSendNFT />
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
        <ScrollView contentContainerStyle={appStyles.center} style={{ width:'100%'}}
                    refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme['color-primary-100'],theme['color-primary-500'],theme['color-primary-900']]}
          progressBackgroundColor={'white'}
                          progressViewOffset={8 * vh}
          /> }>

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
      </ScrollView>

        </ImageBackground>

        <View style={styles.addressContainer}>
          <TouchableWithoutFeedback
            onPress={copyAddressToClipboard}
            style={{ flex: 1, backgroundColor:'red' }}
          >
            <BlurView style={appStyles.center} intensity={100}>
              <Text category="label">
                {formatBlockchainAddress(getWalletContractAddress())}
              </Text>
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>

      <ScrollView onScroll={onScroll} showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View style={{ height: 64 * vh }} />

        {buttonData.map((item) => (
          <RenderButton
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            action={item.action}
          />
        ))}
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
    backgroundColor:'black',
    shadowOffset: {
      width: 10,
      height: 10,
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
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonContainer: {
    width: 90 * vw,
    margin: 5 * vw,
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'color-primary-400',
    paddingHorizontal: 2 * vw,
    paddingVertical: 1 * vw,
  },
  modalBackdrop: {
    backgroundColor: 'color-basic-transparent-600',
  },
})
