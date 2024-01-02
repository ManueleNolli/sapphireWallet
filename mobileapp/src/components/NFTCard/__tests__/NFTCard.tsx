import renderWithTheme from '../../../TestHelper'
import React from 'react'
import { NETWORKS } from '../../../constants/Networks'
import { NFTCard } from '../NFTCard'
import { NFTPlaceholder } from '../../../assets/AssetsRegistry'
import { fireEvent } from '@testing-library/react-native'

describe('NFTCard', () => {
  it('should render correctly', () => {
    const tree = renderWithTheme(
      <NFTCard
        name="NFT Name"
        tokenId="1234567890"
        collectionName="Collection Name"
        collectionDescription="Collection Description"
        image={NFTPlaceholder}
        network={NETWORKS.LOCALHOST}
      />
    )

    expect(tree).toMatchSnapshot()
  })

  it('collapsible should work', () => {
    const tree = renderWithTheme(
      <NFTCard
        name="NFT Name"
        tokenId="1234567890"
        collectionName="Collection Name"
        collectionDescription="Collection Description"
        image={NFTPlaceholder}
        network={NETWORKS.LOCALHOST}
      />
    )

    const collapsible = tree.getByTestId('CollapsibleButton')
    fireEvent.press(collapsible)
    expect(tree).toMatchSnapshot()
  })
})
