import useSendDestCrypto from '../useSendDestCrypto'
import renderWithTheme from '../../../TestHelper'
import React from 'react'

import { act, fireEvent, waitFor } from '@testing-library/react-native'
import SendDestCrypto from '../SendDestCrypto'

jest.mock('../useSendDestCrypto', () => jest.fn())
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

describe('SendDestCrypto', () => {
  it('renders correctly', async () => {
    ;(useSendDestCrypto as jest.Mock).mockReturnValue({
      isLoading: false,
      sendDestCryptoTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <SendDestCrypto
          address="0x123456789"
          cryptoName="NameCrypto"
          balance={100}
          close={jest.fn()}
          action={jest.fn()}
        />
      )
    })

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when loading', async () => {
    ;(useSendDestCrypto as jest.Mock).mockReturnValue({
      isLoading: true,
      sendDestCryptoTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <SendDestCrypto
          address="0x123456789"
          cryptoName="NameCrypto"
          balance={100}
          close={jest.fn()}
          action={jest.fn()}
        />
      )
    })
    expect(tree).toMatchSnapshot()
  })

  it('Send Button call sendETHTransaction', async () => {
    const sendMock = jest.fn()
    ;(useSendDestCrypto as jest.Mock).mockReturnValue({
      isLoading: true,
      sendDestCryptoTransaction: sendMock,
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: jest.fn(),
    })

    let tree: any
    await waitFor(async () => {
      tree = renderWithTheme(
        <SendDestCrypto
          address="0x123456789"
          cryptoName="NameCrypto"
          balance={100}
          close={jest.fn()}
          action={jest.fn()}
        />
      )
    })

    await act(async () => {
      const button = tree.getByTestId('send-button')
      fireEvent.press(button)
    })

    expect(sendMock).toHaveBeenCalled()
  })

  it('Change CheckBox status', async () => {
    const checkedMock = jest.fn()

    ;(useSendDestCrypto as jest.Mock).mockReturnValue({
      isLoading: true,
      sendDestCryptoTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: checkedMock,
    })

    let tree: any
    await waitFor(async () => {
      tree = renderWithTheme(
        <SendDestCrypto
          address="0x123456789"
          cryptoName="NameCrypto"
          balance={100}
          close={jest.fn()}
          action={jest.fn()}
        />
      )
    })

    await act(async () => {
      const button = tree.getByTestId('checkbox-button')
      fireEvent.press(button)
    })

    expect(checkedMock).toHaveBeenCalled()
  })

  it('Show QRCode Scanner', async () => {
    ;(useSendDestCrypto as jest.Mock).mockReturnValue({
      isLoading: true,
      sendDestCryptoTransaction: jest.fn(),
      valueAddress: '0x123456789',
      setValueAddress: jest.fn(),
      isAddressValid: true,
      setIsAddressValid: jest.fn(),
      valueAmount: '100',
      setValueAmount: jest.fn(),
      isAmountValid: true,
      setIsAmountValid: jest.fn(),
      isQRCodeScanning: true,
      checkedIsSapphireInternalTX: true,
      setCheckedIsSapphireInternalTX: jest.fn(),
    })

    let tree: any

    await waitFor(async () => {
      tree = renderWithTheme(
        <SendDestCrypto
          address="0x123456789"
          cryptoName="NameCrypto"
          balance={100}
          close={jest.fn()}
          action={jest.fn()}
        />
      )
    })

    expect(tree).toMatchSnapshot()
  })
})
