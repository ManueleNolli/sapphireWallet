import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getBalance } from '../../services/transactions/Balance'
import { formatEther } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import { homeBackground } from '../../assets/AssetsRegistry'
import useLoading from '../../hooks/useLoading'

export default function useHome() {
  const { ethersProvider } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const [balance, setBalance] = useState<string>('')
  const [backgroundImage] = useState(homeBackground())
  const [isReceiveModalVisible, setIsReceiveModalVisible] =
    useState<boolean>(false)
  const [isSendETHModalVisible, setIsSendETHModalVisible] =
    useState<boolean>(false)
  const [isSendNFTModalVisible, setIsSendNFTModalVisible] =
    useState<boolean>(false)
  const {isLoading: isRefreshing, setIsLoading : setRefreshing} = useLoading(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await getBalances()
    setRefreshing(false)
  }

  const getBalances = async () => {
    const balance = await getBalance(ethersProvider, getWalletContractAddress())
    setBalance(formatEther(balance))
  }

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(getWalletContractAddress())
  }

  const closeSendETHModal = (needRefresh: boolean) => {
    setIsSendETHModalVisible(false)
    if (needRefresh) getBalances()
  }

  useEffect(() => {
    getBalances()
  }, [ethersProvider])

  return {
    backgroundImage,
    balance,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
    isSendETHModalVisible,
    setIsSendETHModalVisible,
    closeSendETHModal,
    isSendNFTModalVisible,
    setIsSendNFTModalVisible,
    onRefresh,
    isRefreshing,
    modalReceiveBackdrop: () => setIsReceiveModalVisible(false),
    modalSendBackdrop: () => setIsSendETHModalVisible(false),
    modalSendNFTBackdrop: () => setIsSendNFTModalVisible(false),
    closeSendNFTModal: () => setIsSendNFTModalVisible(false)
  }
}
