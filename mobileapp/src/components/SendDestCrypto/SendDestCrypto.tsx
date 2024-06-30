import React from 'react'
import { Button, CheckBox, Layout, Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useSendDestCrypto from './useSendDestCrypto'
import InputAddress from '../InputAddress/InputAddress'
import InputNumeric from '../InputNumeric/InputNumeric'
import { View } from 'react-native'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'
import { Signer } from 'ethers'
import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import { executeTransactionResponse } from '../../services/backend'

type SendDestCryptoProps = {
  address: string
  cryptoName: string
  balance: number
  action: (
    walletAddress: string,
    to: string,
    value: number,
    signer: Signer,
    network: NETWORKS,
    destinationNetwork: BRIDGE_NETWORKS,
    internalSapphireTX: boolean
  ) => Promise<executeTransactionResponse>
  close: (needRefresh: boolean) => void
}
export default function SendDestCrypto({ address, cryptoName, balance, action, close }: SendDestCryptoProps) {
  const styles = useStyleSheet(themedStyles)
  const {
    isLoading,
    sendDestCryptoTransaction,
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
    checkedIsSapphireInternalTX,
    setCheckedIsSapphireInternalTX,
  } = useSendDestCrypto({
    address,
    cryptoName,
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
      <Text category="h6">Send {cryptoName}</Text>
      <Text style={{ marginBottom: 2 * vh }}>Fill the form to send {cryptoName} to another wallet</Text>
      <InputAddress
        label={"to"}
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
        maxValue={balance}
        style={{ marginTop: 1 * vh }}
      />
      <CheckBox
        testID="checkbox-button"
        status="danger"
        checked={checkedIsSapphireInternalTX}
        onChange={(nextChecked) => setCheckedIsSapphireInternalTX(nextChecked)}
        style={styles.checkbox}
      >
        {(evaProps) => (
          <Text category="label" style={{ marginLeft: 2 * vw }} status="danger">
            Receiver is a Sapphire wallet
          </Text>
        )}
      </CheckBox>
      <Button
        testID="send-button"
        accessoryRight={<LoadingIndicator />}
        style={{ marginTop: 2 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        disabled={!(isAddressValid && isAmountValid)}
        onPress={sendDestCryptoTransaction}
      >
        {`Send ${cryptoName}`}
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
  checkbox: {
    alignSelf: 'flex-start',
    marginTop: 2 * vh,
  },
})
