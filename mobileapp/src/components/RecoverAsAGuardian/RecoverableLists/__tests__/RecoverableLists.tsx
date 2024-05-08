import React from 'react'
import useRecoverableLists from '../useRecoverableLists'
import renderWithTheme from '../../../../TestHelper'
import RecoverableLists from '../RecoverableLists'
import { fireEvent } from '@testing-library/react-native'

jest.mock('../useRecoverableLists', () => jest.fn())
jest.mock('../../RecoverWallet/RecoverWallet')
jest.mock('@ui-kitten/components', () => {
  const { View } = require('react-native')
  return {
    ...jest.requireActual('@ui-kitten/components'),
    Spinner: () => <View data-testid="spinner" />,
  }
})
describe('RecoverableLists', () => {
  it('should render correctly when fetching', () => {
    ;(useRecoverableLists as jest.Mock).mockReturnValue({
      wallets: [],
      isFetching: true,
      isRecovering: false,
      startRecovering: jest.fn(),
      recoveringWallet: '',
      modalBackdrop: jest.fn(),
    })
    const tree = renderWithTheme(<RecoverableLists refreshRequest={false} />)

    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when recovering', () => {
    ;(useRecoverableLists as jest.Mock).mockReturnValue({
      wallets: ['wallet1', 'wallet2'],
      isFetching: false,
      isRecovering: true,
      startRecovering: jest.fn(),
      recoveringWallet: 'wallet1',
      modalBackdrop: jest.fn(),
    })
    const tree = renderWithTheme(<RecoverableLists refreshRequest={false} />)

    expect(tree).toMatchSnapshot()
  })

  it('should render correctly when no wallet', () => {
    ;(useRecoverableLists as jest.Mock).mockReturnValue({
      wallets: [],
      isFetching: false,
      isRecovering: false,
      startRecovering: jest.fn(),
      recoveringWallet: '',
      modalBackdrop: jest.fn(),
    })
    const tree = renderWithTheme(<RecoverableLists refreshRequest={false} />)

    expect(tree.getAllByText('You are not a guardian of any wallet')).toHaveLength(1)

    expect(tree).toMatchSnapshot()
  })

  it('should call startRecovering', () => {
    const startRecoveringMock = jest.fn()
    ;(useRecoverableLists as jest.Mock).mockReturnValue({
      wallets: ['wallet1'],
      isFetching: false,
      isRecovering: false,
      startRecovering: startRecoveringMock,
      recoveringWallet: '',
      modalBackdrop: jest.fn(),
    })
    const tree = renderWithTheme(<RecoverableLists refreshRequest={false} />)

    fireEvent.press(tree.getByText(' wallet...let1'))

    expect(startRecoveringMock).toHaveBeenCalledWith('wallet1')

    expect(tree).toMatchSnapshot()
  })
})
