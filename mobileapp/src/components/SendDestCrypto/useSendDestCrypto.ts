import { useContext, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import { getSigner } from '../../services/wallet'
import Toast from 'react-native-toast-message'
import useLoading from '../../hooks/useLoading'
import { Signer } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import { executeTransactionResponse } from '../../services/backend'

type useSendDestCryptoProps = {
  address: string
  cryptoName: string
  action: (
    walletAddress: string,
    to: string,
    value: number,
    signer: Signer,
    network: NETWORKS,
    destinationNetwork: BRIDGE_NETWORKS,
    internalSapphireTX: boolean
  ) => Promise<executeTransactionResponse>
  close: (needRefresh: boolean) => void
}
export default function useSendDestCrypto({ address, cryptoName, action, close }: useSendDestCryptoProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading } = useLoading()
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [valueAmount, setValueAmount] = useState<string>('')
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false)
  const [checkedIsSapphireInternalTX, setCheckedIsSapphireInternalTX] = useState<boolean>(true)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const sendDestCryptoTransaction = async () => {
    setIsLoading(true)
    const value = Number.parseFloat(valueAmount)
    const signer = await getSigner(await getPrivateKey(`Sign transaction to send ${cryptoName}.`), currentNetwork)

    try {
      await action(
        address,
        valueAddress,
        value,
        signer,
        currentNetwork,
        BRIDGE_NETWORKS.AMOY,
        checkedIsSapphireInternalTX
      )
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
    sendDestCryptoTransaction,
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
    checkedIsSapphireInternalTX,
    setCheckedIsSapphireInternalTX,
  }
}
