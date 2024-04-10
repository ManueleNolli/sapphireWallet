import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getBalance } from '../../services/balances'
import { formatEther } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import { homeBackground } from '../../assets/AssetsRegistry'
import useLoading from '../../hooks/useLoading'
import { Balances } from '../../types/Balance'

export default function useHome() {
  const { ethersProvider, currentNetwork } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const [balances, setBalances] = useState<Balances | null>(null)
  const [backgroundImage] = useState(homeBackground())
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState<boolean>(false)
  const [isSendETHModalVisible, setIsSendETHModalVisible] = useState<boolean>(false)
  const [isSendMATICModalVisible, setIsSendMATICModalVisible] = useState<boolean>(false)
  const [isBridgeETHtoMATICModalVisible, setIsBridgeETHtoMATICModalVisible] = useState<boolean>(false)
  const [isSendNFTModalVisible, setIsSendNFTModalVisible] = useState<boolean>(false)
  const { isLoading: isRefreshing, setIsLoading: setRefreshing } = useLoading(false)
  const { isLoading: isBalanceLoading, setIsLoading: setBalanceLoading } = useLoading(true)

  const onRefresh = async () => {
    setRefreshing(true)
    setBalanceLoading(true)
    await getBalances()
    setBalanceLoading(false)
    setRefreshing(false)
  }

  const getBalances = async () => {
    const balanceBackend = await getBalance(getWalletContractAddress(), currentNetwork)
    console.log('balanceBackend', balanceBackend)
    // convert balance to ETH
    Object.keys(balanceBackend).forEach((key) => {
      balanceBackend[key].balance = formatEther(balanceBackend[key].balance)
    })
    setBalances(balanceBackend)
  }

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(getWalletContractAddress())
  }

  const closeModal = (needRefresh: boolean, setIsModalVisible: (value: boolean) => void) => {
    setIsModalVisible(false)
    if (needRefresh) getBalances()
  }

  useEffect(() => {
    getBalances().then(() => setBalanceLoading(false))
  }, [ethersProvider])

  return {
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
    modalReceiveBackdrop: () => setIsReceiveModalVisible(false),
    modalSendETHBackdrop: () => setIsSendETHModalVisible(false),
    modalSendMATICBackdrop: () => setIsSendMATICModalVisible(false),
    modalSendNFTBackdrop: () => setIsSendNFTModalVisible(false),
    modalBridgeETHtoMATICBackdrop: () => setIsBridgeETHtoMATICModalVisible(false),
    closeSendETHModal: (needRefresh: boolean) => closeModal(needRefresh, setIsSendETHModalVisible),
    closeBridgeETHtoMATICModal: (needRefresh: boolean) => closeModal(needRefresh, setIsBridgeETHtoMATICModalVisible),
    closeSendMATICModal: (needRefresh: boolean) => closeModal(needRefresh, setIsSendMATICModalVisible),
    closeSendNFTModal: () => closeModal(false, setIsSendNFTModalVisible),
  }
}
