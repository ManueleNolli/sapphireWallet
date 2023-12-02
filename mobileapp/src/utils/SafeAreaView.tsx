import React from 'react'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
import { vh, vw } from '../Styles'
import { Layout } from '@ui-kitten/components'

type SafeAreaViewProps = {
  children: React.ReactNode
  style?: any
}

export default function SafeAreaView({ children, style }: SafeAreaViewProps) {
  return (
    <Layout style={{ flex: 1 }}>
      <RNSafeAreaView
        style={[
          {
            flex: 1,
            marginVertical: 5 * vh,
            marginHorizontal: 5 * vw,
          },
          style,
        ]}
      >
        {children}
      </RNSafeAreaView>
    </Layout>
  )
}
