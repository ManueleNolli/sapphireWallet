import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getBalance as getBalanceBackend } from '../../services/balances/balanceCrypto'
import { formatEther } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import { homeBackground } from '../../assets/AssetsRegistry'
import useLoading from '../../hooks/useLoading'
import { Balance, Balances } from '../../types/Balance'
import { CHAIN_CRYPTOS, NETWORK_TO_CHAIN_IDS } from '../../constants/NetworksMetadata'
import { currentNetwork } from '../../constants/AsyncStoreKeys'

export default function useHome() {
  const { ethersProvider, currentNetwork } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const [balances, setBalances] = useState<Balances | null>(null)
  const [backgroundImage] = useState(homeBackground())
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState<boolean>(false)
  const [isSendETHModalVisible, setIsSendETHModalVisible] = useState<boolean>(false)
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
    const balanceBackend = await getBalanceBackend(getWalletContractAddress(), currentNetwork)
    console.log('aa,', Number.parseFloat(balanceBackend[currentNetwork].balance) > 0)
    setBalances(balanceBackend)
  }

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(getWalletContractAddress())
  }

  const closeSendETHModal = (needRefresh: boolean) => {
    setIsSendETHModalVisible(false)
    if (needRefresh) getBalances()
  }

  const closeBridgeETHtoMATICModal = (needRefresh: boolean) => {
    setIsBridgeETHtoMATICModalVisible(false)
    if (needRefresh) getBalances()
  }

  useEffect(() => {
    getBalances().then(() => setBalanceLoading(false))
  }, [ethersProvider])

  return {
    currentNetwork,
    backgroundImage,
    balances,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
    isSendETHModalVisible,
    setIsSendETHModalVisible,
    closeSendETHModal,
    closeBridgeETHtoMATICModal,
    isSendNFTModalVisible,
    setIsSendNFTModalVisible,
    isBridgeETHtoMATICModalVisible,
    setIsBridgeETHtoMATICModalVisible,
    onRefresh,
    isRefreshing,
    isBalanceLoading,
    modalReceiveBackdrop: () => setIsReceiveModalVisible(false),
    modalSendBackdrop: () => setIsSendETHModalVisible(false),
    modalSendNFTBackdrop: () => setIsSendNFTModalVisible(false),
    closeSendNFTModal: () => setIsSendNFTModalVisible(false),
    modalBridgeETHtoMATICBackdrop: () => setIsBridgeETHtoMATICModalVisible(false),
  }
}
