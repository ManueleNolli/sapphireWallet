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
import useSendNFT from './useSendNFT'
import InputAddress from '../InputAddress/InputAddress'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { NETWORKS } from '../../constants/Networks'
import { NFTCard } from '../NFTCard/NFTCard'

type SendETHProps = {
  address: string
  close: () => void
}
export default function SendNFT({ address, close }: SendETHProps) {
  const styles = useStyleSheet(themedStyles)
  const {
    isSendLoading,
    isNFTLoading,
    sendNFTTransaction,
    valueAddress,
    setValueAddress,
    isAddressValid,
    setIsAddressValid,
    nfts,
    selectedNFT,
    setSelectedNFT,
  } = useSendNFT({
    address,
    close,
  })

  console.log('setSelectedNFT', setSelectedNFT)

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
        category={'h6'}
        style={{
          paddingTop: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Send NFT
      </Text>
      <Text
        style={{
          marginBottom: 2 * vh,
          paddingHorizontal: 2 * vw,
        }}
      >
        Select an NFT and input the address
      </Text>
      <InputAddress
        value={valueAddress}
        setValue={setValueAddress}
        isValid={isAddressValid}
        setIsValid={setIsAddressValid}
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
          <Text category={'label'}>No NFTs found</Text>
        </View>
      )}
      <ScrollView
        style={{ marginTop: 2 * vh }}
        showsVerticalScrollIndicator={false}
      >
        {nfts.map(
          (
            nft: {
              name: string
              tokenId: string
              collectionName: string
              collectionDescription: string
              image: string
              network: NETWORKS
            },
            index: number
          ) => (
            <TouchableOpacity
              role={'button'}
              key={index}
              style={[
                styles.nftContainer,
                index == selectedNFT ? styles.nftSelected : null,
              ]}
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
                  height: 40 * vh,
                  width: 40 * vh,
                }}
              />
            </TouchableOpacity>
          )
        )}
      </ScrollView>
      <Button
        testID="send-button"
        accessoryRight={<LoadingIndicator />}
        style={{ marginTop: 2 * vh, width: '100%' }}
        appearance="outline"
        status="info"
        disabled={!isAddressValid}
        onPress={sendNFTTransaction}
      >
        Send NFT
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
    maxWidth: 90 * vw,
  },
  indicator: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
  },
  nftContainer: {
    height: 42 * vh,
    width: 42 * vh,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  nftSelected: {
    backgroundColor: 'color-primary-400',
  },
})
