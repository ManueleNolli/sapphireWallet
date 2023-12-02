import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { FirstAccessContext } from '../../context/FirstAccessContext'
import { Icon } from '@ui-kitten/components'
import { ImageProps } from 'react-native'

export default function useSettings() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { toggleFirstAccess } = useContext(FirstAccessContext)
  const themeIconRef = React.useRef<Icon<Partial<ImageProps>>>()

  const toggleThemeWithAnimation = () => {
    if (themeIconRef.current) themeIconRef.current.startAnimation()
    toggleTheme()
  }

  return {
    theme,
    toggleFirstAccess,
    toggleThemeWithAnimation,
    themeIconRef,
  }
}
