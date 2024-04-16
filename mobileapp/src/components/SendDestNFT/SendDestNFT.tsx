import React from 'react'
import { Button, CheckBox, Layout, Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useSendDestNFT from './useSendDestNFT'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { NFTCard } from '../NFTCard/NFTCard'
import { OwnedNFT } from '../../services/blockchain'
import InputAddress from '../InputAddress/InputAddress'
import QRCodeScanner from '../QRCodeScanner/QRCodeScanner'

type SendDestNFTprops = {
  address: string
  close: () => void
}
export default function SendDestNFT({ address, close }: SendDestNFTprops) {
  const styles = useStyleSheet(themedStyles)
  const {
    isSendLoading,
    isNFTLoading,
    sendBridgeTransaction,
    nfts,
    selectedNFT,
    setSelectedNFT,
    checkedIsSapphireInternalTX,
    setCheckedIsSapphireInternalTX,
    isQRCodeScanning,
    setIsQRCodeScanning,
    QRCodeFinishedScanning,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
  } = useSendDestNFT({
    address,
    close,
  })

  const LoadingIndicator = (props: any) => {
    return (
      isSendLoading && (
        <View style={[props.style, styles.indicator]}>
          <Spinner size="tiny" />
        </View>
      )
    )
  }

  if (isQRCodeScanning) return <QRCodeScanner onQRCodeScanned={QRCodeFinishedScanning} />

  return (
    <Layout style={styles.container}>
      <Text
        category="h6"
        style={{
          paddingTop: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Send Polygon NFT
      </Text>
      <Text
        style={{
          marginBottom: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Select an NFT to send
      </Text>
      <InputAddress
        value={valueAddress}
        setValue={setValueAddress}
        isValid={isAddressValid}
        setIsValid={setIsAddressValid}
        setIsQRCodeScanning={setIsQRCodeScanning}
      />
      {isNFTLoading && (
        <View
          style={{
            marginTop: 2 * vh,
          }}
        >
          <Spinner
            size="giant"
            status="basic"
            style={{
              marginBottom: 2 * vh,
            }}
          />
        </View>
      )}
      {nfts.length === 0 && !isNFTLoading && (
        <View style={{ marginTop: 2 * vh }}>
          <Text category="label">No NFTs found</Text>
        </View>
      )}
      <ScrollView style={{ marginTop: 2 * vh }} showsVerticalScrollIndicator={false}>
        {nfts.map((nft: OwnedNFT, index: number) => (
          <TouchableOpacity
            role="button"
            key={index}
            style={[styles.nftContainer, index == selectedNFT ? styles.nftSelected : null]}
            onPress={() => setSelectedNFT(index)}
          >
            <NFTCard
              name={nft.name}
              tokenId={nft.tokenId}
              collectionName={nft.collectionName}
              collectionDescription={nft.collectionDescription}
              image={nft.image}
              network={nft.network}
              style={{
                height: 35 * vh,
                width: 35 * vh,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
        disabled={!isAddressValid || nfts.length === 0}
        onPress={sendBridgeTransaction}
      >
        Send Polygon NFT
      </Button>
    </Layout>
  )
}

const themedStyles = StyleService.create({
  container: {
    paddingVertical: 2 * vh,
    paddingHorizontal: 2 * vw,
    alignItems: 'center',
    borderRadius: 10,
    maxHeight: 90 * vh,
    width: 90 * vw,
  },
  indicator: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
  },
  nftContainer: {
    height: 80 * vw,
    width: 80 * vw,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  nftSelected: {
    backgroundColor: 'color-primary-400',
    height: 76 * vw,
    width: 76 * vw,
    marginLeft: 2 * vw,
  },
  checkbox: {
    alignSelf: 'flex-start',
    marginTop: 2 * vh,
  },
})
