import { renderHook, act } from '@testing-library/react-native'
import useSettings from '../useSettings'
import { useContext } from 'react'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

describe('useSettings hook', () => {
  it('should toggle theme without Icon ref', async () => {
    const toggleThemeMock = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: toggleThemeMock,
      toggleFirstAccess: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.toggleThemeWithAnimation()
    })

    expect(toggleThemeMock).toHaveBeenCalled()
  })

  it('should toggle theme with Icon ref', async () => {
    const toggleThemeMock = jest.fn()
    const startAnimationMock = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: toggleThemeMock,
      toggleFirstAccess: jest.fn(),
    })

    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.themeIconRef.current = {
        startAnimation: startAnimationMock,
      } as any
      result.current.toggleThemeWithAnimation()
    })

    expect(toggleThemeMock).toHaveBeenCalled()
    expect(startAnimationMock).toHaveBeenCalled()
  })

  it('network select should call setEthersProvider', async () => {
    const toggleThemeMock = jest.fn()
    const setEthersProviderMock = jest.fn()
    const currentNetworkMock = NETWORKS.LOCALHOST
    ;(useContext as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: toggleThemeMock,
      toggleFirstAccess: jest.fn(),
      currentNetwork: currentNetworkMock,
      setEthersProvider: setEthersProviderMock,
    })

    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.onNetworkSelect(0)
    })

    expect(setEthersProviderMock).toHaveBeenCalledWith('localhost')
  })

  it('should reset local wallet', async () => {
    const resetWalletMock = jest.fn()
    const toggleFirstAccessMock = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      theme: 'light',
      resetWallet: resetWalletMock,
      toggleFirstAccess: toggleFirstAccessMock,
    })

    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.resetLocalWallet()
    })

    expect(resetWalletMock).toHaveBeenCalled()
    expect(toggleFirstAccessMock).toHaveBeenCalled()
  })

  it('should toggle guardians refresh', async () => {
    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.setGuardiansRefresh()
    })

    expect(result.current.guardiansRefresh).toBe(true)
  })

  it('should toggle recover as guardian refresh', async () => {
    const { result } = renderHook(() => useSettings())

    await act(() => {
      result.current.setRecoverAsGuardianRefresh()
    })

    expect(result.current.recoverAsGuardianRefresh).toBe(true)
  })
})
