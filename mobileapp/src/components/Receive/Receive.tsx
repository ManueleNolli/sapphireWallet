import React from 'react'
import { Button, Icon, IconElement, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import QRCode from 'react-native-qrcode-svg'
import { Share } from 'react-native'

type ReceiveProps = {
  address: string
}
export default function Receive({ address }: ReceiveProps) {
  const styles = useStyleSheet(themedStyles)

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Hi! I want to share my Sapphire wallet address with you: ' + address + '.',
      })
    } catch (error: any) {}
  }

  return (
    <Layout style={styles.container}>
      <Text category="h6">Receive</Text>
      <Text style={{ marginBottom: 2 * vh }}>Show this QR code to receive Crypto or NFTs</Text>
      <QRCode value={address} size={75 * vw} />
      <Text style={{ marginTop: 2 * vh }}>Alternatively, share your wallet address:</Text>
      <Button
        testID="share-button"
        style={{ marginTop: 1 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        onPress={onShare}
      >
        Share
      </Button>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  container: {
    paddingVertical: 4 * vh,
    paddingHorizontal: 4 * vw,
    alignItems: 'center',
    borderRadius: 10,
    maxHeight: 75 * vh,
    maxWidth: 90 * vw,
  },
})
