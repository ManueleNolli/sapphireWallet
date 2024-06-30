import React from 'react'
import { View } from 'react-native'
import useRecoverableLists from './useRecoverableLists'
import { appStyles, vh, vw } from '../../../Styles'
import { Button, Modal, Spinner, StyleService, useStyleSheet, Text } from '@ui-kitten/components'
import { formatBlockchainAddress } from '../../../utils/formatBlockchainData'
import RecoverWallet from '../RecoverWallet/RecoverWallet'

type RecoverableListsProps = {
  refreshRequest: boolean
}

export default function RecoverableLists(props: RecoverableListsProps) {
  const { wallets, isFetching, isRecovering, startRecovering, recoveringWallet, modalBackdrop } =
    useRecoverableLists(props)
  const styles = useStyleSheet(themedStyles)

  const renderWallet = (wallet: string) => {
    return (
      <Button
        key={wallet}
        style={{ width: '100%', marginTop: 1 * vh }}
        appearance="outline"
        onPress={() => startRecovering(wallet)}
      >
        <Text>{formatBlockchainAddress(wallet)}</Text>
      </Button>
    )
  }

  return (
    <View>
      {isFetching && (
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
      <Modal
        animationType="fade"
        visible={isRecovering}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={modalBackdrop}
      >
        <RecoverWallet wallet={recoveringWallet} />
      </Modal>

      {wallets.map(renderWallet)}
      {!isFetching && wallets.length === 0 && (
        <Text style={{ textAlign: 'center' }}>You are not a guardian of any wallet</Text>
      )}
    </View>
  )
}

const themedStyles = StyleService.create({
  modalContainer: {
    maxHeight: 75 * vh,
    maxWidth: 90 * vw,
    borderRadius: 10,
    paddingVertical: 4 * vh,
    paddingHorizontal: 4 * vw,
    alignItems: 'center',
  },
  modalBackdrop: {
    backgroundColor: 'color-basic-transparent-600',
  },
})
