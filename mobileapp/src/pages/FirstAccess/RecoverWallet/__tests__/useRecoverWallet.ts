import { useContext } from 'react'
import { act, renderHook } from '@testing-library/react-native'
import { RecoverWalletProps } from '../../../../navigation/FirstAccessStack'
import useRecoverWallet from '../useRecoverWallet'
import { JSONToRecoverWallet } from '../../../../types/RecoverWallet'
import Toast from 'react-native-toast-message'
import { getMnemonic } from '../../../../services/wallet'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

jest.mock('../../../../types/RecoverWallet', () => ({
  JSONToRecoverWallet: jest.fn(),
}))

jest.mock('../../../../services/wallet', () => ({
  getMnemonic: jest.fn(),
}))

jest.mock('ethers', () => ({
  HDNodeWallet: {
    fromMnemonic: jest.fn().mockReturnValue({
      address: 'EOAAddressMock',
      privateKey: 'privateKeyMock',
    }),
  },
  Mnemonic: {
    fromPhrase: jest.fn().mockReturnValue('mnemonicMock'),
  },
}))

const navigationMock = jest.fn()

const propsMock = {
  route: {},
  navigation: {
    push: navigationMock,
  },
}

describe('useRecoverWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to MnemonicViewerRecoverWallet', async () => {
    const setPrivateKeyMock = jest.fn()
    const setEOAAddressMock = jest.fn()
    const setWalletContractAddressMock = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      setPrivateKey: setPrivateKeyMock,
      setEOAAddress: setEOAAddressMock,
      setWalletContractAddress: setWalletContractAddressMock,
    })
    ;(JSONToRecoverWallet as jest.Mock).mockReturnValueOnce({
      walletAddress: 'walletAddressMock',
      chainID: 'chainIDMock',
      nonce: 'nonceMock',
      wrappedTransaction: 'wrappedTransactionMock',
      signedTransaction: 'signedTransactionMock',
      mnemonic: ['mnemonicMock'],
    })
    ;(getMnemonic as jest.Mock).mockReturnValueOnce(['mnemonicMock1'])

    const { result } = renderHook(() => useRecoverWallet(propsMock as unknown as RecoverWalletProps))

    await act(async () => {
      await result.current.onQrCodeScanned('data')
    })

    expect(setPrivateKeyMock).toHaveBeenCalledWith('privateKeyMock')
    expect(setEOAAddressMock).toHaveBeenCalledWith('EOAAddressMock')
    expect(setWalletContractAddressMock).toHaveBeenCalledWith('walletAddressMock')

    expect(navigationMock).toHaveBeenCalledWith('MnemonicViewerRecoverWallet', {
      mnemonic: ['mnemonicMock1'],
      data: {
        walletAddress: 'walletAddressMock',
        chainID: 'chainIDMock',
        nonce: 'nonceMock',
        wrappedTransaction: 'wrappedTransactionMock',
        signedTransaction: 'signedTransactionMock',
        mnemonic: ['mnemonicMock'],
      },
    })
  })

  it('should manage qrcore invalid scan', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      setPrivateKey: jest.fn(),
      setEOAAddress: jest.fn(),
      setWalletContractAddress: jest.fn(),
    })
    ;(JSONToRecoverWallet as jest.Mock).mockImplementation(() => {
      throw new Error()
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() => useRecoverWallet(propsMock as unknown as RecoverWalletProps))

    await act(async () => {
      await result.current.onQrCodeScanned('data')
    })

    expect(navigationMock).not.toHaveBeenCalled()

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Invalid QR code 🚨',
      text2: 'The QR code you scanned is not valid',
    })
  })

  it('Should close the modal', async () => {
    const { result } = renderHook(() => useRecoverWallet(propsMock as unknown as RecoverWalletProps))

    await act(async () => {
      await result.current.closeModal()
    })

    expect(result.current.isScannedOpen).toBe(false)
  })

  it('Should open the modal', async () => {
    const { result } = renderHook(() => useRecoverWallet(propsMock as unknown as RecoverWalletProps))

    await act(async () => {
      await result.current.openModal()
    })

    expect(result.current.isScannedOpen).toBe(true)
  })
})
