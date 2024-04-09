import React, { useRef } from 'react'
import { Layout, Text, StyleService, useStyleSheet, Modal, useTheme, Spinner } from '@ui-kitten/components'
import {
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  RefreshControl,
} from 'react-native'
import { ImageBackground } from 'expo-image'
import { appStyles, vh, vw } from '../../Styles'
import { BlurView } from 'expo-blur'
import { formatBlockchainAddress } from '../../utils/formatBlockchainData'
import useHome from './useHome'
import { bridgeETHtoMATIC, qrCode, sendETH, sendMATIC, sendNFTs } from '../../assets/AssetsRegistry'
import Receive from '../../components/Receive/Receive'
import SendETH from '../../components/SendETH/SendETH'
import SendNFT from '../../components/SendNFT/SendNFT'
import BridgeETHtoMATIC from '../../components/BridgeETHtoMATIC/BridgeETHtoMATIC'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import SendDestCrypto from '../../components/SendDestCrypto/SendDestCrypto'
import { requestMATICTransfer } from '../../services/transactions'

export default function Home() {
  const {
    currentNetwork,
    backgroundImage,
    balances,
    isBalanceLoading,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
    isSendETHModalVisible,
    setIsSendETHModalVisible,
    isSendMATICModalVisible,
    setIsSendMATICModalVisible,
    isSendNFTModalVisible,
    setIsSendNFTModalVisible,
    isBridgeETHtoMATICModalVisible,
    setIsBridgeETHtoMATICModalVisible,
    onRefresh,
    isRefreshing,
    modalReceiveBackdrop,
    modalSendETHBackdrop,
    modalSendMATICBackdrop,
    modalSendNFTBackdrop,
    modalBridgeETHtoMATICBackdrop,
    closeSendETHModal,
    closeBridgeETHtoMATICModal,
    closeSendMATICModal,
    closeSendNFTModal,
  } = useHome()
  const styles = useStyleSheet(themedStyles)
  const theme = useTheme()

  // DATA
  const buttonData = [
    {
      id: 1,
      title: 'Receive',
      description: 'Receive ETH or NFT by showing a QR code of your wallet address',
      image: qrCode,
      action: () => {
        setIsReceiveModalVisible(true)
      },
      visible: true,
      modal: () => (
        <Modal
          animationType="fade"
          visible={isReceiveModalVisible}
          backdropStyle={styles.modalBackdrop}
          onBackdropPress={modalReceiveBackdrop}
        >
          <Receive address={getWalletContractAddress()} />
        </Modal>
      ),
    },
    {
      id: 2,
      title: 'Send ETH',
      description: 'Send ETH to another wallet address',
      image: sendETH,
      action: () => {
        setIsSendETHModalVisible(true)
      },
      visible: balances?.[currentNetwork] && Number.parseFloat(balances[currentNetwork].balance) > 0,
      modal: () =>
        balances && (
          <Modal
            animationType="fade"
            visible={isSendETHModalVisible}
            backdropStyle={styles.modalBackdrop}
            onBackdropPress={modalSendETHBackdrop}
          >
            <SendETH
              close={closeSendETHModal}
              address={getWalletContractAddress()}
              balance={Number.parseFloat(balances[currentNetwork].balance)}
            />
          </Modal>
        ),
    },
    {
      id: 3,
      title: 'Bridge ETH to MATIC',
      description: 'Bridge ETH to your wrapped wallet account in the Polygon network',
      image: bridgeETHtoMATIC,
      action: () => {
        setIsBridgeETHtoMATICModalVisible(true)
      },
      visible: balances?.[currentNetwork] && Number.parseFloat(balances[currentNetwork].balance) > 0,
      modal: () =>
        balances && (
          <Modal
            animationType="fade"
            visible={isBridgeETHtoMATICModalVisible}
            backdropStyle={styles.modalBackdrop}
            onBackdropPress={modalBridgeETHtoMATICBackdrop}
          >
            <BridgeETHtoMATIC
              close={closeBridgeETHtoMATICModal}
              address={getWalletContractAddress()}
              balance={Number.parseFloat(balances[currentNetwork].balance)}
            />
          </Modal>
        ),
    },
    {
      id: 4,
      title: 'Send MATIC',
      description: 'Send MATIC to another wallet address',
      image: sendMATIC,
      action: () => {
        setIsSendMATICModalVisible(true)
      },
      visible: balances?.[BRIDGE_NETWORKS.MUMBAI] && Number.parseFloat(balances[BRIDGE_NETWORKS.MUMBAI].balance) > 0,
      modal: () =>
        balances && (
          <Modal
            animationType="fade"
            visible={isSendMATICModalVisible}
            backdropStyle={styles.modalBackdrop}
            onBackdropPress={modalSendMATICBackdrop}
          >
            <SendDestCrypto
              action={requestMATICTransfer}
              close={closeSendMATICModal}
              cryptoName={balances[BRIDGE_NETWORKS.MUMBAI].crypto}
              address={getWalletContractAddress()}
              balance={Number.parseFloat(balances[BRIDGE_NETWORKS.MUMBAI].balance)}
            />
          </Modal>
        ),
    },
    {
      id: 5,
      title: 'Send NFTs',
      description: 'Send NFTs to another wallet address',
      image: sendNFTs,
      action: () => {
        setIsSendNFTModalVisible(true)
      },
      visible: true,
      modal: () => (
        <Modal
          animationType="fade"
          visible={isSendNFTModalVisible}
          backdropStyle={styles.modalBackdrop}
          onBackdropPress={modalSendNFTBackdrop}
        >
          <SendNFT address={getWalletContractAddress()} close={closeSendNFTModal} />
        </Modal>
      ),
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

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })

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
        <Text category="h6">{title}</Text>
        <Text category="label">{description}</Text>
      </View>
    </TouchableOpacity>
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
        <ImageBackground source={backgroundImage} contentFit="cover" style={styles.imageBackground}>
          <ScrollView
            contentContainerStyle={appStyles.center}
            style={{ width: '100%' }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme['color-primary-100'], theme['color-primary-500'], theme['color-primary-900']]}
                progressBackgroundColor="white"
                progressViewOffset={8 * vh}
              />
            }
          >
            <Animated.View
              style={[
                styles.balanceContainer,
                {
                  height: 8 * vh * Object.keys(balances ? balances : [1]).length,
                },
                {
                  transform: [{ translateY: balanceContainerTranslateY }],
                },
              ]}
            >
              <BlurView
                intensity={20}
                style={[
                  styles.balanceBlurContainer,
                  {
                    paddingVertical: 1 * vh * Object.keys(balances ? balances : [1, 2]).length,
                  },
                ]}
              >
                {isBalanceLoading ? (
                  <Spinner size="medium" />
                ) : (
                  <ScrollView
                    contentContainerStyle={styles.balanceScrollContainer}
                    showsVerticalScrollIndicator={false}
                  >
                    {balances &&
                      Object.entries(balances).map(([key, value]) => (
                        <Text key={key} style={styles.balanceText} category="h4">
                          {value.balance} {value.crypto}
                        </Text>
                      ))}
                  </ScrollView>
                )}
              </BlurView>
            </Animated.View>
          </ScrollView>
        </ImageBackground>

        <View style={styles.addressContainer}>
          <TouchableWithoutFeedback onPress={copyAddressToClipboard} style={{ flex: 1, backgroundColor: 'red' }}>
            <BlurView style={appStyles.center} intensity={100}>
              <Text category="label">{formatBlockchainAddress(getWalletContractAddress())}</Text>
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>

      <ScrollView onScroll={onScroll} showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        <View style={{ height: 64 * vh }} />

        {buttonData.map((item) => {
          console.log('rendering button', item.title, item.visible)
          return (
            item.visible && (
              <View key={item.id}>
                <item.modal />
                <RenderButton
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  action={item.action}
                />
              </View>
            )
          )
        })}
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
    backgroundColor: 'black',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  balanceContainer: {
    width: 60 * vw,
    maxHeight: 15 * vh,
    borderRadius: 10,
    overflow: 'hidden',
  },
  balanceBlurContainer: {
    ...appStyles.center,
  },
  balanceScrollContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  balanceText: {
    color: 'white',
    marginVertical: 0.5 * vh,
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
