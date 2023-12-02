import React, { useContext } from 'react'
import { Text } from '@ui-kitten/components'
import { WalletContext } from '../../context/WalletContext'
import SafeAreaView from '../../utils/SafeAreaView'

export default function Home({ navigation }: any) {
  const { getEOAAddress, getWalletContractAddress } = useContext(WalletContext)

  return (
    <SafeAreaView>
      <Text category={'h1'}>Home</Text>
      <Text category={'h6'}>EOA Address: {getEOAAddress()}</Text>
      <Text category={'h6'}>
        Wallet Contract Address: {getWalletContractAddress()}
      </Text>
    </SafeAreaView>
  )
}
