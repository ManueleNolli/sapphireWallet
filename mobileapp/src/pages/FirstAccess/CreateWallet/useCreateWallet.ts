import { CreateWalletProps } from '../../../navigation/FirstAccessStack'
import { createWallet, getMnemonic } from '../../../services/wallet'
import { useContext, useState } from 'react'
import { WalletContext } from '../../../context/WalletContext'
import { NETWORKS } from '../../../constants/Networks'
import { BlockchainContext } from '../../../context/BlockchainContext'
import { IndexPath } from '@ui-kitten/components'

export default function useCreateWallet(
  navigation: CreateWalletProps['navigation']
) {
  const { setPrivateKey, setEOAAddress } = useContext(WalletContext)
  const {currentNetwork, setEthersProvider} = useContext(BlockchainContext)
  const [selectedNetwork, setSelectedNetwork] = useState(new IndexPath(Object.values(NETWORKS).indexOf(currentNetwork)))

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

  const onNetworkSelect = async (index: IndexPath) => {
    await setEthersProvider(Object.values(NETWORKS)[index.row])
    setSelectedNetwork(index)
  }

  return {
    createAndNavigate,
    selectedNetwork,
    onNetworkSelect
  }
}
