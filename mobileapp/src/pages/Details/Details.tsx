import React, { useContext } from 'react'
import { Button, Divider, Layout, Text, useTheme } from '@ui-kitten/components'
import { ThemeContext } from '../../context/ThemeContext'
import SafeAreaView from '../../utils/SafeAreaView'

export default function Details() {
  const theme = useTheme()
  const { toggleTheme } = useContext(ThemeContext)

  return (
    <SafeAreaView>
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text category="h1" style={{ color: theme['color-primary-500'] }}>
          DETAILS
        </Text>

        <Button onPress={toggleTheme}>Toggle theme</Button>
      </Layout>
    </SafeAreaView>
  )
}
