import { useContext, useState } from 'react'
import { JSONToRecoverWallet, RecoverWallet } from '../../../types/RecoverWallet'
import Toast from 'react-native-toast-message'
import { HDNodeWallet, Mnemonic } from 'ethers'
import useLoading from '../../../hooks/useLoading'
import { WalletContext } from '../../../context/WalletContext'
import { getMnemonic } from '../../../services/wallet'
import { RecoverWalletProps } from '../../../navigation/FirstAccessStack'

export default function useRecoverWallet({ route, navigation }: RecoverWalletProps) {
  const { setPrivateKey, setEOAAddress, setWalletContractAddress } = useContext(WalletContext)
  const [isScannedOpen, setIsScannedOpen] = useState(false)
  const { isLoading, setIsLoading } = useLoading()

  const onQrCodeScanned = async (data: string) => {
    setIsLoading(true)
    closeModal()
    try {
      const dataParsed: RecoverWallet = JSONToRecoverWallet(data)
      const mnemonic = Mnemonic.fromPhrase(dataParsed.mnemonic.join(' '))
      const wallet = HDNodeWallet.fromMnemonic(mnemonic)
      await Promise.all([
        setEOAAddress(wallet.address),
        setPrivateKey(wallet.privateKey),
        setWalletContractAddress(dataParsed.walletAddress),
      ])
      navigation.push('MnemonicViewerRecoverWallet', {
        mnemonic: getMnemonic(wallet),
        data: dataParsed,
      })
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Invalid QR code 🚨',
        text2: 'The QR code you scanned is not valid',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => setIsScannedOpen(false)
  const openModal = () => setIsScannedOpen(true)

  return {
    isScannedOpen,
    closeModal,
    openModal,
    onQrCodeScanned,
    isLoading,
  }
}
