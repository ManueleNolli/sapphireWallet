import { renderHook, act } from '@testing-library/react-native'
import useMnemonicViewerRecoverWallet from '../useMnemonicViewerRecoverWallet'
import { setStringAsync } from 'expo-clipboard'
import { useContext } from 'react'
import { NETWORKS } from '../../../../constants/Networks'
import { concludeRecoverWallet } from '../../../../services/transactions'
import Toast from 'react-native-toast-message'
import { MnemonicViewerRecoverWalletProps } from '../../../../navigation/FirstAccessStack'

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../../services/wallet', () => ({
  getSigner: jest.fn(),
}))

jest.mock('../../../../services/transactions', () => ({
  concludeRecoverWallet: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

const propsMock = {
  params: {
    mnemonic: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    data: {
      walletAddress: 'walletAddressMock',
      wrappedTransaction: 'wrappedTransactionMock',
      signedTransaction: 'signedTransactionMock',
      nonce: 'nonceMock',
    },
  },
}

describe('useMnemonicViewer', () => {
  it('should copy the mnemonic to the clipboard', async () => {
    ;(setStringAsync as jest.Mock).mockResolvedValueOnce(undefined)
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: jest.fn(),
      setWalletContractAddress: jest.fn(),
    })
    const { result } = renderHook(() =>
      useMnemonicViewerRecoverWallet(propsMock as unknown as MnemonicViewerRecoverWalletProps['route'])
    )

    await act(async () => {
      await result.current.copyMnemonicToClipboard()
    })

    expect(setStringAsync).toHaveBeenCalledWith('a b c d e f g h i j')
  })

  it('should conclude recover wallet', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: jest.fn(),
      setWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(concludeRecoverWallet as jest.Mock).mockReturnValueOnce('concludeRecoverWalletMock')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() =>
      useMnemonicViewerRecoverWallet(propsMock as unknown as MnemonicViewerRecoverWalletProps['route'])
    )
    await act(async () => {
      await result.current.saveMnemonic()
    })

    expect(concludeRecoverWallet).toHaveBeenCalledWith(
      NETWORKS.LOCALHOST,
      'walletAddressMock',
      'wrappedTransactionMock',
      'signedTransactionMock',
      'nonceMock'
    )

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Wallet recovered 🎉',
      text2: 'Your wallet has been successfully recovered',
    })
  })

  it('should handle recover wallet error', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: jest.fn(),
      setWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(concludeRecoverWallet as jest.Mock).mockRejectedValue({
      message: 'concludeRecoverWalletMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() =>
      useMnemonicViewerRecoverWallet(propsMock as unknown as MnemonicViewerRecoverWalletProps['route'])
    )
    await act(async () => {
      await result.current.saveMnemonic()
    })

    expect(concludeRecoverWallet).toHaveBeenCalledWith(
      NETWORKS.LOCALHOST,
      'walletAddressMock',
      'wrappedTransactionMock',
      'signedTransactionMock',
      'nonceMock'
    )

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'concludeRecoverWalletMock',
    })
  })
})
