import React, { useContext, useEffect, useState } from 'react'
import SafeAreaView from '../../utils/SafeAreaView'
import { NFTCard } from '../../components/NFTCard/NFTCard'
import { NETWORKS } from '../../constants/Networks'
import { RefreshControl, ScrollView, View } from 'react-native'
import { appStyles, vh } from '../../Styles'
import { Layout, Spinner, Text, useTheme } from '@ui-kitten/components'
import useNFTs from './useNFTs'

export default function NFTs() {
  const { isLoading, nfts,isRefreshing,    refreshNFTs } = useNFTs()
  const theme = useTheme();

  return (
    <Layout style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshNFTs} colors={[theme['color-primary-100'],theme['color-primary-500'],theme['color-primary-900']]}
          progressBackgroundColor={'white'}
                          progressViewOffset={15 * vh}
          /> }
      >
        <SafeAreaView
          style={{
            paddingTop: 5 * vh,
            marginBottom: 0,
          }}
        >
          {isLoading && (
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
          {nfts.length === 0 && !isLoading && (
            <View style={appStyles.center}>
              <Text category={'label'}>No NFTs found</Text>
            </View>
          )}
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
              <NFTCard
                key={index}
                name={nft.name}
                tokenId={nft.tokenId}
                collectionName={nft.collectionName}
                collectionDescription={nft.collectionDescription}
                image={nft.image}
                network={nft.network}
                style={{ marginBottom: 2 * vh }}
              />
            )
          )}
        </SafeAreaView>
      </ScrollView>
    </Layout>
  )
}
