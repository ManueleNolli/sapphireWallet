import React, { useContext, useEffect } from 'react'
import { Button, Text } from '@ui-kitten/components'
import { WalletContext } from '../../context/WalletContext'
import SafeAreaView from '../../utils/SafeAreaView'
import { getSigner } from '../../services/wallet/'
import {
  requestERC721TokenTransfer,
  requestETHTransfer,
} from '../../services/transactions'
import { NETWORKS } from '../../constants/Networks'
import ethers, { formatEther, JsonRpcProvider } from 'ethers'
import { BACKEND_ADDRESS } from '@env'

export default function Home({ navigation }: any) {
  const { getEOAAddress, getWalletContractAddress } = useContext(WalletContext)
  const { getPrivateKey } = useContext(WalletContext)
  const [oeaBalance, setOeaBalance] = React.useState<string>('')
  const [walletContractBalance, setWalletContractBalance] =
    React.useState<string>('')

  console.log('getWalletContractAddress', getWalletContractAddress())

  const sendTransaction = async () => {
    const response = await requestERC721TokenTransfer(
      getWalletContractAddress(),
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      2,
      getSigner(
        await getPrivateKey('Sign transaction to send NFT'),
        NETWORKS.LOCALHOST
      )
    )

    console.log('responseNFT', response)
  }

  const sendETHTransaction = async () => {
    const response = await requestETHTransfer(
      getWalletContractAddress(),
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      0.5,
      getSigner(
        await getPrivateKey('Sign transaction to send ETH'),
        NETWORKS.LOCALHOST
      )
    )
    console.log('responseETH', response)
  }

  const getBalances = async () => {
    const provider = new JsonRpcProvider(`http://${BACKEND_ADDRESS}:8545`)
    const eoaBalance = await provider.getBalance(getEOAAddress())
    const walletContractBalance = await provider.getBalance(
      getWalletContractAddress()
    )
    setOeaBalance(formatEther(eoaBalance))
    setWalletContractBalance(formatEther(walletContractBalance))
  }

  useEffect(() => {
    getBalances()
  }, [])

  return (
    <SafeAreaView>
      <Text category={'h1'}>Home</Text>
      <Text category={'h6'}>EOA Address</Text>
      <Text>address: {getEOAAddress()}</Text>
      <Text>balance: {oeaBalance}</Text>
      <Text category={'h6'} style={{ marginTop: 20 }}>
        Wallet Contract Address
      </Text>
      <Text>address: {getWalletContractAddress()}</Text>
      <Text>balance: {walletContractBalance}</Text>

      <Button style={{ marginTop: 20 }} onPress={() => sendTransaction()}>
        Transfer NFT
      </Button>

      <Button style={{ marginTop: 20 }} onPress={() => sendETHTransaction()}>
        Transfer ETH
      </Button>
    </SafeAreaView>
  )
}
