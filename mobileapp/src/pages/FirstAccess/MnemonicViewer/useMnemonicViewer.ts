import { useContext, useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { FirstAccessContext } from '../../../context/FirstAccessContext'
import { MnemonicViewerProps } from '../../../navigation/FirstAccessStack'
import useLoading from '../../../hooks/useLoading'
import { requestContractWallet } from '../../../services/wallet'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'

export default function useMnemonicViewer(route: MnemonicViewerProps['route']) {
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { getEOAAddress, setWalletContractAddress } = useContext(WalletContext)
  const { isLoading, setIsLoading } = useLoading(false)
  const [mnemonic, setMnemonic] = useState<string[]>(route.params.mnemonic)

  const copyMnemonicToClipboard = async () => {
    await Clipboard.setStringAsync(mnemonic.join(' '))
  }

  const finishFirstAccess = async () => {
    setIsLoading(true)
    try {
      const contractWalletAddress = await requestContractWallet(
        getEOAAddress(),
        currentNetwork
      )
      await setWalletContractAddress(contractWalletAddress.address)

      await toggleFirstAccess()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    mnemonic,
    copyMnemonicToClipboard,
    finishFirstAccess,
    isLoading,
  }
}
