import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { OwnedNFT, ownedNFTs } from '../../../services/blockchain'
import { NETWORKS } from '../../../constants/Networks'
import useSendDestNFT from '../useSendDestNFT'
import { getSigner } from '../../../services/wallet'
import { requestERC721TokenTransfer, requestPolygonNFTTransfer } from '../../../services/transactions'
import Toast from 'react-native-toast-message'
import { BRIDGE_NETWORKS } from '../../../constants/BridgeNetworks'

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
  requestPolygonNFTTransfer: jest.fn(),
}))

describe('useSendDestNFTs Hook', () => {
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
      const { result } = renderHook(() => useSendDestNFT({ address: '', close: jest.fn() }))
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
      const { result } = renderHook(() => useSendDestNFT({ address: '', close: jest.fn() }))
      resultHook = result
    })

    expect(resultHook.current.isNFTLoading).toBe(false)
    expect(resultHook.current.nfts).toEqual([])
  })

  it('should send NFT transaction', async () => {
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
    ;(requestPolygonNFTTransfer as jest.Mock).mockReturnValueOnce('requestPolygonNFTTransferMock')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useSendDestNFT({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestPolygonNFTTransfer).toHaveBeenCalledWith(
      'address',
      '',
      1,
      'signer',
      NETWORKS.LOCALHOST,
      BRIDGE_NETWORKS.AMOY,
      true
    )

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
    ;(requestPolygonNFTTransfer as jest.Mock).mockRejectedValue({
      message: 'requestPolygonNFTTransferMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useSendDestNFT({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestPolygonNFTTransfer).toHaveBeenCalledWith(
      'address',
      '',
      1,
      'signer',
      NETWORKS.LOCALHOST,
      BRIDGE_NETWORKS.AMOY,
      true
    )

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestPolygonNFTTransferMock',
    })

    expect(close).toHaveBeenCalled()
  })

  it('should set value address when qrcode finished', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })

    const close = jest.fn()
    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useSendDestNFT({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.QRCodeFinishedScanning('dataexample')
    })

    expect(resultHook.current.valueAddress).toBe('dataexample')
    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })
})
