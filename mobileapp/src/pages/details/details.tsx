import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native'
import { Button, Divider, Layout, Text, useTheme } from '@ui-kitten/components'
import { ThemeContext } from '../../context/themeContext'

export const DetailsScreen = ({ navigation }: any) => {
  const theme = useTheme()
  const { toggleTheme } = useContext(ThemeContext)

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
