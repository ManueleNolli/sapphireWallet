import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import useQRCodeScanner from '../useQRCodeScanner'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('expo-barcode-scanner', () => ({
  ...jest.requireActual('expo-barcode-scanner'),
  BarCodeScanner: {
    requestPermissionsAsync: jest.fn(),
  },
}))

describe('useQRCodeScanner hook', () => {
  it('should handle bar code scanned', async () => {
    const onQRCodeScanned = jest.fn()
    const requestPermissionsAsync = jest
      .fn()
      .mockResolvedValue({ status: 'granted' })
    const handleBarCodeScanned = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      scanned: false,
      handleBarCodeScanned,
    })
    ;(BarCodeScanner.requestPermissionsAsync as jest.Mock).mockImplementation(
      requestPermissionsAsync
    )
    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useQRCodeScanner({ onQRCodeScanned }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.handleBarCodeScanned({ data: 'data' })
    })
    expect(onQRCodeScanned).toHaveBeenCalledWith('data')
    expect(resultHook.current.scanned).toBe(true)
  })
})
