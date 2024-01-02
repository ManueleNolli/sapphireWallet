import React, { useContext } from 'react'
import { Button, Divider, Layout, useTheme } from '@ui-kitten/components'
import { ThemeContext } from '../../context/ThemeContext'
import SafeAreaView from '../../utils/SafeAreaView'
import { NFTCard } from '../../components/NFTCard/NFTCard'
import { NETWORKS } from '../../constants/Networks'
import { NFTPlaceholder } from '../../assets/AssetsRegistry'
import { ScrollView } from 'react-native'
import { vh } from '../../Styles'

const NFTsData = [
  {
    name: 'Purple cat',
    tokenId: '3022',
    collectionName: 'collectionName',
    collectionDescription: 'collectionDescription',
    image: NFTPlaceholder,
    network: NETWORKS.SEPOLIA,
  },
  {
    name: 'Jungle cat',
    tokenId: '2034',
    collectionName: 'collectionName',
    collectionDescription:
      'collectionDescriptioncollectionDescriptioncollectionDescription',
    image: NFTPlaceholder,
    network: NETWORKS.LOCALHOST,
  },
  {
    name: 'Aqua cat',
    tokenId: '234',
    collectionName: 'collectionName',
    collectionDescription:
      'collectionDescriptioncollectionDescriptioncollectionDescription',
    image: NFTPlaceholder,
    network: NETWORKS.LOCALHOST,
  },
]

export default function NFTs() {
  return (
    <ScrollView>
      <SafeAreaView style={{ paddingTop: 5 * vh, marginBottom: 0 }}>
        {NFTsData.map((nft, index) => (
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
        ))}
      </SafeAreaView>
    </ScrollView>
  )
}
