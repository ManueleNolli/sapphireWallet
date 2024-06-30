import { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { MnemonicViewerNewWalletProps } from '../../../navigation/FirstAccessStack'

export default function useMnemonicViewerNewWallet({ route, navigation }: MnemonicViewerNewWalletProps) {
  const [mnemonic, setMnemonic] = useState<string[]>(route.params.mnemonic)

  const copyMnemonicToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic.join(' '))
  }

  const saveMnemonic = async () => {
    navigation.push('AddGuardian')
  }

  return {
    mnemonic,
    copyMnemonicToClipboard,
    saveMnemonic,
  }
}
