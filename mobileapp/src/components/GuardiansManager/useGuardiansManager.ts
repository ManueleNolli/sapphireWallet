import { useContext, useEffect, useState } from 'react'
import { addGuardian, getGuardians, requestERC721TokenTransfer } from '../../services/transactions/'
import { WalletContext } from '../../context/WalletContext'
import { BlockchainContext } from '../../context/BlockchainContext'
import Toast from 'react-native-toast-message'
import { getSigner } from '../../services/wallet'
import useLoading from '../../hooks/useLoading'

export default function useGuardiansManager() {
  const { getWalletContractAddress, getPrivateKey } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const [guardians, setGuardians] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const { isLoading: isSendLoading, setIsLoading: setIsSendLoading } = useLoading()
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const fetchGuardians = async () => {
    setGuardians(await getGuardians(ethersProvider, currentNetwork, getWalletContractAddress()))
  }

  useEffect(() => {
    fetchGuardians()
  }, [])

  const sendAddGuardian = async () => {
    setIsSendLoading(true)
    const signer = await getSigner(await getPrivateKey('Sign transaction to add a guardian'), currentNetwork)
    try {
      await addGuardian(signer, currentNetwork, getWalletContractAddress(), valueAddress)
      fetchGuardians()
      setIsSendLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Guardian Added! 🛡️',
      })
    } catch (e: any) {
      console.log('error', e)
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

  return {
    guardians,
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
  }
}
