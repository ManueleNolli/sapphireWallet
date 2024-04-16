import { useContext } from 'react'
import { NETWORKS } from '../../../constants/Networks'
import { getSigner } from '../../../services/wallet'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import useSendDestCrypto from '../useSendDestCrypto'
import Toast from 'react-native-toast-message'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../services/wallet', () => ({
  getSigner: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

describe('useSendDestCrypto hook', () => {
  it('should send DestCrypto transaction', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)

    const actionMock = jest.fn().mockResolvedValue('actionMock')
    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() =>
        useSendDestCrypto({ address: 'address', close, cryptoName: 'cryptoName', action: actionMock })
      )
      resultHook = result
    })

    await act(async () => {
      resultHook.current.sendDestCryptoTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(actionMock).toHaveBeenCalledWith('address', '', NaN, 'signer', NETWORKS.LOCALHOST, 'amoy', true)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Transaction sent! 🚀',
    })

    expect(close).toHaveBeenCalledWith(true)
  })

  it('should catch error in transaction', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)
    const actionMock = jest.fn().mockRejectedValue({
      message: 'requesttransferMock',
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() =>
        useSendDestCrypto({ address: 'address', close, cryptoName: 'cryptoName', action: actionMock })
      )
      resultHook = result
    })

    await act(async () => {
      resultHook.current.sendDestCryptoTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(actionMock).toHaveBeenCalledWith('address', '', NaN, 'signer', NETWORKS.LOCALHOST, 'amoy', true)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requesttransferMock',
    })

    expect(close).toHaveBeenCalledWith(false)
  })

  it('should set value address when qrcode finished', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })

    const close = jest.fn((needRefresh: boolean) => needRefresh)
    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() =>
        useSendDestCrypto({ address: 'address', close, cryptoName: 'cryptoName', action: jest.fn() })
      )
      resultHook = result
    })

    await act(async () => {
      resultHook.current.QRCodeFinishedScanning('dataexample')
    })

    expect(resultHook.current.valueAddress).toBe('dataexample')
    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })
})
