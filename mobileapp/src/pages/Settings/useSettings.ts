import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { FirstAccessContext } from '../../context/FirstAccessContext'
import { Icon } from '@ui-kitten/components'
import { ImageProps } from 'react-native'
import { BlockchainContext } from '../../context/BlockchainContext'
import { NETWORKS } from '../../constants/Networks'

export default function useSettings() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { toggleFirstAccess } = useContext(FirstAccessContext)
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
    setSelectedIndex(index)
    await setEthersProvider(Object.values(NETWORKS)[index])
  }

  return {
    theme,
    toggleFirstAccess,
    toggleThemeWithAnimation,
    themeIconRef,
    selectedIndex,
    onNetworkSelect,
  }
}
