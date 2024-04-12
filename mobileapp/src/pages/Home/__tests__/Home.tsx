import useHome from '../useHome'
import renderWithTheme from '../../../TestHelper'
import React from 'react'
import Home from '../Home'
import { fireEvent } from '@testing-library/react-native'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('../useHome', () => jest.fn())

describe('Home', () => {
  const balancesMock = {
    sepolia: {
      balance: '1.0',
      chainID: '1',
      crypto: 'ETH',
    },
    amoy: {
      balance: '1.0',
      chainID: '1',
      crypto: 'MATIC',
    },
  }
  const getWalletContractAddressMock = jest.fn().mockReturnValue('0x123456789')
  const isBalanceLoadingMock = false
  const copyAddressToClipboardMock = jest.fn()
  const isReceiveModalVisibleMock = false
  const setIsReceiveModalVisibleMock = jest.fn()
  const isSendETHModalVisibleMock = false
  const setIsSendETHModalVisibleMock = jest.fn()
  const isSendMATICModalVisibleMock = false
  const setIsSendMATICModalVisibleMock = jest.fn()
  const isSendNFTModalVisibleMock = false
  const setIsSendNFTModalVisibleMock = jest.fn()
  const isBridgeETHtoMATICModalVisibleMock = false
  const setIsBridgeETHtoMATICModalVisibleMock = jest.fn()
  const onRefreshMock = jest.fn()
  const isRefreshingMock = false
  const modalReceiverBackdropMock = jest.fn()
  const modalSendETHBackdropMock = jest.fn()
  const modalSendMATICBackdropMock = jest.fn()
  const modalSendNFTBackdropMock = jest.fn()
  const modalBridgeETHtoMATICBackdropMock = jest.fn()
  const closeSendETHModalMock = jest.fn()
  const closeBridgeETHtoMATICModalMock = jest.fn()
  const closeSendMATICModalMock = jest.fn()
  const closeSendNFTModalMock = jest.fn()

  beforeEach(() => {
    ;(useHome as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.SEPOLIA,
      backgroundImage: 'light',
      balances: balancesMock,
      isBalanceLoading: isBalanceLoadingMock,
      getWalletContractAddress: getWalletContractAddressMock,
      copyAddressToClipboard: copyAddressToClipboardMock,
      isReceiveModalVisible: isReceiveModalVisibleMock,
      setIsReceiveModalVisible: setIsReceiveModalVisibleMock,
      isSendETHModalVisible: isSendETHModalVisibleMock,
      setIsSendETHModalVisible: setIsSendETHModalVisibleMock,
      isSendMATICModalVisible: isSendMATICModalVisibleMock,
      setIsSendMATICModalVisible: setIsSendMATICModalVisibleMock,
      isSendNFTModalVisible: isSendNFTModalVisibleMock,
      setIsSendNFTModalVisible: setIsSendNFTModalVisibleMock,
      isBridgeETHtoMATICModalVisible: isBridgeETHtoMATICModalVisibleMock,
      setIsBridgeETHtoMATICModalVisible: setIsBridgeETHtoMATICModalVisibleMock,
      onRefresh: onRefreshMock,
      isRefreshing: isRefreshingMock,
      modalReceiveBackdrop: modalReceiverBackdropMock,
      modalSendETHBackdrop: modalSendETHBackdropMock,
      modalSendMATICBackdrop: modalSendMATICBackdropMock,
      modalSendNFTBackdrop: modalSendNFTBackdropMock,
      modalBridgeETHtoMATICBackdrop: modalBridgeETHtoMATICBackdropMock,
      closeSendETHModal: closeSendETHModalMock,
      closeBridgeETHtoMATICModal: closeBridgeETHtoMATICModalMock,
      closeSendMATICModal: closeSendMATICModalMock,
      closeSendNFTModal: closeSendNFTModalMock,
    })
  })

  it('renders correctly', () => {
    const { toJSON } = renderWithTheme(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly only ETH', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.SEPOLIA,
      backgroundImage: 'light',
      balances: {
        sepolia: {
          balance: '1.0',
          chainID: '1',
          crypto: 'ETH',
        },
      },
      isBalanceLoading: isBalanceLoadingMock,
      getWalletContractAddress: getWalletContractAddressMock,
      copyAddressToClipboard: copyAddressToClipboardMock,
      isReceiveModalVisible: isReceiveModalVisibleMock,
      setIsReceiveModalVisible: setIsReceiveModalVisibleMock,
      isSendETHModalVisible: isSendETHModalVisibleMock,
      setIsSendETHModalVisible: setIsSendETHModalVisibleMock,
      isSendMATICModalVisible: isSendMATICModalVisibleMock,
      setIsSendMATICModalVisible: setIsSendMATICModalVisibleMock,
      isSendNFTModalVisible: isSendNFTModalVisibleMock,
      setIsSendNFTModalVisible: setIsSendNFTModalVisibleMock,
      isBridgeETHtoMATICModalVisible: isBridgeETHtoMATICModalVisibleMock,
      setIsBridgeETHtoMATICModalVisible: setIsBridgeETHtoMATICModalVisibleMock,
      onRefresh: onRefreshMock,
      isRefreshing: isRefreshingMock,
      modalReceiveBackdrop: modalReceiverBackdropMock,
      modalSendETHBackdrop: modalSendETHBackdropMock,
      modalSendMATICBackdrop: modalSendMATICBackdropMock,
      modalSendNFTBackdrop: modalSendNFTBackdropMock,
      modalBridgeETHtoMATICBackdrop: modalBridgeETHtoMATICBackdropMock,
      closeSendETHModal: closeSendETHModalMock,
      closeBridgeETHtoMATICModal: closeBridgeETHtoMATICModalMock,
      closeSendMATICModal: closeSendMATICModalMock,
      closeSendNFTModal: closeSendNFTModalMock,
    })
    const { toJSON } = renderWithTheme(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly only ETH balance = 0', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.SEPOLIA,
      backgroundImage: 'light',
      balances: {
        sepolia: {
          balance: '0',
          chainID: '1',
          crypto: 'ETH',
        },
      },
      isBalanceLoading: isBalanceLoadingMock,
      getWalletContractAddress: getWalletContractAddressMock,
      copyAddressToClipboard: copyAddressToClipboardMock,
      isReceiveModalVisible: isReceiveModalVisibleMock,
      setIsReceiveModalVisible: setIsReceiveModalVisibleMock,
      isSendETHModalVisible: isSendETHModalVisibleMock,
      setIsSendETHModalVisible: setIsSendETHModalVisibleMock,
      isSendMATICModalVisible: isSendMATICModalVisibleMock,
      setIsSendMATICModalVisible: setIsSendMATICModalVisibleMock,
      isSendNFTModalVisible: isSendNFTModalVisibleMock,
      setIsSendNFTModalVisible: setIsSendNFTModalVisibleMock,
      isBridgeETHtoMATICModalVisible: isBridgeETHtoMATICModalVisibleMock,
      setIsBridgeETHtoMATICModalVisible: setIsBridgeETHtoMATICModalVisibleMock,
      onRefresh: onRefreshMock,
      isRefreshing: isRefreshingMock,
      modalReceiveBackdrop: modalReceiverBackdropMock,
      modalSendETHBackdrop: modalSendETHBackdropMock,
      modalSendMATICBackdrop: modalSendMATICBackdropMock,
      modalSendNFTBackdrop: modalSendNFTBackdropMock,
      modalBridgeETHtoMATICBackdrop: modalBridgeETHtoMATICBackdropMock,
      closeSendETHModal: closeSendETHModalMock,
      closeBridgeETHtoMATICModal: closeBridgeETHtoMATICModalMock,
      closeSendMATICModal: closeSendMATICModalMock,
      closeSendNFTModal: closeSendNFTModalMock,
    })
    const { toJSON } = renderWithTheme(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('renders correctly only MATIC', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.SEPOLIA,
      backgroundImage: 'light',
      balances: {
        amoy: {
          balance: '1.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      },
      isBalanceLoading: isBalanceLoadingMock,
      getWalletContractAddress: getWalletContractAddressMock,
      copyAddressToClipboard: copyAddressToClipboardMock,
      isReceiveModalVisible: isReceiveModalVisibleMock,
      setIsReceiveModalVisible: setIsReceiveModalVisibleMock,
      isSendETHModalVisible: isSendETHModalVisibleMock,
      setIsSendETHModalVisible: setIsSendETHModalVisibleMock,
      isSendMATICModalVisible: isSendMATICModalVisibleMock,
      setIsSendMATICModalVisible: setIsSendMATICModalVisibleMock,
      isSendNFTModalVisible: isSendNFTModalVisibleMock,
      setIsSendNFTModalVisible: setIsSendNFTModalVisibleMock,
      isBridgeETHtoMATICModalVisible: isBridgeETHtoMATICModalVisibleMock,
      setIsBridgeETHtoMATICModalVisible: setIsBridgeETHtoMATICModalVisibleMock,
      onRefresh: onRefreshMock,
      isRefreshing: isRefreshingMock,
      modalReceiveBackdrop: modalReceiverBackdropMock,
      modalSendETHBackdrop: modalSendETHBackdropMock,
      modalSendMATICBackdrop: modalSendMATICBackdropMock,
      modalSendNFTBackdrop: modalSendNFTBackdropMock,
      modalBridgeETHtoMATICBackdrop: modalBridgeETHtoMATICBackdropMock,
      closeSendETHModal: closeSendETHModalMock,
      closeBridgeETHtoMATICModal: closeBridgeETHtoMATICModalMock,
      closeSendMATICModal: closeSendMATICModalMock,
      closeSendNFTModal: closeSendNFTModalMock,
    })
    const { toJSON } = renderWithTheme(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('press Receive', () => {
    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Receive')[0]
    fireEvent.press(button)

    expect(setIsReceiveModalVisibleMock).toHaveBeenCalled()
  })

  it('press Send ETH', () => {
    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Send ETH')[0]
    fireEvent.press(button)

    expect(setIsSendETHModalVisibleMock).toHaveBeenCalled()
  })

  it('press Send Matic', () => {
    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Send MATIC')[0]
    fireEvent.press(button)

    expect(setIsSendMATICModalVisibleMock).toHaveBeenCalled()
  })

  it('press Send NFT', () => {
    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Send NFTs')[0]
    fireEvent.press(button)

    expect(setIsSendNFTModalVisibleMock).toHaveBeenCalled()
  })

  it('press Bridge ETH to MATIC', () => {
    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Bridge ETH to MATIC')[0]
    fireEvent.press(button)

    expect(setIsBridgeETHtoMATICModalVisibleMock).toHaveBeenCalled()
  })
})
