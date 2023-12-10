import { renderHook, act, fireEvent } from '@testing-library/react-native'
import useMnemonicViewer from '../useMnemonicViewer'
import { setStringAsync } from 'expo-clipboard'
import { FirstAccessContext } from '../../../../context/FirstAccessContext'
import renderWithTheme from '../../../../TestHelper'
import { Button } from 'react-native'
import { MnemonicViewerProps } from '../../../../navigation/FirstAccessStack'
import { requestContractWallet } from '../../../../services/wallet'
import { useContext } from 'react'

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}))
jest.mock('../../../../services/wallet', () => ({
  requestContractWallet: jest.fn(),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

const routeMock = {
  params: {
    mnemonic: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
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
      useMnemonicViewer(routeMock as unknown as MnemonicViewerProps['route'])
    )

    await act(async () => {
      await result.current.copyMnemonicToClipboard()
    })

    expect(setStringAsync).toHaveBeenCalledWith('a b c d e f g h i j')
  })

  it('should finish the first access', async () => {
    ;(requestContractWallet as jest.Mock).mockResolvedValueOnce({
      address: '0x123',
    })

    const getEOAAddressMock = jest.fn().mockReturnValue('0x123')
    const toggle = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: getEOAAddressMock,
      setWalletContractAddress: jest.fn(),
      toggleFirstAccess: toggle,
    })

    const MockComponent = () => {
      const { finishFirstAccess } = useMnemonicViewer(
        routeMock as unknown as MnemonicViewerProps['route']
      )

      return <Button onPress={finishFirstAccess} title={'Finish'} />
    }

    const tree = renderWithTheme(
      <FirstAccessContext.Provider
        value={{ isFirstAccess: false, toggleFirstAccess: toggle }}
      >
        <MockComponent />
      </FirstAccessContext.Provider>
    )

    await act(async () => {
      const button = await tree.findByRole('button')
      fireEvent.press(button)
    })

    expect(requestContractWallet).toHaveBeenCalledWith('0x123')
    expect(getEOAAddressMock).toHaveBeenCalled()
    expect(toggle).toHaveBeenCalled()
  })

  it('should not toggle if error', async () => {
    ;(requestContractWallet as jest.Mock).mockRejectedValue('error')
    const spyConsoleError = jest.spyOn(console, 'error').mockImplementation()
    const getEOAAddressMock = jest.fn().mockReturnValue('0x123')
    const toggle = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      getEOAAddress: getEOAAddressMock,
      setWalletContractAddress: jest.fn(),
      toggleFirstAccess: toggle,
    })

    const MockComponent = () => {
      const { finishFirstAccess } = useMnemonicViewer(
        routeMock as unknown as MnemonicViewerProps['route']
      )

      return <Button onPress={finishFirstAccess} title={'Finish'} />
    }

    const tree = renderWithTheme(
      <FirstAccessContext.Provider
        value={{ isFirstAccess: false, toggleFirstAccess: toggle }}
      >
        <MockComponent />
      </FirstAccessContext.Provider>
    )

    await act(async () => {
      const button = await tree.findByRole('button')
      fireEvent.press(button)
    })

    expect(requestContractWallet).toHaveBeenCalledWith('0x123')
    expect(getEOAAddressMock).toHaveBeenCalled()
    expect(toggle).not.toHaveBeenCalled()
    expect(spyConsoleError).toHaveBeenCalledWith('error')
  })
})
