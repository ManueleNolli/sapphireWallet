import { renderHook, act } from '@testing-library/react-native'
import useMnemonicViewerNewWallet from '../useMnemonicViewerNewWallet'
import { setStringAsync } from 'expo-clipboard'
import { useContext } from 'react'
import { MnemonicViewerNewWalletProps } from '../../../../navigation/FirstAccessStack'

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

const pushNagivationMock = jest.fn()
const propsMock = {
  route: {
    params: {
      mnemonic: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    },
  },
  navigation: {
    push: pushNagivationMock,
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
      useMnemonicViewerNewWallet(propsMock as unknown as MnemonicViewerNewWalletProps)
    )

    await act(async () => {
      await result.current.copyMnemonicToClipboard()
    })

    expect(setStringAsync).toHaveBeenCalledWith('a b c d e f g h i j')
  })

  it('should navigate to AddGuardian', async () => {
    ;(setStringAsync as jest.Mock).mockResolvedValueOnce(undefined)
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: jest.fn(),
      setWalletContractAddress: jest.fn(),
    })
    const { result } = renderHook(() =>
      useMnemonicViewerNewWallet(propsMock as unknown as MnemonicViewerNewWalletProps)
    )
    await act(async () => {
      await result.current.saveMnemonic()
    })

    expect(pushNagivationMock).toHaveBeenCalledWith('AddGuardian')
  })
})
