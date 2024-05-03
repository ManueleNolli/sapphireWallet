import useRecoverWallet from '../useRecoverWallet'
import renderWithTheme from '../../../../TestHelper'
import RecoverWallet from '../RecoverWallet'
import { View } from 'react-native'
import React from 'react'

jest.mock('../useRecoverWallet', () => jest.fn())
jest.mock('../../../../components/QRCodeScanner/QRCodeScanner')
jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})
describe('RecoverWallet', () => {
  it('should render correctly', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isScannedOpen: false,
      closeModal: jest.fn(),
      openModal: jest.fn(),
      onQrCodeScanned: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(<RecoverWallet {...({ route: {}, navigation: {} } as any)} />)
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when loading', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isScannedOpen: false,
      closeModal: jest.fn(),
      openModal: jest.fn(),
      onQrCodeScanned: jest.fn(),
      isLoading: true,
    })

    const tree = renderWithTheme(<RecoverWallet {...({ route: {}, navigation: {} } as any)} />)
    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when scanning', () => {
    ;(useRecoverWallet as jest.Mock).mockReturnValue({
      isScannedOpen: true,
      closeModal: jest.fn(),
      openModal: jest.fn(),
      onQrCodeScanned: jest.fn(),
      isLoading: false,
    })

    const tree = renderWithTheme(<RecoverWallet {...({ route: {}, navigation: {} } as any)} />)
    expect(tree).toMatchSnapshot()
  })
})
