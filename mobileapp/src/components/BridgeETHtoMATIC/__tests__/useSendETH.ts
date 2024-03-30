import { useContext } from 'react'
import { NETWORKS } from '../../../constants/Networks'
import { getSigner } from '../../../services/wallet'
import { requestETHTransfer } from '../../../services/transactions'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import useBridgeETHtoMATIC from '../useBridgeETHtoMATIC'
import Toast from 'react-native-toast-message'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../services/wallet', () => ({
  getSigner: jest.fn(),
}))

jest.mock('../../../services/transactions', () => ({
  requestETHTransfer: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

describe('useSendETH hook', () => {
  it('should send ETH transaction', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestETHTransfer as jest.Mock).mockReturnValueOnce('requestETHTransferMock')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeETHtoMATIC({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.sendETHTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestETHTransfer).toHaveBeenCalledWith('address', '', NaN, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Transaction sent! 🚀',
    })

    expect(close).toHaveBeenCalledWith(true)
  })

  it('should catch error in ETH transaction', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestETHTransfer as jest.Mock).mockRejectedValue({
      message: 'requestETHTransferMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeETHtoMATIC({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.sendETHTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestETHTransfer).toHaveBeenCalledWith('address', '', NaN, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestETHTransferMock',
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
      const { result } = renderHook(() => useBridgeETHtoMATIC({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      resultHook.current.QRCodeFinishedScanning('dataexample')
    })

    expect(resultHook.current.valueAddress).toBe('dataexample')
    expect(resultHook.current.isQRCodeScanning).toBe(false)
  })
})
