import React from 'react'

import { Layout, Text } from '@ui-kitten/components'
import { Image } from 'expo-image'

import { logoAnimated } from '../../assets/AssetsRegistry'
import { vw, appStyles } from '../../Styles'
import { StyleSheet } from 'react-native'

type LoadingProps = {
  text?: string
}

export default function Loading({ text }: LoadingProps) {
  return (
    <Layout style={appStyles.center}>
      <Image style={styles.image} source={logoAnimated} />
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
