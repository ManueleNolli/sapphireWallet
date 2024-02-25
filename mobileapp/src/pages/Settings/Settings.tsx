import React, { useContext } from 'react'
import {
  Button,
  Divider,
  Icon,
  IconElement,
  Radio,
  RadioGroup,
  Text,
} from '@ui-kitten/components'
import SafeAreaView from '../../utils/SafeAreaView'
import { vh } from '../../Styles'
import useSettings from './useSettings'
import { NETWORKS } from '../../constants/Networks'
import {
  requestERC721TokenTransfer,
  requestETHBridgeCall,
} from '../../services/transactions'
import Toast from 'react-native-toast-message'
import { WalletContext } from '../../context/WalletContext'
import { getSigner } from '../../services/wallet'
import { BlockchainContext } from '../../context/BlockchainContext'

export default function Settings() {
  const {
    theme,
    resetLocalWallet,
    toggleThemeWithAnimation,
    themeIconRef,
    selectedIndex,
    onNetworkSelect,
  } = useSettings()

  const { getWalletContractAddress, getPrivateKey } = useContext(WalletContext)
  const { currentNetwork } = useContext(BlockchainContext)

  const ThemeIcon = (props: any): IconElement => (
    <Icon
      {...props}
      name={theme === 'light' ? 'moon' : 'sun'}
      animation="zoom"
      ref={themeIconRef}
    />
  )

  const DeleteIcon = (props: any): IconElement => (
    <Icon {...props} name="alert-triangle" />
  )

  const networkUppercase = (network: string) =>
    network.charAt(0).toUpperCase() + network.slice(1)

  const temp = async () => {
    try {
      await requestETHBridgeCall(
        getWalletContractAddress(),
        getWalletContractAddress(),
        0.02,
        await getSigner(
          await getPrivateKey('Sign transaction to send ETH'),
          currentNetwork
        ),
        currentNetwork
      )
    } catch (e: any) {
      console.log('catched erorr', e)
    }
  }

  return (
    <SafeAreaView style={{ paddingTop: 5 * vh }}>
      <Text category="h6">Network</Text>
      <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
      <RadioGroup selectedIndex={selectedIndex} onChange={onNetworkSelect}>
        {Object.values(NETWORKS).map((network, index) => (
          <Radio key={index}>
            <Text category="s1">{networkUppercase(network)}</Text>
          </Radio>
        ))}
      </RadioGroup>

      <Text category="h6" style={{ marginTop: 10 * vh }}>
        Customisation
      </Text>
      <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
      <Button
        style={{ width: 10 * vh, height: 10 * vh }}
        onPress={toggleThemeWithAnimation}
        accessoryLeft={ThemeIcon}
      />

      <Text category="h6" style={{ marginTop: 10 * vh }}>
        Dev settings
      </Text>
      <Divider style={{ marginTop: 0.5 * vh, marginBottom: 2 * vh }} />
      <Button
        appearance="outline"
        status="danger"
        accessoryLeft={DeleteIcon}
        onPress={resetLocalWallet}
      >
        Reset local wallet
      </Button>

      <Button status="danger" onPress={temp}>
        Temp
      </Button>
    </SafeAreaView>
  )
}
