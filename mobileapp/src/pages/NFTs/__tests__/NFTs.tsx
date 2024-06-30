import useNFTs from '../useNFTs'
import { NETWORKS } from '../../../constants/Networks'
import { NFTPlaceholder } from '../../../assets/AssetsRegistry'
import renderWithTheme from '../../../TestHelper'
import NFTs from '../NFTs'
import React from 'react'

jest.mock('../useNFTs', () => jest.fn())
jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})
describe('NFTs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('render correctly', () => {
    ;(useNFTs as jest.Mock).mockReturnValue({
      isLoading: false,
      nfts: [
        {
          name: 'name0',
          description: 'description0',
          image: NFTPlaceholder,
          tokenId: 0,
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress0',
          collectionName: 'collectionName0',
          collectionDescription: 'collectionDescription0',
        },
        {
          name: 'name1',
          description: 'description1',
          image: NFTPlaceholder,
          tokenId: 1,
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress1',
          collectionName: 'collectionName1',
          collectionDescription: 'collectionDescription1',
        },
      ],
    })

    const tree = renderWithTheme(<NFTs />)

    expect(tree).toMatchSnapshot()
  })

  it('render correctly without nfts', () => {
    ;(useNFTs as jest.Mock).mockReturnValue({
      isLoading: false,
      nfts: [],
    })

    const tree = renderWithTheme(<NFTs />)

    expect(tree.getAllByText('No NFTs found')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('render correctly loading', () => {
    ;(useNFTs as jest.Mock).mockReturnValue({
      isLoading: true,
      nfts: [],
    })

    const tree = renderWithTheme(<NFTs />)

    expect(tree).toMatchSnapshot()
  })
})
