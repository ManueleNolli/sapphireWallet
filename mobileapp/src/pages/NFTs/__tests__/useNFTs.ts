import React, { useContext } from 'react'
import { renderHook, act, waitFor } from '@testing-library/react-native'
import useNFTs from '../useNFTs'
import { OwnedNFT, ownedNFTs } from '../../../services/blockchain'
import { NETWORKS } from '../../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../../constants/BridgeNetworks'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))
jest.mock('../../../services/blockchain', () => ({
  ownedNFTs: jest.fn(),
}))

describe('useNFTs Hook', () => {
  const mockEthersProvider = 'mockEthersProvider'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches and sets NFTs on initialization', async () => {
    ;(ownedNFTs as jest.Mock).mockResolvedValueOnce([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: NETWORKS.SEPOLIA,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ] as OwnedNFT[])
    ;(ownedNFTs as jest.Mock).mockResolvedValueOnce([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: BRIDGE_NETWORKS.AMOY,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ] as OwnedNFT[])
    const mockWalletContextValue = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      isLoading: false,
      currentNetwork: NETWORKS.SEPOLIA,
      ethersProvider: mockEthersProvider,
      getWalletContractAddress: mockWalletContextValue,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useNFTs())
      resultHook = result
    })

    expect(resultHook.current.isLoading).toBe(false)
    expect(ownedNFTs).toHaveBeenCalledWith(mockWalletContextValue(), NETWORKS.SEPOLIA)
    expect(ownedNFTs).toHaveBeenCalledWith(mockWalletContextValue(), BRIDGE_NETWORKS.AMOY)
    expect(resultHook.current.nfts).toEqual([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: NETWORKS.SEPOLIA,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: BRIDGE_NETWORKS.AMOY,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ])
  })

  it('catch error', async () => {
    ;(ownedNFTs as jest.Mock).mockRejectedValue('error')
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
    ;(ownedNFTs as jest.Mock)
      .mockResolvedValueOnce([
        {
          name: 'Mock NFT',
          description: 'Mock NFT Description',
          image: 'mockImageURL',
          tokenId: 1,
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'mockCollectionAddress',
          collectionName: 'Mock Collection',
          collectionDescription: 'Mock Collection Description',
        },
      ] as OwnedNFT[])
      .mockResolvedValueOnce([
        {
          name: 'Mock NFT2',
          description: 'Mock NFT Description2',
          image: 'mockImageURL2',
          tokenId: 2,
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'mockCollectionAddress',
          collectionName: 'Mock Collection',
          collectionDescription: 'Mock Collection Description',
        },
      ] as OwnedNFT[])
    ;(ownedNFTs as jest.Mock)
      .mockResolvedValueOnce([
        {
          name: 'Mock NFT',
          description: 'Mock NFT Description',
          image: 'mockImageURL',
          tokenId: 1,
          network: NETWORKS.LOCALHOST,
          collectionAddress: 'mockCollectionAddress',
          collectionName: 'Mock Collection',
          collectionDescription: 'Mock Collection Description',
        },
      ] as OwnedNFT[])
      .mockResolvedValueOnce([] as OwnedNFT[])

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

    expect(ownedNFTs).toHaveBeenCalledTimes(4)
    console.log(resultHook.current.nfts)
    expect(resultHook.current.nfts).toEqual([
      {
        name: 'Mock NFT',
        description: 'Mock NFT Description',
        image: 'mockImageURL',
        tokenId: 1,
        network: NETWORKS.LOCALHOST,
        collectionAddress: 'mockCollectionAddress',
        collectionName: 'Mock Collection',
        collectionDescription: 'Mock Collection Description',
      },
    ])
  })
})
