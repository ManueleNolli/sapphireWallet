import React, { useContext, useEffect } from 'react'
import { Button, Layout, Text, useTheme } from '@ui-kitten/components'
import { WalletContext } from '../../context/WalletContext'
import { getSigner } from '../../services/wallet/'
import { NETWORKS } from '../../constants/Networks'
import { formatEther } from 'ethers'
import { View } from 'react-native'
import { ImageBackground } from 'expo-image'
import { homeBackground } from '../../assets/AssetsRegistry'
import { vh, vw } from '../../Styles'
import { BlurView } from 'expo-blur'
import { getBalance } from '../../services/transactions/Balance'
import { getProvider } from '../../services/blockchain/'
import { formatBlockchainAddress } from '../../utils/formatBlockchainData'

export default function Home({ navigation }: any) {
  const theme = useTheme()
  const { getEOAAddress, getWalletContractAddress } = useContext(WalletContext)
  const { getPrivateKey } = useContext(WalletContext)
  const [balance, setBalance] = React.useState<string>('')

  // const sendTransaction = async () => {
  //   const response = await requestERC721TokenTransfer(
  //     getWalletContractAddress(),
  //     '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  //     0,
  //     getSigner(
  //       await getPrivateKey('Sign transaction to send NFT'),
  //       NETWORKS.LOCALHOST
  //     )
  //   )
  //
  //   console.log('responseNFT', response)
  // }
  //
  // const sendETHTransaction = async () => {
  //   const response = await requestETHTransfer(
  //     getWalletContractAddress(),
  //     '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  //     0.5,
  //     getSigner(
  //       await getPrivateKey('Sign transaction to send ETH'),
  //       NETWORKS.LOCALHOST
  //     )
  //   )
  //   console.log('responseETH', response)
  // }

  const getBalances = async () => {
    const provider = getProvider(NETWORKS.LOCALHOST)
    if (!provider) return //FIXME: handle error
    const balance = await getBalance(provider, getWalletContractAddress())
    setBalance(formatEther(balance))
  }

  useEffect(() => {
    getBalances()
  }, [])

  return (
    <Layout style={{ flex: 1 }}>
      <View
        style={{
          flex: 6,
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
        }}
      >
        <ImageBackground
          source={homeBackground}
          contentFit={'cover'}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 50 * vw,
              height: 10 * vh,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={20}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Text style={{ color: 'white' }} category="h4">
                {balance} ETH
              </Text>
            </BlurView>
          </View>
        </ImageBackground>
      </View>
      <View style={{ flex: 4 }}>
        <View
          style={{
            width: 40 * vw,
            height: 8 * vh,
            position: 'absolute',
            top: -4 * vh,
            left: 30 * vw,
            borderRadius: 10,
            overflow: 'hidden',
            borderColor: theme['color-primary-400'],
            borderWidth: 1,
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 15,
          }}
        >
          <BlurView
            intensity={100}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text category="label">
              {formatBlockchainAddress(getWalletContractAddress())}
            </Text>
          </BlurView>
        </View>
      </View>
    </Layout>
  )
}
