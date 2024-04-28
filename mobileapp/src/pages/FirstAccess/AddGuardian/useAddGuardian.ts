import { useContext, useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { FirstAccessContext } from '../../../context/FirstAccessContext'
import { AddGuardianProps, MnemonicViewerProps } from '../../../navigation/FirstAccessStack'
import useLoading from '../../../hooks/useLoading'
import { requestContractWallet } from '../../../services/wallet'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'
import { ZeroAddress } from 'ethers'

export default function useAddGuardian(navigation: AddGuardianProps['navigation']) {
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { getEOAAddress, setWalletContractAddress } = useContext(WalletContext)
  const { isLoading, setIsLoading } = useLoading(false)
  const [valueAddress, setValueAddress] = useState<string>('')
  const [isAddressValid, setIsAddressValid] = useState<boolean>(false)
  const [isQRCodeScanning, setIsQRCodeScanning] = useState<boolean>(false)

  const skipGuardian = () => {
    setWalletContractAddress(ZeroAddress).then(toggleFirstAccess)
  }

  const finishFirstAccess = async () => {
    setIsLoading(true)
    try {
      const contractWalletAddress = await requestContractWallet(currentNetwork, getEOAAddress(), valueAddress)
      await setWalletContractAddress(contractWalletAddress.address)

      await toggleFirstAccess()
    } catch (error) {
      console.error(error)
    }
  }

  const QRCodeFinishedScanning = (data: string) => {
    setValueAddress(data)
    setIsQRCodeScanning(false)
  }

  return {
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    finishFirstAccess,
    skipGuardian,
    isLoading,
  }
}
