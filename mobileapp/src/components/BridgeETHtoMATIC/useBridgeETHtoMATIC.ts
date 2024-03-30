import { useContext, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { requestETHBridgeCall, requestETHTransfer } from '../../services/transactions'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'

type useBridgeETHtoMATICProps = {
  address: string
  close: (needRefresh: boolean) => void
}
export default function useBridgeETHtoMATIC({ address, close }: useBridgeETHtoMATICProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading } = useLoading()
  const [valueAmount, setValueAmount] = useState<string>('')
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false)

  const sendBridgeTransaction = async () => {
    setIsLoading(true)
    const value = Number.parseFloat(valueAmount)
    const signer = await getSigner(await getPrivateKey('Sign transaction to bridge ETH to MATIC'), currentNetwork)

    try {
      await requestETHBridgeCall(address, address, value, signer, currentNetwork)
      setIsLoading(false)
      close(true)
      Toast.show({
        type: 'success',
        text1: 'Transaction sent! 🚀',
      })
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Transaction failed! 😢',
        text2: e.message,
      })
      setIsLoading(false)
      close(false)
    }
  }

  return {
    isLoading,
    sendBridgeTransaction,
    valueAmount,
    setValueAmount,
    isAmountValid,
    setIsAmountValid,
  }
}
