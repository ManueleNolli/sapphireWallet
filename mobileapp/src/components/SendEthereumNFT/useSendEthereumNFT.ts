import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { requestERC721TokenTransfer } from '../../services/transactions'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'
import { OwnedNFT, ownedNFTs } from '../../services/blockchain'

type useSendNFTProps = {
  address: string
  close: () => void
}
export default function useSendEthereumNFT({ address, close }: useSendNFTProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const { isLoading: isSendLoading, setIsLoading: setIsSendLoading } = useLoading()
  const { isLoading: isNFTLoading, setIsLoading: setIsNFTLoading } = useLoading()
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [nfts, setNFTs] = useState<OwnedNFT[]>([])
  const [selectedNFT, setSelectedNFT] = useState(0)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  useEffect(() => {
    const getNFTs = async () => {
      let nfts = await ownedNFTs(address, currentNetwork)

      return nfts
    }
    setIsNFTLoading(true)
    getNFTs()
      .then((nfts) => {
        setNFTs(nfts)
      })
      .catch((err) => setNFTs([]))
      .finally(() => setIsNFTLoading(false))
  }, [ethersProvider])

  const sendNFTTransaction = async () => {
    setIsSendLoading(true)
    const signer = await getSigner(await getPrivateKey('Sign transaction to send ETH'), currentNetwork)

    const selectedNFTObj = nfts[selectedNFT]

    try {
      await requestERC721TokenTransfer(address, valueAddress, selectedNFTObj.tokenId, signer, currentNetwork)
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
    sendNFTTransaction,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    nfts,
    selectedNFT,
    setSelectedNFT,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
  }
}
