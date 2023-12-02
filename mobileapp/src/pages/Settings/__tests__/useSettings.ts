import { renderHook, act } from '@testing-library/react-native'
import useSettings from '../useSettings'
import { useContext } from 'react'

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
})
