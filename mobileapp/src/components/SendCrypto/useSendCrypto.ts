import { useContext, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { requestETHTransfer } from '../../services/transactions'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'
import { Signer } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { executeTransactionResponse } from '../../services/backend'

type useSendCryptoProps = {
  address: string
  cryptoName: string
  action: (
    walletAddress: string,
    to: string,
    value: number,
    signer: Signer,
    network: NETWORKS
  ) => Promise<executeTransactionResponse>
  close: (needRefresh: boolean) => void
}
export default function useSendCrypto({ address, cryptoName, action, close }: useSendCryptoProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading } = useLoading()
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [valueAmount, setValueAmount] = useState<string>('')
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const sendCryptoTransaction = async () => {
    setIsLoading(true)
    const value = Number.parseFloat(valueAmount)
    const signer = await getSigner(await getPrivateKey(`Sign transaction send ${cryptoName}`), currentNetwork)

    try {
      await action(address, valueAddress, value, signer, currentNetwork)
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

  const QRCodeFinishedScanning = (data: string) => {
    setValueAddress(data)
    setIsQRCodeScanning(false)
  }

  return {
    isLoading,
    sendCryptoTransaction,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    valueAmount,
    setValueAmount,
    isAmountValid,
    setIsAmountValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
  }
}
