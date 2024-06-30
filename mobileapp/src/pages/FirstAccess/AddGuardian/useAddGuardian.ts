import { useContext, useState } from 'react'
import { FirstAccessContext } from '../../../context/FirstAccessContext'
import { AddGuardianProps } from '../../../navigation/FirstAccessStack'
import useLoading from '../../../hooks/useLoading'
import { requestContractWallet } from '../../../services/wallet'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'
import { ZeroAddress } from 'ethers'
import Toast from 'react-native-toast-message'

export default function useAddGuardian(navigation: AddGuardianProps['navigation']) {
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { getEOAAddress, setWalletContractAddress } = useContext(WalletContext)
  const { isLoading, setIsLoading } = useLoading(false)
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const skipGuardian = () => {
    finishFirstAccess(ZeroAddress)
  }

  const withGuardian = () => {
    finishFirstAccess(valueAddress)
  }

  const finishFirstAccess = async (guardian: string) => {
    setIsLoading(true)
    try {
      const contractWalletAddress = await requestContractWallet(currentNetwork, getEOAAddress(), guardian)
      await setWalletContractAddress(contractWalletAddress.address)
      Toast.show({
        type: 'success',
        text1: 'Account created! 👛',
      })
      await toggleFirstAccess()
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Transaction failed! 😢',
        text2: e.message,
      })
      setIsLoading(false)
      navigation.goBack()
    }
  }

  const QRCodeFinishedScanning = (data: string) => {
    setValueAddress(data)
    setIsQRCodeScanning(false)
  }

  const closeQRCodeScanner = () => {
    setIsQRCodeScanning(false)
  }

  return {
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    closeQRCodeScanner,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    skipGuardian,
    withGuardian,
    isLoading,
  }
}
