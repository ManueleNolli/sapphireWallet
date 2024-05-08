import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useContext } from 'react'
import { NETWORKS } from '../../../constants/Networks'
import useGuardiansManager from '../useGuardiansManager'
import { addGuardian, getGuardians, removeGuardian } from '../../../services/transactions'
import { getSigner } from '../../../services/wallet'
import Toast from 'react-native-toast-message'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../services/transactions/', () => ({
  getGuardians: jest.fn(),
  addGuardian: jest.fn(),
  removeGuardian: jest.fn(),
}))

jest.mock('../../../services/wallet', () => ({
  getSigner: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

describe('useGuardiansManager hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should select fetch guardians at start up', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })
    ;(getGuardians as jest.Mock).mockResolvedValue(['guardian1', 'guardian2'])

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    expect(resultHook.current.guardians).toEqual(['guardian1', 'guardian2'])

    expect(getGuardians).toHaveBeenCalledTimes(1)
  })

  it('should add a guardian', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })

    const newGuardian = '0x1234567890'

    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1', 'guardian2'])
    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1', 'guardian2', newGuardian])
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    act(() => {
      resultHook.current.setValueAddress(newGuardian)
    })

    await waitFor(async () => {
      act(() => {
        resultHook.current.sendAddGuardian()
      })
    })

    expect(resultHook.current.guardians).toEqual(['guardian1', 'guardian2', '0x1234567890'])

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Guardian Added! 🛡️',
    })
  })

  it('should handle add guardian fail', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })

    const newGuardian = '0x1234567890'

    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1', 'guardian2'])
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')
    ;(addGuardian as jest.Mock).mockRejectedValueOnce({
      message: 'erroraddGuardian',
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    act(() => {
      resultHook.current.setValueAddress(newGuardian)
    })

    await waitFor(async () => {
      act(() => {
        resultHook.current.sendAddGuardian()
      })
    })

    expect(resultHook.current.guardians).toEqual(['guardian1', 'guardian2'])

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'erroraddGuardian',
    })
  })

  it('should remove a guardian', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })
    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1', 'guardian2'])
    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1'])
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    await waitFor(async () => {
      act(() => {
        resultHook.current.sendRemoveGuardian('guardian2')
      })
    })

    expect(resultHook.current.guardians).toEqual(['guardian1'])

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Guardian Removed! 🧹️',
    })
  })

  it('should handle remove guardian fail', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })
    ;(getGuardians as jest.Mock).mockResolvedValueOnce(['guardian1', 'guardian2'])
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')
    ;(removeGuardian as jest.Mock).mockRejectedValueOnce({
      message: 'errorremoveGuardian',
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    await waitFor(async () => {
      act(() => {
        resultHook.current.sendRemoveGuardian('guardian2')
      })
    })

    expect(resultHook.current.guardians).toEqual(['guardian1', 'guardian2'])

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'errorremoveGuardian',
    })
  })

  it('should set value address when qrcode finished', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.QRCodeFinishedScanning('dataexample')
    })

    expect(resultHook.current.valueAddress).toBe('dataexample')
    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })

  it('should close qrCode if closeQrCodeScanner is called', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      getPrivateKey: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: jest.fn(),
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useGuardiansManager({ refreshRequest: false }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.closeQRCodeScanner()
    })

    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })
})
