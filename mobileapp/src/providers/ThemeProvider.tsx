import React, { useEffect, useState } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import * as eva from '@eva-design/eva'
import { default as theme } from '../../assets/theme/theme.json'
import { ApplicationProvider } from '@ui-kitten/components'
import { getData, storeData } from '../services/storage/'
import constants from '../constants/Constants'
import useLoading from '../hooks/useLoading'

import Loading from '../pages/Loading/Loading'

type ThemeProviderProps = {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isLoading, setIsLoading } = useLoading(true)
  const [themeColor, setThemeColor] = useState('light')

  useEffect(() => {
    const initializeTheme = async () => {
      const theme = await getData(constants.asyncStoreKeys.theme)
      if (!theme) {
        await storeData(constants.asyncStoreKeys.theme, 'light')
        setThemeColor('light')
      } else {
        setThemeColor(theme)
      }
    }

    initializeTheme().then(() => setIsLoading(false))
  }, [])

  const toggleTheme = async () => {
    const nextTheme = themeColor === 'light' ? 'dark' : 'light'
    await storeData(constants.asyncStoreKeys.theme, nextTheme)
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
        {isLoading ? <Loading text={'Checking preferences...'} /> : children}
      </ApplicationProvider>
    </ThemeContext.Provider>
  )
}
