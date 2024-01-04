import useHome from '../useHome'
import renderWithTheme from '../../../TestHelper'
import React from 'react'
import Home from '../Home'
import { fireEvent } from '@testing-library/react-native'

jest.mock('../useHome', () => jest.fn())

describe('Home', () => {
  it('renders correctly', () => {
    ;(useHome as jest.Mock).mockReturnValue({
      backgroundImage: 'light',
      balance: '100',
      getWalletContractAddress: jest.fn().mockReturnValue('0x123456789'),
      copyAddressToClipboard: jest.fn(),
      isReceiveModalVisible: false,
      setIsReceiveModalVisible: jest.fn(),
      isSendETHModalVisible: false,
      setIsSendETHModalVisible: jest.fn(),
      closeSendETHModal: jest.fn(),
    })

    const { toJSON } = renderWithTheme(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('press Receive', () => {
    const openModal = jest.fn()
    ;(useHome as jest.Mock).mockReturnValue({
      backgroundImage: 'light',
      balance: '100',
      getWalletContractAddress: jest.fn().mockReturnValue('0x123456789'),
      copyAddressToClipboard: jest.fn(),
      isReceiveModalVisible: false,
      setIsReceiveModalVisible: openModal,
      isSendETHModalVisible: false,
      setIsSendETHModalVisible: jest.fn(),
      closeSendETHModal: jest.fn(),
    })

    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Receive')[0]
    fireEvent.press(button)

    expect(openModal).toHaveBeenCalled()
  })

  it('press Send ETH', () => {
    const openModal = jest.fn()
    ;(useHome as jest.Mock).mockReturnValue({
      backgroundImage: 'light',
      balance: '100',
      getWalletContractAddress: jest.fn().mockReturnValue('0x123456789'),
      copyAddressToClipboard: jest.fn(),
      isReceiveModalVisible: false,
      setIsReceiveModalVisible: jest.fn(),
      isSendETHModalVisible: false,
      setIsSendETHModalVisible: openModal,
      closeSendETHModal: jest.fn(),
    })

    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Send ETH')[0]
    fireEvent.press(button)

    expect(openModal).toHaveBeenCalled()
  })

  it('press Send NFTs', () => {
    const openModal = jest.fn()

    ;(useHome as jest.Mock).mockReturnValue({
      backgroundImage: 'light',
      balance: '100',
      getWalletContractAddress: jest.fn().mockReturnValue('0x123456789'),
      copyAddressToClipboard: jest.fn(),
      isSendNFTModalVisible: false,
      setIsSendNFTModalVisible: openModal,
    })

    const tree = renderWithTheme(<Home />)
    const button = tree.getAllByText('Send NFTs')[0]
    fireEvent.press(button)

    expect(openModal).toHaveBeenCalled()
  })
})
