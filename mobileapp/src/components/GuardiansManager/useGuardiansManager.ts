import { useContext, useEffect, useState } from 'react'
import { addGuardian, getGuardians } from '../../services/transactions/'
import { WalletContext } from '../../context/WalletContext'
import { BlockchainContext } from '../../context/BlockchainContext'
import Toast from 'react-native-toast-message'
import { getSigner } from '../../services/wallet'
import useLoading from '../../hooks/useLoading'

export default function useGuardiansManager() {
  const { getWalletContractAddress, getPrivateKey } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const [guardians, setGuardians] = useState<string[]>([])
  const { isLoading: isAdding, setIsLoading: setIsAdding } = useLoading()
  const { isLoading: isSendLoading, setIsLoading: setIsSendLoading } = useLoading()
  const { isLoading: iseFetchingLoading, setIsLoading: setIsFetchingLoading } = useLoading()
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const fetchGuardians = async () => {
    setGuardians(await getGuardians(ethersProvider, currentNetwork, getWalletContractAddress()))
  }

  useEffect(() => {
    setIsFetchingLoading(true)
    fetchGuardians()
    setIsFetchingLoading(false)
  }, [])

  const sendAddGuardian = async () => {
    setIsSendLoading(true)
    const signer = await getSigner(await getPrivateKey('Sign transaction to add a guardian'), currentNetwork)
    try {
      const newGuardian = valueAddress
      setValueAddress('')
      await addGuardian(signer, currentNetwork, getWalletContractAddress(), newGuardian)
      fetchGuardians()
      setIsAdding(false)
      setIsSendLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Guardian Added! 🛡️',
      })
    } catch (e: any) {
      setIsSendLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Transaction failed! 😢',
        text2: e.message,
      })
    }
  }

  const removeGuardian = async (guardian: string) => {}

  const QRCodeFinishedScanning = (data: string) => {
    setValueAddress(data)
    setIsQRCodeScanning(false)
  }

  const closeQRCodeScanner = () => {
    setIsQRCodeScanning(false)
  }

  return {
    guardians,
    iseFetchingLoading,
    isSendLoading,
    isAdding,
    setIsAdding,
    sendAddGuardian,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    closeQRCodeScanner,
  }
}
