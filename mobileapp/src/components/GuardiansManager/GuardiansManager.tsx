import React, { useContext } from 'react'
import { Button, Input, Modal, Spinner, StyleService, useStyleSheet } from '@ui-kitten/components'
import useGuardiansManager from './useGuardiansManager'
import InputAddress from '../InputAddress/InputAddress'
import { View, TouchableWithoutFeedback, Image } from 'react-native'
import { appStyles, vh } from '../../Styles'
import { deleteSmall } from '../../assets/AssetsRegistry'
import { ThemeContext } from '../../context/ThemeContext'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'

export default function GuardiansManager() {
  const {
    guardians,
    iseFetchingLoading,
    isAdding,
    isSendLoading,
    setIsAdding,
    sendAddGuardian,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    closeQRCodeScanner,
    sendRemoveGuardian,
    removingGuardians,
  } = useGuardiansManager()
  const { theme } = useContext(ThemeContext)

  const themedStyles = StyleService.create({
    inputDisabled: {
      marginBottom: 1 * vh,
      backgroundColor: theme === 'light' ? 'color-basic-200' : 'color-basic-600',
      borderColor: theme === 'light' ? 'color-basic-500' : 'color-basic-500',
    },
    indicator: {
      position: 'absolute',
      right: 5,
      alignItems: 'center',
    },
  })
  const styles = useStyleSheet(themedStyles)

  const RemoveIcon = (props: any, guardian: string): React.ReactElement => {
    if (removingGuardians.includes(guardian)) {
      return (
        <View style={[props.style, styles.indicator, { top: 10 }]}>
          <Spinner size="tiny" />
        </View>
      )
    } else {
      return (
        <TouchableWithoutFeedback testID="delete-icon" onPress={() => sendRemoveGuardian(guardian)}>
          <Image
            style={{
              height: props.style.height,
              marginHorizontal: props.style.marginHorizontal,
              width: props.style.width,
            }}
            source={deleteSmall}
          />
        </TouchableWithoutFeedback>
      )
    }
  }

  const LoadingIndicator = (props: any) => {
    return (
      isSendLoading && (
        <View style={[props.style, styles.indicator]}>
          <Spinner size="tiny" />
        </View>
      )
    )
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
    <View>
      {iseFetchingLoading && (
        <View style={appStyles.center}>
          <Spinner
            size="giant"
            status="basic"
            style={{
              marginBottom: 2 * vh,
            }}
          />
        </View>
      )}
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
          <Button
            testID="save-guardian"
            onPress={sendAddGuardian}
            appearance="outline"
            style={{ marginTop: 1 * vh }}
            accessoryRight={<LoadingIndicator />}
          >
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
