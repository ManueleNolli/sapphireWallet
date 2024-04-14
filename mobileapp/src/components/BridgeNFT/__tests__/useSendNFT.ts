import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { OwnedNFT, ownedNFTs } from '../../../services/blockchain'
import { NETWORKS } from '../../../constants/Networks'
import useBridgeNFT from '../useBridgeNFT'
import { getSigner } from '../../../services/wallet'
import { requestERC721TokenTransfer } from '../../../services/transactions'
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
  requestERC721TokenTransfer: jest.fn(),
}))

describe('useSendNFTs Hook', () => {
  it('fetches and sets NFTs on initialization', async () => {
    const mockNFTs: OwnedNFT[] = [
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

    // expect(resultHook.current.isNFTLoading).toBe(false)
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

  it('should send NFT transaction', async () => {
    const mockNFTs: OwnedNFT[] = [
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
    ]

    ;(ownedNFTs as jest.Mock).mockResolvedValue(mockNFTs)
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: jest.fn().mockResolvedValue('getPrivateKeyMock'),
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestERC721TokenTransfer as jest.Mock).mockReturnValueOnce('requestETHTransferMock')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: 'address', close: close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendNFTTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestERC721TokenTransfer).toHaveBeenCalledWith('address', '', 1, 'signer', NETWORKS.LOCALHOST)

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
        tokenId: '1',
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
    ;(requestERC721TokenTransfer as jest.Mock).mockRejectedValue({
      message: 'requestETHTransferMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn()

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeNFT({ address: 'address', close: close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendNFTTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestERC721TokenTransfer).toHaveBeenCalledWith('address', '', 1, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestETHTransferMock',
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
      const { result } = renderHook(() => useBridgeNFT({ address: 'address', close: close }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.QRCodeFinishedScanning('dataexample')
    })

    expect(resultHook.current.valueAddress).toBe('dataexample')
    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })
})
