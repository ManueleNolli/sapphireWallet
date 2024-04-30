import { useContext, useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { MnemonicViewerRecoverWalletProps } from '../../../navigation/FirstAccessStack'
import { RecoverWallet } from '../../../types/RecoverWallet'
import { concludeRecoverWallet } from '../../../services/transactions'
import Toast from 'react-native-toast-message'
import { FirstAccessContext } from '../../../context/FirstAccessContext'
import { BlockchainContext } from '../../../context/BlockchainContext'
import useLoading from '../../../hooks/useLoading'

export default function useMnemonicViewerRecoverWallet(route: MnemonicViewerRecoverWalletProps['route']) {
  const [mnemonic, setMnemonic] = useState<string[]>(route.params.mnemonic)
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading } = useLoading(false)

  const copyMnemonicToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic.join(' '))
  }

  const saveMnemonic = async () => {
    setIsLoading(true)
    // contact backend, toggle first access
    const dataParsed = route.params.data as RecoverWallet
    try {
      await concludeRecoverWallet(
        currentNetwork,
        dataParsed.walletAddress,
        dataParsed.wrappedTransaction,
        dataParsed.signedTransaction,
        dataParsed.nonce
      )
      Toast.show({
        type: 'success',
        text1: 'Wallet recovered 🎉',
        text2: 'Your wallet has been successfully recovered',
      })
      await toggleFirstAccess()
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Transaction failed! 😢',
        text2: e.message,
      })
      setIsLoading(false)
    }
  }

  return {
    mnemonic,
    copyMnemonicToClipboard,
    saveMnemonic,
    isLoading,
  }
}
