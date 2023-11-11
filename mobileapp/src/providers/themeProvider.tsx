import React, { useEffect, useState } from 'react'
import { ThemeContext } from '../context/themeContext'
import * as eva from '@eva-design/eva'
import { default as theme } from '../../assets/theme/theme.json'
import { ApplicationProvider } from '@ui-kitten/components'
import { getData, storeData } from '../../storage/asyncStorageWrap'

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeColor, setThemeColor] = useState('light')

  useEffect(() => {
    const initializeTheme = async () => {
      const theme = await getData('theme')
      if (!theme) {
        storeData('theme', 'light')
        setThemeColor('light')
      } else {
        setThemeColor(theme)
      }
    }

    initializeTheme()
  }, [])

  const toggleTheme = () => {
    const nextTheme = themeColor === 'light' ? 'dark' : 'light'
    storeData('theme', nextTheme)
    setThemeColor(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme: themeColor, toggleTheme }}>
      <ApplicationProvider
        {...eva}
        theme={{
          ...(themeColor === 'light' ? eva.light : eva.dark),
          ...theme,
        }}
      >
        {children}
      </ApplicationProvider>
    </ThemeContext.Provider>
  )
}
