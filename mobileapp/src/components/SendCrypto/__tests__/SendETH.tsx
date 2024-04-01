import useSendCrypto from '../useSendCrypto'
import renderWithTheme from '../../../TestHelper'
import React from 'react'
import SendETH from '../SendETH'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('../useSendCrypto', () => jest.fn())
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

describe('SendETH', () => {
  it('renders correctly', async () => {
    ;(useSendCrypto as jest.Mock).mockReturnValue({
      isLoading: false,
      sendETHTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<SendETH address={'0x123456789'} balance={100} close={jest.fn()} />)
    })

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when loading', async () => {
    ;(useSendCrypto as jest.Mock).mockReturnValue({
      isLoading: true,
      sendETHTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<SendETH address={'0x123456789'} balance={100} close={jest.fn()} />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Send Button call sendETHTransaction', async () => {
    const sendETHMock = jest.fn()
    ;(useSendCrypto as jest.Mock).mockReturnValue({
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
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<SendETH address={'0x123456789'} balance={100} close={jest.fn()} />)
    })

    await act(async () => {
      const button = tree.getByTestId('send-button')
      fireEvent.press(button)
    })

    expect(sendETHMock).toHaveBeenCalled()
  })

  it('Show QRCode Scanner', async () => {
    const sendETHMock = jest.fn()
    ;(useSendCrypto as jest.Mock).mockReturnValue({
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
      tree = renderWithTheme(<SendETH address={'0x123456789'} balance={100} close={jest.fn()} />)
    })

    expect(tree).toMatchSnapshot()
  })
})
