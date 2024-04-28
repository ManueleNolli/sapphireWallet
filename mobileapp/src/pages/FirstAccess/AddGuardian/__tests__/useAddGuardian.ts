import { renderHook, act } from '@testing-library/react-native'
import { AddGuardianProps } from '../../../../navigation/FirstAccessStack'
import { requestContractWallet } from '../../../../services/wallet'
import { useContext } from 'react'
import { NETWORKS } from '../../../../constants/Networks'
import useAddGuardian from '../useAddGuardian'
import { ZeroAddress } from 'ethers'
import Toast from 'react-native-toast-message'

jest.mock('../../../../services/wallet', () => ({
  requestContractWallet: jest.fn(),
}))
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

const goBackMock = jest.fn()
const navigationMock = {
  goBack: goBackMock,
}

describe('useAddGuardian', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should set value address when qrcode finished', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.LOCALHOST,
      toggleFirstAccess: jest.fn(),
    })

    const { result } = renderHook(() => useAddGuardian(navigationMock as unknown as AddGuardianProps['navigation']))

    await act(async () => {
      result.current.QRCodeFinishedScanning('dataexample')
    })

    expect(result.current.valueAddress).toBe('dataexample')
    expect(result.current.isQRCodeScanning).toBe(false)
  })

  it('Should call finishFirstAccess via skipGuardian', async () => {
    const mockSetWalletContractAddress = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.LOCALHOST,
      toggleFirstAccess: jest.fn(),
      getEOAAddress: jest.fn().mockReturnValue('mockEOAAddress'),
      setWalletContractAddress: mockSetWalletContractAddress,
    })
    ;(requestContractWallet as jest.Mock).mockResolvedValueOnce({
      address: '0x123',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() => useAddGuardian(navigationMock as unknown as AddGuardianProps['navigation']))

    await act(async () => {
      result.current.skipGuardian()
    })

    expect(requestContractWallet).toHaveBeenCalledWith(NETWORKS.LOCALHOST, 'mockEOAAddress', ZeroAddress)
    expect(mockSetWalletContractAddress).toHaveBeenCalledWith('0x123')

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Account created! 👛',
    })
  })

  it('Should call finishFirstAccess via withGuardian', async () => {
    const mockSetWalletContractAddress = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.LOCALHOST,
      toggleFirstAccess: jest.fn(),
      getEOAAddress: jest.fn().mockReturnValue('mockEOAAddress'),
      setWalletContractAddress: mockSetWalletContractAddress,
    })
    ;(requestContractWallet as jest.Mock).mockResolvedValueOnce({
      address: '0x123',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() => useAddGuardian(navigationMock as unknown as AddGuardianProps['navigation']))

    await act(async () => {
      result.current.setValueAddress('0x321')
    })

    await act(async () => {
      result.current.withGuardian()
    })

    expect(requestContractWallet).toHaveBeenCalledWith(NETWORKS.LOCALHOST, 'mockEOAAddress', '0x321')
    expect(mockSetWalletContractAddress).toHaveBeenCalledWith('0x123')

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Account created! 👛',
    })
  })

  it('Should handle finishFirstAccessErrors', async () => {
    const mockSetWalletContractAddress = jest.fn()
    ;(useContext as jest.Mock).mockReturnValue({
      currentNetwork: NETWORKS.LOCALHOST,
      toggleFirstAccess: jest.fn(),
      getEOAAddress: jest.fn().mockReturnValue('mockEOAAddress'),
      setWalletContractAddress: mockSetWalletContractAddress,
    })
    ;(requestContractWallet as jest.Mock).mockRejectedValue({
      message: 'requestContractWalletMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const { result } = renderHook(() => useAddGuardian(navigationMock as unknown as AddGuardianProps['navigation']))

    await act(async () => {
      result.current.skipGuardian()
    })

    expect(requestContractWallet).toHaveBeenCalledWith(NETWORKS.LOCALHOST, 'mockEOAAddress', ZeroAddress)
    expect(mockSetWalletContractAddress).toHaveBeenCalledTimes(0)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestContractWalletMock',
    })

    expect(goBackMock).toHaveBeenCalledTimes(1)
  })
})
