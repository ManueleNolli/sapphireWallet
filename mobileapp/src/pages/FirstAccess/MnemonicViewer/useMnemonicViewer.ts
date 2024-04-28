import { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { MnemonicViewerProps } from '../../../navigation/FirstAccessStack'

export default function useMnemonicViewer({ navigation, route }: MnemonicViewerProps) {
  const [mnemonic, setMnemonic] = useState<string[]>(route.params.mnemonic)

  const copyMnemonicToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic.join(' '))
  }

  const savedPressed = async () => {
    navigation.push('AddGuardian')
  }

  return {
    mnemonic,
    copyMnemonicToClipboard,
    savedPressed,
  }
}
