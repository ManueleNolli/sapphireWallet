import { Button, Layout, Spinner, StyleService, Text } from '@ui-kitten/components'
import { appStyles, vh, vw } from '../../../Styles'
import React from 'react'
import useRecoverWallet from './useRecoverWallet'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

type RecoverWalletProps = {
  wallet: string
}

export default function RecoverWallet(props: RecoverWalletProps) {
  const { isLoading, prepareTransactionAndShowQrCode, recoverWalletInfo } = useRecoverWallet(props)

  return (
    <Layout style={styles.modalContainer}>
      <Text category="h6" style={{ marginBottom: 2 * vh }}>
        Recover wallet
      </Text>

      {recoverWalletInfo ? (
        <QRCode value={recoverWalletInfo} size={75 * vw} />
      ) : isLoading ? (
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
        <>
          <Text style={{ textAlign: 'center' }}>Are you sure you want to recover wallet</Text>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 2 * vh,
            }}
            category="label"
          >
            {props.wallet}
          </Text>

          <Button testID="button-yen" style={{ width: '50%' }} onPress={prepareTransactionAndShowQrCode}>
            Yes
          </Button>
        </>
      )}
    </Layout>
  )
}

const styles = StyleService.create({
  modalContainer: {
    maxHeight: 75 * vh,
    minHeight: 25 * vh,
    maxWidth: 90 * vw,
    minWidth: 90 * vw,
    borderRadius: 10,
    paddingVertical: 4 * vh,
    paddingHorizontal: 4 * vw,
    alignItems: 'center',
  },
})
