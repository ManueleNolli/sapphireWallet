import React from 'react'
import { Button, Layout, Modal, Spinner, Text } from '@ui-kitten/components'
import { RecoverWalletProps } from '../../../navigation/FirstAccessStack'
import SafeAreaView from '../../../utils/SafeAreaView'
import { appStyles, vh } from '../../../Styles'
import QRCodeScanner from '../../../components/QRCodeScanner/QRCodeScanner'
import { useRecoverWallet } from './useRecoverWallet'
import { View } from 'react-native'

export default function RecoverWallet({ route, navigation }: RecoverWalletProps) {
  const { isScannedOpen, closeModal, openModal, onQrCodeScanned, isLoading } = useRecoverWallet({ route, navigation })
  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <Text category="h4" style={{ marginBottom: 2 * vh, textAlign: 'center' }}>
          Recover wallet
        </Text>
        <Text style={{ textAlign: 'center' }}>Scan the QR code of your Guardian to recover your wallet</Text>

        {isLoading ? (
          <View style={appStyles.center}>
            <Spinner
              size="giant"
              status="basic"
              style={{
                marginBottom: 2 * vh,
              }}
            />
          </View>
        ) : (
          <Button appearance="outline" size="giant" onPress={openModal} style={{ marginTop: 6 * vh }}>
            Scan QR code
          </Button>
        )}

        <Modal
          visible={isScannedOpen}
          backdropStyle={{ backgroundColor: 'color-basic-transparent-600' }}
          onBackdropPress={closeModal}
        >
          <QRCodeScanner onQRCodeScanned={onQrCodeScanned} />
        </Modal>
      </SafeAreaView>
    </Layout>
  )
}
