import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { requestPolygonNFTTransfer } from '../../services/transactions'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'
import { OwnedNFT, ownedNFTs } from '../../services/blockchain'
import { Animated } from 'react-native'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'

type useSendDestNFTProps = {
  address: string
  close: () => void
}
export default function useSendDestNFT({ address, close }: useSendDestNFTProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const { isLoading: isSendLoading, setIsLoading: setIsSendLoading } = useLoading()
  const { isLoading: isNFTLoading, setIsLoading: setIsNFTLoading } = useLoading()
  const [nfts, setNFTs] = useState<OwnedNFT[]>([])
  const [selectedNFT, setSelectedNFT] = useState(0)
  const [checkedIsSapphireInternalTX, setCheckedIsSapphireInternalTX] = useState<boolean>(true)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)

  useEffect(() => {
    const getNFTs = async () => {
      return await ownedNFTs(address, BRIDGE_NETWORKS.AMOY)
    }
    setIsNFTLoading(true)
    getNFTs()
      .then((nfts) => {
        setNFTs(nfts)
      })
      .catch((err) => setNFTs([]))
      .finally(() => setIsNFTLoading(false))
  }, [ethersProvider])

  const sendBridgeTransaction = async () => {
    setIsSendLoading(true)
    const signer = await getSigner(await getPrivateKey('Sign transaction to bridge NFT'), currentNetwork)

    const selectedNFTObj = nfts[selectedNFT]

    try {
      console.log(
        'Sending bridge transaction',
        address,
        valueAddress,
        selectedNFTObj.tokenId,
        signer,
        currentNetwork,
        BRIDGE_NETWORKS.AMOY,
        checkedIsSapphireInternalTX
      )
      await requestPolygonNFTTransfer(
        address,
        valueAddress,
        selectedNFTObj.tokenId,
        signer,
        currentNetwork,
        BRIDGE_NETWORKS.AMOY,
        checkedIsSapphireInternalTX
      )
      setIsSendLoading(false)
      close()
      Toast.show({
        type: 'success',
        text1: 'Transaction sent! 🚀',
      })
    } catch (e: any) {
      setIsSendLoading(false)
      close()
      Toast.show({
        type: 'error',
        text1: 'Transaction failed! 😢',
        text2: e.message,
      })
    }
  }

  const QRCodeFinishedScanning = (data: string) => {
    setValueAddress(data)
    setIsQRCodeScanning(false)
  }

  return {
    isSendLoading,
    isNFTLoading,
    sendBridgeTransaction,
    nfts,
    selectedNFT,
    setSelectedNFT,
    checkedIsSapphireInternalTX,
    setCheckedIsSapphireInternalTX,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
  }
}
