import { NETWORKS } from '../../../constants/Networks'
import { NFTPlaceholder } from '../../../assets/AssetsRegistry'
import renderWithTheme from '../../../TestHelper'
import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'
import SendDestNFT from '../SendDestNFT'
import useSendDestNFT from '../useSendDestNFT'

jest.mock('../useSendDestNFT', () => jest.fn())
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

describe('SendDestNFT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('render correctly', () => {
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isSendLoading: false,
      isNFTLoading: false,
      nfts: [
        {
          name: 'name0',
          description: 'description0',
          image: NFTPlaceholder,
          tokenId: '0',
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress0',
          collectionName: 'collectionName0',
          collectionDescription: 'collectionDescription0',
        },
        {
          name: 'name1',
          description: 'description1',
          image: NFTPlaceholder,
          tokenId: '1',
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress1',
          collectionName: 'collectionName1',
          collectionDescription: 'collectionDescription1',
        },
      ],
    })

    const tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)

    expect(tree).toMatchSnapshot()
  })

  it('render correctly without nfts', () => {
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: false,
      nfts: [],
    })

    const tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)

    expect(tree.getAllByText('No NFTs found')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('render correctly loading', () => {
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: true,
      nfts: [],
    })

    const tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)
    expect(tree).toMatchSnapshot()
  })

  it('render correctly without nfts', () => {
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: false,
      nfts: [],
    })

    const tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)

    expect(tree.getAllByText('No NFTs found')).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })

  it('Select NFT will change', () => {
    const setSelectedNFT = jest.fn((number: number) => {})
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isLoading: false,
      isNFTLoading: true,
      setSelectedNFT,
      nfts: [
        {
          name: 'name0',
          description: 'description0',
          image: NFTPlaceholder,
          tokenId: '0',
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress0',
          collectionName: 'collectionName0',
          collectionDescription: 'collectionDescription0',
        },
        {
          name: 'name1',
          description: 'description1',
          image: NFTPlaceholder,
          tokenId: '1',
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'collectionAddress1',
          collectionName: 'collectionName1',
          collectionDescription: 'collectionDescription1',
        },
      ],
    })

    const tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)

    const NFTCard = tree.getByTestId('NFTCard-1')

    fireEvent.press(NFTCard)

    expect(setSelectedNFT).toHaveBeenCalledWith(1)
  })

  it('Show QRCode Scanner', async () => {
    const sendETHMock = jest.fn()
    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isLoading: true,
      sendETHTransaction: sendETHMock,
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      isQRCodeScanning: true,
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)
    })

    expect(tree).toMatchSnapshot()
  })

  it('Change CheckBox status', async () => {
    const checkedMock = jest.fn()

    ;(useSendDestNFT as jest.Mock).mockReturnValue({
      isSendLoading: false,
      isNFTLoading: false,
      sendBridgeTransaction: jest.fn(),
      nfts: [],
      selectedNFT: 0,
      setSelectedNFT: jest.fn(),
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: checkedMock,
    })

    let tree: any
    await waitFor(async () => {
      tree = renderWithTheme(<SendDestNFT address="address" close={() => {}} />)
    })

    await act(async () => {
      const button = tree.getByTestId('checkbox-button')
      fireEvent.press(button)
    })

    expect(checkedMock).toHaveBeenCalled()
  })
})
