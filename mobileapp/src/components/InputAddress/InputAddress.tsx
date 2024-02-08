import { Image, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect } from 'react'
import { Input } from '@ui-kitten/components'
import { qrCodeSmall } from '../../assets/AssetsRegistry'
import { isAddress } from 'ethers'

type InputAddressProps = {
  value: string
  setValue: (value: string) => void
  isValid: boolean
  setIsValid: (isValid: boolean) => void
  setIsQRCodeScanning: (isQRCodeScanning: boolean) => void
}

export default function InputAddress({
  value,
  setValue,
  isValid,
  setIsValid,
  setIsQRCodeScanning,
}: InputAddressProps) {
  useEffect(() => {
    isAddress(value) ? setIsValid(true) : setIsValid(false)
  }, [value])

  const QrCodeIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback
      testID={'qr-code-icon'}
      onPress={() => {
        setIsQRCodeScanning(true)
      }}
    >
      <Image {...props} source={qrCodeSmall} />
    </TouchableWithoutFeedback>
  )

  const status = () => {
    if (isValid) {
      return 'success'
    } else if (value.length > 0) {
      return 'danger'
    }
    return 'basic'
  }

  return (
    <Input
      value={value}
      label="To"
      placeholder="Address"
      status={status()}
      accessoryRight={QrCodeIcon}
      onChangeText={(nextValue: string) => setValue(nextValue)}
    />
  )
}
