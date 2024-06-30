import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { OwnedNFT, ownedNFTs } from '../../../services/blockchain'
import { NETWORKS } from '../../../constants/Networks'
import useBridgeNFT from '../useBridgeNFT'
import { getSigner } from '../../../services/wallet'
import { requestNFTBridgeCall } from '../../../services/transactions'
import Toast from 'react-native-toast-message'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))
jest.mock('../../../services/blockchain')

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

jest.mock('../../../services/wallet', () => ({
  getSigner: jest.fn(),
}))

jest.mock('../../../services/transactions', () => ({
  requestNFTBridgeCall: jest.fn(),
}))

describe('useBridgeNFT Hook', () => {
  it('fetches and sets NFTs on initialization', async () => {
    const mockNFTs: OwnedNFT[] = [
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
    ]

    ;(ownedNFTs as jest.Mock).mockResolvedValue(mockNFTs)
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: 'mockPrivateKey',
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: '', close: jest.fn() }))
      resultHook = result
    })

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

  it('catch error at initialisation', async () => {
    ;(ownedNFTs as jest.Mock).mockRejectedValue(new Error('mockError'))
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: 'mockPrivateKey',
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: '', close: jest.fn() }))
      resultHook = result
    })

    expect(resultHook.current.isNFTLoading).toBe(false)
    expect(resultHook.current.nfts).toEqual([])
  })

  it('should send bridge transaction', async () => {
    const mockNFTs: OwnedNFT[] = [
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
    ]

    ;(ownedNFTs as jest.Mock).mockResolvedValue(mockNFTs)
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: jest.fn().mockResolvedValue('getPrivateKeyMock'),
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestNFTBridgeCall as jest.Mock).mockReturnValueOnce('requestNFTBridgeCall')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestNFTBridgeCall).toHaveBeenCalledWith('address', 1, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Transaction sent! 🚀',
    })

    expect(close).toHaveBeenCalled()
  })

  it('should catch error in NFT transaction', async () => {
    const mockNFTs: OwnedNFT[] = [
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
    ]

    ;(ownedNFTs as jest.Mock).mockResolvedValue(mockNFTs)
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: jest.fn().mockResolvedValue('getPrivateKeyMock'),
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestNFTBridgeCall as jest.Mock).mockRejectedValue({
      message: 'requestNFTBridgeCallMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestNFTBridgeCall).toHaveBeenCalledWith('address', 1, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestNFTBridgeCallMock',
    })

    expect(close).toHaveBeenCalled()
  })
})
