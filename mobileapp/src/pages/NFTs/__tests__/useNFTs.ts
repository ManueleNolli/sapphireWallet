import React, { useContext } from 'react'
import { renderHook, act, waitFor } from '@testing-library/react-native'
import useNFTs from '../useNFTs'
import { OwnedNFT, ownedNFTs } from '../../../services/blockchain'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))
jest.mock('../../../services/blockchain')

describe('useNFTs Hook', () => {
  const mockEthersProvider = 'mockEthersProvider'
  const mockOwnedNFTs = ownedNFTs as jest.MockedFunction<typeof ownedNFTs>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and sets NFTs on initialization', async () => {
    mockOwnedNFTs.mockResolvedValue([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: '1',
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ] as OwnedNFT[])
    const mockWalletContextValue = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      isLoading: false,
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: mockEthersProvider,
      getWalletContractAddress: mockWalletContextValue,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useNFTs())
      resultHook = result
    })

    expect(resultHook.current.isLoading).toBe(false)
    expect(resultHook.current.nfts).toEqual([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: '1',
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ])
  })

  it('catch error', async () => {
    mockOwnedNFTs.mockRejectedValue('error')
    const mockWalletContextValue = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      isLoading: false,
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: mockEthersProvider,
      getWalletContractAddress: mockWalletContextValue,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useNFTs())
      resultHook = result
    })

    expect(resultHook.current.isLoading).toBe(false)
    expect(resultHook.current.nfts).toEqual([])
  })

  it('refreshes NFTs', async () => {
       mockOwnedNFTs.mockResolvedValueOnce([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: '1',
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ] as OwnedNFT[])

           mockOwnedNFTs.mockResolvedValueOnce([
      {
        name: 'Mock NFT2',
        description: 'Mock NFT Description2',
        image: 'mockImageURL2',
        tokenId: '2',
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ] as OwnedNFT[])

    const mockWalletContextValue = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      isLoading: false,
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: mockEthersProvider,
      getWalletContractAddress: mockWalletContextValue,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useNFTs())
      resultHook = result
    })

    expect(resultHook.current.isLoading).toBe(false)

    await act(async () => {
      await resultHook.current.refreshNFTs()
    })

    expect(ownedNFTs).toHaveBeenCalledTimes(2)
    expect(resultHook.current.nfts).toEqual([
      {
        name: 'Mock NFT2',
        description: 'Mock NFT Description2',
        image: 'mockImageURL2',
        tokenId: '2',
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ])
  })
})
