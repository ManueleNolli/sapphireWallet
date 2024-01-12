import React from 'react'
import {
  Button,
  Layout,
  Spinner,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useSendETH from './useSendETH'
import InputAddress from '../InputAddress/InputAddress'
import InputNumeric from '../InputNumeric/InputNumeric'
import { View } from 'react-native'

type SendETHProps = {
  address: string
  balance: number
  close: (needRefresh: boolean) => void
}
export default function SendETH({ address, balance, close }: SendETHProps) {
  const styles = useStyleSheet(themedStyles)
  const {
    isLoading,
    sendETHTransaction,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    valueAmount,
    setValueAmount,
    isAmountValid,
    setIsAmountValid,
  } = useSendETH({
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
      <Text category={'h6'}>Send ETH</Text>
      <Text style={{ marginBottom: 2 * vh }}>
        Fill the form to send ETH to another wallet
      </Text>
      <InputAddress
        value={valueAddress}
        setValue={setValueAddress}
        isValid={isAddressValid}
        setIsValid={setIsAddressValid}
      />
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
        disabled={!isAddressValid && !isAmountValid}
        onPress={sendETHTransaction}
      >
        Send ETH
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
