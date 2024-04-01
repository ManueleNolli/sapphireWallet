import React from 'react'
import { Button, Layout, Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useSendCrypto from './useSendCrypto'
import InputAddress from '../InputAddress/InputAddress'
import InputNumeric from '../InputNumeric/InputNumeric'
import { View } from 'react-native'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'
import { Balance } from '../../types/Balance'
import { formatEther, Signer } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { executeTransactionResponse } from '../../services/backend'

type SendCryptoProps = {
  address: string
  balance: Balance
  action: (
    walletAddress: string,
    to: string,
    value: number,
    signer: Signer,
    network: NETWORKS
  ) => Promise<executeTransactionResponse>
  close: (needRefresh: boolean) => void
}
export default function SendCrypto({ address, balance, action, close }: SendCryptoProps) {
  const styles = useStyleSheet(themedStyles)
  const {
    isLoading,
    sendCryptoTransaction,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    valueAmount,
    setValueAmount,
    isAmountValid,
    setIsAmountValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
  } = useSendCrypto({
    address,
    cryptoName: balance.crypto,
    action,
    close,
  })

  const LoadingIndicator = (props: any) => {
    return (
      isLoading && (
        <View style={[props.style, styles.indicator]}>
          <Spinner size="tiny" />
        </View>
      )
    )
  }

  if (isQRCodeScanning) return <QRCodeScanner onQRCodeScanned={QRCodeFinishedScanning} />

  return (
    <Layout style={styles.container}>
      <Text category={'h6'}>Send {balance.crypto}</Text>
      <Text style={{ marginBottom: 2 * vh }}>Fill the form to send {balance.crypto} to another wallet</Text>
      <InputAddress
        value={valueAddress}
        setValue={setValueAddress}
        isValid={isAddressValid}
        setIsValid={setIsAddressValid}
        setIsQRCodeScanning={setIsQRCodeScanning}
      />
      <InputNumeric
        value={valueAmount}
        setValue={setValueAmount}
        isValid={isAmountValid}
        setIsValid={setIsAmountValid}
        maxValue={Number.parseFloat(formatEther(BigInt(balance.balance)))}
        style={{ marginTop: 1 * vh }}
      />
      <Button
        testID="send-button"
        accessoryRight={<LoadingIndicator />}
        style={{ marginTop: 2 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        disabled={!(isAddressValid && isAmountValid)}
        onPress={sendCryptoTransaction}
      >
        Send balance.crypto
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
  indicator: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
  },
})
