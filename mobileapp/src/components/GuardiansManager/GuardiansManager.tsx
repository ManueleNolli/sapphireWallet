import React, { useContext } from 'react'
import { Button, Input, Layout, Modal, StyleService, useStyleSheet } from '@ui-kitten/components'
import useGuardiansManager from './useGuardiansManager'
import InputAddress from '../InputAddress/InputAddress'
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native'
import { vh, vw } from '../../Styles'
import { deleteSmall } from '../../assets/AssetsRegistry'
import { ThemeContext } from '../../context/ThemeContext'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'

export default function GuardiansManager() {
  const {
    guardians,
    isAdding,
    setIsAdding,
    sendAddGuardian,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
  } = useGuardiansManager()
  const { theme } = useContext(ThemeContext)

  const themedStyles = StyleService.create({
    inputDisabled: {
      marginBottom: 1 * vh,
      backgroundColor: theme === 'light' ? 'color-basic-200' : 'color-basic-600',
      borderColor: theme === 'light' ? 'color-basic-600' : 'color-basic-400',
    },
  })
  const styles = useStyleSheet(themedStyles)

  const RemoveIcon = (props: any, guardian: string): React.ReactElement => (
    <TouchableWithoutFeedback
      testID="delete-icon"
      onPress={() => {
        console.log('props', props)
        console.log('guardian', guardian)
      }}
    >
      <Image
        style={{ height: props.style.height, marginHorizontal: props.style.marginHorizontal, width: props.style.width }}
        source={deleteSmall}
      />
    </TouchableWithoutFeedback>
  )

  // if (isQRCodeScanning) return <QRCodeScanner onQRCodeScanned={QRCodeFinishedScanning} />
  if (isQRCodeScanning)
    return (
      <Modal
        visible={isQRCodeScanning}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setIsQRCodeScanning(false)}
      >
        <QRCodeScanner onQRCodeScanned={QRCodeFinishedScanning} />
      </Modal>
    )

  return (
    <View>
      {guardians.map((guardian, index) => (
        <Input
          textStyle={{ fontSize: 1.5 * vh }}
          key={index}
          value={guardian}
          style={styles.inputDisabled}
          disabled
          accessoryRight={(props) => RemoveIcon(props, guardian)}
        />
      ))}

      {isAdding ? (
        <>
          <InputAddress
            label=""
            value={valueAddress}
            setValue={setValueAddress}
            isValid={isAddressValid}
            setIsValid={setIsAddressValid}
            setIsQRCodeScanning={setIsQRCodeScanning}
          />
          <Button testID="save-guardian" onPress={sendAddGuardian} appearance="outline" style={{ marginTop: 1 * vh }}>
            Add guardian
          </Button>
        </>
      ) : (
        <Button testID="add-guardian" onPress={() => setIsAdding(true)} appearance="ghost">
          Add guardians
        </Button>
      )}
    </View>
  )
}
