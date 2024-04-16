import React from 'react'
import { Button, Layout, Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useBridgeETHtoMATIC from './useBridgeETHtoMATIC'
import InputAddress from '../InputAddress/InputAddress'
import InputNumeric from '../InputNumeric/InputNumeric'
import { View } from 'react-native'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'

type BridgeETHtoMATICProps = {
  address: string
  balance: number
  close: (needRefresh: boolean) => void
}
export default function BridgeETHtoMATIC({ address, balance, close }: BridgeETHtoMATICProps) {
  const styles = useStyleSheet(themedStyles)
  const { isLoading, sendBridgeTransaction, valueAmount, setValueAmount, isAmountValid, setIsAmountValid } =
    useBridgeETHtoMATIC({
      address,
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

  return (
    <Layout style={styles.container}>
      <Text category={'h6'}>Bridge ETH to MATIC</Text>
      <Text style={{ marginBottom: 2 * vh }}>Fill the form to bridge ETH to MATIC</Text>
      <InputNumeric
        value={valueAmount}
        setValue={setValueAmount}
        isValid={isAmountValid}
        setIsValid={setIsAmountValid}
        maxValue={balance}
        style={{ marginTop: 1 * vh }}
      />
      <Button
        testID="send-button"
        accessoryRight={<LoadingIndicator />}
        style={{ marginTop: 2 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        disabled={!isAmountValid}
        onPress={sendBridgeTransaction}
      >
        Bridge ETH
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
