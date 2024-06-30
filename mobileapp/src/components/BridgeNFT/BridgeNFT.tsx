import React from 'react'
import { Button, Layout, Spinner, StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import { vh, vw } from '../../Styles'
import useBridgeNFT from './useBridgeNFT'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { NFTCard } from '../NFTCard/NFTCard'
import { OwnedNFT } from '../../services/blockchain'

type SendETHProps = {
  address: string
  close: () => void
}
export default function BridgeNFT({ address, close }: SendETHProps) {
  const styles = useStyleSheet(themedStyles)
  const { isSendLoading, isNFTLoading, sendBridgeTransaction, nfts, selectedNFT, setSelectedNFT } = useBridgeNFT({
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

  return (
    <Layout style={styles.container}>
      <Text
        category="h6"
        style={{
          paddingTop: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Bridge NFT
      </Text>
      <Text
        style={{
          marginBottom: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Select an NFT to bridge
      </Text>
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
      <Button
        testID="send-button"
        accessoryRight={<LoadingIndicator />}
        style={{ marginTop: 2 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        disabled={nfts.length === 0}
        onPress={sendBridgeTransaction}
      >
        Bridge NFT
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
})
