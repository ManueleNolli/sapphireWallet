import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { FirstAccessContext } from '../../context/FirstAccessContext'
import { Icon } from '@ui-kitten/components'
import { ImageProps } from 'react-native'
import { BlockchainContext } from '../../context/BlockchainContext'
import { NETWORKS } from '../../constants/Networks'
import { WalletContext } from '../../context/WalletContext'

export default function useSettings() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const { resetWallet } = useContext(WalletContext)
  const { currentNetwork, setEthersProvider } = useContext(BlockchainContext)
  const [selectedIndex, setSelectedIndex] = React.useState(
    Object.values(NETWORKS).indexOf(currentNetwork)
  )

  const themeIconRef = React.useRef<Icon<Partial<ImageProps>>>()

  const toggleThemeWithAnimation = () => {
    if (themeIconRef.current) themeIconRef.current.startAnimation()
    toggleTheme()
  }

  const onNetworkSelect = async (index: number) => {
    await setEthersProvider(Object.values(NETWORKS)[index])
    setSelectedIndex(index)
  }

  const resetLocalWallet = async () => {
    await Promise.all(
      [
        resetWallet(),
        toggleFirstAccess()
      ]
    )

  }

  return {
    theme,
    resetLocalWallet,
    toggleThemeWithAnimation,
    themeIconRef,
    selectedIndex,
    onNetworkSelect,
  }
}
