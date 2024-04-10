import useBridgeETHtoMATIC from '../useBridgeETHtoMATIC'
import renderWithTheme from '../../../TestHelper'
import React from 'react'
import BridgeETHtoMATIC from '../BridgeETHtoMATIC'
import { act, fireEvent, waitFor } from '@testing-library/react-native'

jest.mock('../useBridgeETHtoMATIC', () => jest.fn())
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

describe('BridgeETHToMATICMock', () => {
  it('renders correctly', async () => {
    ;(useBridgeETHtoMATIC as jest.Mock).mockReturnValue({
      isLoading: false,
      sendBridgeTransaction: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<BridgeETHtoMATIC address="0x123456789" balance={100} close={jest.fn()} />)
    })

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when loading', async () => {
    ;(useBridgeETHtoMATIC as jest.Mock).mockReturnValue({
      isLoading: true,
      sendBridgeTransaction: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<BridgeETHtoMATIC address="0x123456789" balance={100} close={jest.fn()} />)
    })
    expect(tree).toMatchSnapshot()
  })

  it('Send Button call sendBridgeTransaction', async () => {
    const bridgeMock = jest.fn()
    ;(useBridgeETHtoMATIC as jest.Mock).mockReturnValue({
      isLoading: true,
      sendBridgeTransaction: bridgeMock,
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(<BridgeETHtoMATIC address="0x123456789" balance={100} close={jest.fn()} />)
    })

    await act(async () => {
      const button = tree.getByTestId('send-button')
      fireEvent.press(button)
    })

    expect(bridgeMock).toHaveBeenCalled()
  })
})
