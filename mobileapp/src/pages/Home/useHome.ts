import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getBalance } from '../../services/transactions/Balance'
import { formatEther } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import { homeBackground } from '../../assets/AssetsRegistry'

export default function useHome() {
  const { ethersProvider } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const [balance, setBalance] = useState<string>('')
  const [backgroundImage] = useState(homeBackground())
  const [isReceiveModalVisible, setIsReceiveModalVisible] =
    useState<boolean>(false)
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
    const balance = await getBalance(ethersProvider, getWalletContractAddress())
    setBalance(formatEther(balance))
  }

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(getWalletContractAddress())
  }

  useEffect(() => {
    getBalances()
  }, [])

  return {
    backgroundImage,
    balance,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
  }
}
