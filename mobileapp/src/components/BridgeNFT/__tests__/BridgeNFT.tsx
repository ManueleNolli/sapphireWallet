import { NETWORKS } from '../../../constants/Networks'
import { NFTPlaceholder } from '../../../assets/AssetsRegistry'
import renderWithTheme from '../../../TestHelper'
import useBridgeNFT from '../useBridgeNFT'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import BridgeNFT from '../BridgeNFT'

jest.mock('../useBridgeNFT', () => jest.fn())
jest.mock('../../InputAddress/InputAddress')
jest.mock('../../InputNumeric/InputNumeric')
jest.mock('../../QRCodeScanner/QRCodeScanner')

jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})

describe('BridgeNFT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('render correctly', () => {
    ;(useBridgeNFT as jest.Mock).mockReturnValue({
      isSendLoading: false,
      isNFTLoading: false,
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

    const tree = renderWithTheme(<BridgeNFT address="address" close={() => {}} />)

    expect(tree).toMatchSnapshot()
  })

  it('render correctly without nfts', () => {
    ;(useBridgeNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: false,
      nfts: [],
    })

    const tree = renderWithTheme(<BridgeNFT address="address" close={() => {}} />)

    expect(tree.getAllByText('No NFTs found')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('render correctly loading', () => {
    ;(useBridgeNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: true,
      nfts: [],
    })

    const tree = renderWithTheme(<BridgeNFT address="address" close={() => {}} />)
    expect(tree).toMatchSnapshot()
  })

  it('Select NFT will change', () => {
    const setSelectedNFT = jest.fn((number: number) => {})
    ;(useBridgeNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: true,
      setSelectedNFT,
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

    const tree = renderWithTheme(<BridgeNFT address="address" close={() => {}} />)

    const NFTCard = tree.getByTestId('NFTCard-1')

    fireEvent.press(NFTCard)

    expect(setSelectedNFT).toHaveBeenCalledWith(1)
  })
})
