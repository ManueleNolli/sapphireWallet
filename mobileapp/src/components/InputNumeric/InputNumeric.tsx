import { Input, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'

type InputAddressProps = {
  value: string
  setValue: (value: string) => void
  isValid: boolean
  setIsValid: (isValid: boolean) => void
  maxValue?: number
  style?: any
}

export default function InputNumeric({
  value,
  setValue,
  isValid,
  setIsValid,
  maxValue,
  style,
}: InputAddressProps) {
  const styles = useStyleSheet(themedStyles)

  useEffect(() => {
    const valueNumber = Number.parseFloat(value)
    setIsValid(valueNumber >= 0 && (!maxValue || valueNumber <= maxValue))
  }, [value, maxValue])

  const renderMaxValueButton = () => {
    if (maxValue) {
      return (
        <TouchableOpacity
          testID="max-value-button"
          onPress={() => setValue(maxValue.toString())}
        >
          <Text style={styles.textMaxValue} category={'label'}>
            Max Value
          </Text>
        </TouchableOpacity>
      )
    }
    return null
  }

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
      testID={'input-numeric'}
      value={value}
      label="Amount"
      placeholder="0"
      style={style}
      keyboardType="numeric"
      status={status()}
      onChangeText={(nextValue: string) => setValue(nextValue)}
      accessoryRight={<>{renderMaxValueButton()}</>}
    />
  )
}

const themedStyles = StyleService.create({
  textMaxValue: {
    color: 'color-primary-500',
  },
})
