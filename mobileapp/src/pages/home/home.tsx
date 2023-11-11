import React from 'react'
import { StyleSheet } from 'react-native'
import {
  Button,
  Divider,
  Icon,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components'

export const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme()

  const navigateDetails = () => {
    navigation.navigate('Details')
  }

  return (
    <Layout style={{ flex: 1 }}>
      <Divider />
      <Layout style={styles.container}>
        <Icon
          name="bulb-outline"
          style={{
            width: 32,
            height: 32,
            tintColor: theme['color-primary-100'],
          }}
        />
        <Text>Open up App.tsx to start working on your app!</Text>
        <Button onPress={navigateDetails}>OPEN DETAILS</Button>
      </Layout>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
