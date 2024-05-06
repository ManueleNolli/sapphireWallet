import useRecoverWallet from '../useRecoverWallet'
import renderWithTheme from '../../../../TestHelper'
import React from 'react'
import RecoverWallet from '../RecoverWallet'

jest.mock('../useRecoverWallet', () => jest.fn())
jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})
describe('RecoverWallet', () => {
  it('should render correctly the button', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isLoading: false,
      prepareTransactionAndShowQrCode: jest.fn(),
      recoverWalletInfo: '',
    })

    const tree = renderWithTheme(<RecoverWallet wallet="wallet" />)

    expect(tree.getByTestId('button-yen')).toBeTruthy()

    expect(tree).toMatchSnapshot()
  })

  it('should render correctly the qr code', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isLoading: false,
      prepareTransactionAndShowQrCode: jest.fn(),
      recoverWalletInfo: 'walletInfo',
    })

    const tree = renderWithTheme(<RecoverWallet wallet="wallet" />)

    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when loading', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isLoading: true,
      prepareTransactionAndShowQrCode: jest.fn(),
      recoverWalletInfo: 'walletInfo',
    })

    const tree = renderWithTheme(<RecoverWallet wallet="wallet" />)

    expect(tree).toMatchSnapshot()
  })
})
