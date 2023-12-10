import { CreateWalletProps } from '../../../navigation/FirstAccessStack'
import { createWallet, getMnemonic } from '../../../services/wallet'
import { useContext } from 'react'
import { WalletContext } from '../../../context/WalletContext'

export default function useCreateWallet(
  navigation: CreateWalletProps['navigation']
) {
  const { setPrivateKey, setEOAAddress } = useContext(WalletContext)

  const createAndNavigate = async () => {
    const wallet = createWallet()
    try {
      await Promise.all([
        setEOAAddress(wallet.address),
        setPrivateKey(wallet.privateKey),
      ])

      navigation.push('MnemonicViewer', { mnemonic: getMnemonic(wallet) })
    } catch (errors) {
      console.error(errors)
    }
  }

  return {
    createAndNavigate,
  }
}
