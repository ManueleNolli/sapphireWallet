import { Layout, Text } from '@ui-kitten/components'
import { appStyles, vw } from '../../Styles'
import React from 'react'
import { Image } from 'expo-image'
import { attention } from '../../assets/AssetsRegistry'
import { StyleSheet } from 'react-native'

type ErrorProps = {
  text?: string
}
export default function Error({ text }: ErrorProps) {
  return (
    <Layout style={appStyles.center}>
      <Image style={styles.image} source={attention} />
      {text && <Text category="h6">{text}</Text>}
    </Layout>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 50 * vw,
    height: 50 * vw,
    maxWidth: 250,
    maxHeight: 250,
  },
})
