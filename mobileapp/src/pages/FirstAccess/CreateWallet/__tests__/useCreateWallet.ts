import { renderHook, act } from '@testing-library/react-native'
import useCreateWallet from '../useCreateWallet'
import { CreateWalletProps } from '../../../../navigation/FirstAccessStack'
import { useContext } from 'react'
import { Wallet } from 'ethers'
import { createWallet, getMnemonic } from '../../../../services/wallet'

jest.mock('ethers', () => ({
  HDNodeWallet: jest.fn(),
  Wallet: {
    createRandom: jest.fn(),
  },
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../../services/wallet', () => ({
  createWallet: jest.fn(),
  getMnemonic: jest.fn(),
}))

describe('useCreateWallet hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create and navigate', async () => {
    const setPrivateKeyMock = jest.fn().mockResolvedValue('value')
    const setEOAAddressMock = jest.fn().mockResolvedValue('value')
    ;(createWallet as jest.Mock).mockReturnValue({
      mnemonic: {
        phrase: 'a b c d e f g h i j',
      },
      privateKey: '0x123',
    })
    ;(getMnemonic as jest.Mock).mockReturnValue([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
    ])
    ;(useContext as jest.Mock).mockReturnValueOnce({
      setPrivateKey: setPrivateKeyMock,
      setEOAAddress: setEOAAddressMock,
    })

    const navigate = jest.fn()
    const navigation = { push: navigate }
    const { result } = renderHook(() =>
      useCreateWallet(navigation as unknown as CreateWalletProps['navigation'])
    )

    await act(() => {
      result.current.createAndNavigate()
    })

    expect(navigate).toHaveBeenCalledWith('MnemonicViewer', {
      mnemonic: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    })
    expect(setPrivateKeyMock).toHaveBeenCalledWith('0x123')
  })

  it('Should console error', async () => {
    const setPrivateKeyMock = jest.fn().mockRejectedValue('error')
    const setEOAAddressMock = jest.fn().mockRejectedValue('error')
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    ;(createWallet as jest.Mock).mockReturnValue('wallet')
    ;(useContext as jest.Mock).mockReturnValueOnce({
      setPrivateKey: setPrivateKeyMock,
      setEOAAddress: setEOAAddressMock,
    })
    ;(Wallet.createRandom as jest.Mock).mockReturnValueOnce({
      mnemonic: {
        phrase: 'a b c d e f g h i j',
      },
      privateKey: '0x123',
    })

    const navigate = jest.fn()
    const navigation = { push: navigate }
    const { result } = renderHook(() =>
      useCreateWallet(navigation as unknown as CreateWalletProps['navigation'])
    )

    await act(() => {
      result.current.createAndNavigate()
    })

    expect(navigate).not.toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('error')
  })
})
