import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getBalance } from '../../services/balances'
import { formatEther } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import { homeBackground } from '../../assets/AssetsRegistry'
import useLoading from '../../hooks/useLoading'
import { Balances, BalancesNFT } from '../../types/Balance'
import { getNFTBalance } from '../../services/balances/balanceNFTs'

export default function useHome() {
  const { ethersProvider, currentNetwork } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const [balances, setBalances] = useState<Balances | null>(null)
  const [balancesNFT, setBalancesNFT] = useState<BalancesNFT | null>(null)
  const [backgroundImage] = useState(homeBackground())
  const [isReceiveModalVisible, setIsReceiveModalVisible] = useState<boolean>(false)
  const [isSendETHModalVisible, setIsSendETHModalVisible] = useState<boolean>(false)
  const [isSendMATICModalVisible, setIsSendMATICModalVisible] = useState<boolean>(false)
  const [isBridgeETHtoMATICModalVisible, setIsBridgeETHtoMATICModalVisible] = useState<boolean>(false)
  const [isSendEthereumNFTModalVisible, setIsSendEthereumNFTModalVisible] = useState<boolean>(false)
  const [isSendPolygonNFTModalVisible, setIsSendPolygonNFTModalVisible] = useState<boolean>(false)
  const [isBridgeNFTModalVisible, setIsBridgeNFTModalVisible] = useState<boolean>(false)
  const { isLoading: isRefreshing, setIsLoading: setRefreshing } = useLoading(false)
  const { isLoading: isBalanceLoading, setIsLoading: setBalanceLoading } = useLoading(true)

  const onRefresh = async () => {
    setRefreshing(true)
    setBalanceLoading(true)
    await getBalances()
    await getBalancesNFT()
    setBalanceLoading(false)
    setRefreshing(false)
  }

  const getBalances = async () => {
    const balanceBackend = await getBalance(getWalletContractAddress(), currentNetwork)
    // convert balance to ETH
    Object.keys(balanceBackend).forEach((key) => {
      balanceBackend[key].balance = formatEther(balanceBackend[key].balance)
    })
    setBalances(balanceBackend)
  }

  const getBalancesNFT = async () => {
    getNFTBalance(getWalletContractAddress(), currentNetwork).then((result) => {
      setBalancesNFT(result)
    })
  }

  const copyAddressToClipboard = async () => {
    await Clipboard.setStringAsync(getWalletContractAddress())
  }

  const closeModal = (needRefresh: boolean, setIsModalVisible: (value: boolean) => void) => {
    setIsModalVisible(false)
    if (needRefresh) onRefresh()
  }

  useEffect(() => {
    getBalances().then(() => setBalanceLoading(false))
    getBalancesNFT()
  }, [ethersProvider])

  return {
    currentNetwork,
    backgroundImage,
    balances,
    balancesNFT,
    isBalanceLoading,
    getWalletContractAddress,
    copyAddressToClipboard,
    isReceiveModalVisible,
    setIsReceiveModalVisible,
    isSendETHModalVisible,
    setIsSendETHModalVisible,
    isSendMATICModalVisible,
    setIsSendMATICModalVisible,
    isSendEthereumNFTModalVisible,
    setIsSendEthereumNFTModalVisible,
    isSendPolygonNFTModalVisible,
    setIsSendPolygonNFTModalVisible,
    isBridgeETHtoMATICModalVisible,
    setIsBridgeETHtoMATICModalVisible,
    isBridgeNFTModalVisible,
    setIsBridgeNFTModalVisible,
    onRefresh,
    isRefreshing,
    modalReceiveBackdrop: () => setIsReceiveModalVisible(false),
    modalSendETHBackdrop: () => setIsSendETHModalVisible(false),
    modalSendMATICBackdrop: () => setIsSendMATICModalVisible(false),
    modalSendEthereumNFTBackdrop: () => setIsSendEthereumNFTModalVisible(false),
    modalSendPolygonNFTBackdrop: () => setIsSendPolygonNFTModalVisible(false),
    modalBridgeETHtoMATICBackdrop: () => setIsBridgeETHtoMATICModalVisible(false),
    modalBridgeNFTBackdrop: () => setIsBridgeNFTModalVisible(false),
    closeSendETHModal: (needRefresh: boolean) => closeModal(needRefresh, setIsSendETHModalVisible),
    closeBridgeETHtoMATICModal: (needRefresh: boolean) => closeModal(needRefresh, setIsBridgeETHtoMATICModalVisible),
    closeBridgeNFTModal: () => closeModal(false, setIsBridgeNFTModalVisible),
    closeSendMATICModal: (needRefresh: boolean) => closeModal(needRefresh, setIsSendMATICModalVisible),
    closeSendEthereumNFTModal: () => closeModal(false, setIsSendEthereumNFTModalVisible),
    closeSendPolygonNFTModal: () => closeModal(false, setIsSendPolygonNFTModalVisible),
  }
}
