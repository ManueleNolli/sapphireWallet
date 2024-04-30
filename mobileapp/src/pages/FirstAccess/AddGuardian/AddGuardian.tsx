import React from 'react'

import { Button, Layout, Modal, Text } from '@ui-kitten/components'
import SafeAreaView from '../../../utils/SafeAreaView'
import { StyleSheet, View } from 'react-native'
import { vh, vw } from '../../../Styles'
import { AddGuardianProps } from '../../../navigation/FirstAccessStack'
import Loading from '../../Loading/Loading'
import useAddGuardian from './useAddGuardian'
import InputAddress from '../../../components/InputAddress/InputAddress'
import QRCodeScanner from '../../../components/QRCodeScanner/QRCodeScanner'

export default function AddGuardian({ navigation }: AddGuardianProps) {
  const {
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    closeQRCodeScanner,
    QRCodeFinishedScanning,
    withGuardian,
    skipGuardian,
    isLoading,
  } = useAddGuardian(navigation)

  if (isLoading) {
    return <Loading text="Deploying smart contract wallet..." />
  }

  if (isQRCodeScanning)
    return (
      <Modal
        visible={isQRCodeScanning}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={closeQRCodeScanner}
      >
        <QRCodeScanner onQRCodeScanned={QRCodeFinishedScanning} />
      </Modal>
    )

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, marginVertical: 20 * vh }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 2 * vh,
          }}
        >
          <Text category="h4" style={styles.text}>
            Add a guardian
          </Text>
          <Text category="p1" style={[styles.text, styles.descriptionText]}>
            Guardians are able to recover your wallet if you lose your phone. You can add more guardians later.
          </Text>
        </View>
        <InputAddress
          label=""
          value={valueAddress}
          setValue={setValueAddress}
          isValid={isAddressValid}
          setIsValid={setIsAddressValid}
          setIsQRCodeScanning={setIsQRCodeScanning}
        />
        <View>
          <Button appearance="outline" onPress={withGuardian} style={{ marginVertical: 2 * vh }}>
            Create wallet
          </Button>

          <Button appearance="ghost" onPress={skipGuardian} style={{ width: 25 * vw, alignSelf: 'flex-end' }}>
            Skip
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'justify',
  },
  descriptionText: {
    textAlign: 'center',
    marginVertical: 2 * vh,
  },
})
