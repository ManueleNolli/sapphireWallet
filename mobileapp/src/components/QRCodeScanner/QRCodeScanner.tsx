import React from 'react'
import { Image } from 'react-native'
import { StyleService, useStyleSheet } from '@ui-kitten/components'
import { appStyles, vh, vw } from '../../Styles'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Platform, View } from 'react-native'
import { qrCodeSmall } from '../../assets/AssetsRegistry'
import useQRCodeScanner from './useQRCodeScanner'

type QRCodeScannerProps = {
  onQRCodeScanned: (data: string) => void
}

export default function QRCodeScanner({ onQRCodeScanned }: QRCodeScannerProps) {
  const { scanned, handleBarCodeScanned } = useQRCodeScanner({
    onQRCodeScanned,
  })
  const styles = useStyleSheet(themedStyles)

  const getCameraStyle = () => {
    // if android = 4:3
    if (Platform.OS === 'android') {
      return {
        height: (4 / 3) * 95 * vw,
        width: 95 * vw,
      }
    }

    return {
      height: 90 * vh,
      width: 95 * vw,
    }
  }

  return (
    <View style={[getCameraStyle(), styles.cameraContainer]}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={appStyles.center}
      >
        <Image
          style={{
            height: 60 * vw,
            width: 60 * vw,
            opacity: 0.8,
          }}
          source={qrCodeSmall}
        />
      </BarCodeScanner>
    </View>
  )
}

const themedStyles = StyleService.create({
  cameraContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
})
