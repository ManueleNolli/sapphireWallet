import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { requestNFTBridgeCall } from '../../services/transactions'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'
import { OwnedNFT, ownedNFTs } from '../../services/blockchain'

type useSendNFTProps = {
  address: string
  close: () => void
}
export default function useBridgeNFT({ address, close }: useSendNFTProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const { isLoading: isSendLoading, setIsLoading: setIsSendLoading } = useLoading()
  const { isLoading: isNFTLoading, setIsLoading: setIsNFTLoading } = useLoading()
  const [nfts, setNFTs] = useState<OwnedNFT[]>([])
  const [selectedNFT, setSelectedNFT] = useState(0)

  useEffect(() => {
    const getNFTs = async () => {
      return await ownedNFTs(address, currentNetwork)
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
      await requestNFTBridgeCall(address, selectedNFTObj.tokenId, signer, currentNetwork)
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

  return {
    isSendLoading,
    isNFTLoading,
    sendBridgeTransaction,
    nfts,
    selectedNFT,
    setSelectedNFT,
  }
}
