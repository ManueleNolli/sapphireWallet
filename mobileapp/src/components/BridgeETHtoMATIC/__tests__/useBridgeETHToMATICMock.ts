import { useContext } from 'react'
import { NETWORKS } from '../../../constants/Networks'
import { getSigner } from '../../../services/wallet'
import { requestETHBridgeCall } from '../../../services/transactions'
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
  requestETHBridgeCall: jest.fn(),
}))

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

describe('useBridgeETHToMATICMock hook', () => {
  it('should bridge MATIC transaction', async () => {
    const getPrivateKeyMock = jest.fn().mockResolvedValue('getPrivateKeyMock')
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: getPrivateKeyMock,
      currentNetwork: NETWORKS.LOCALHOST,
    })
    ;(getSigner as jest.Mock).mockReturnValueOnce('signer')
    ;(requestETHBridgeCall as jest.Mock).mockReturnValueOnce('requestETHBridgeCallMock')
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeETHtoMATIC({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestETHBridgeCall).toHaveBeenCalledWith('address', 'address', NaN, 'signer', NETWORKS.LOCALHOST)

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
    ;(requestETHBridgeCall as jest.Mock).mockRejectedValue({
      message: 'requestETHBridgeCallMock',
    })
    ;(Toast.show as jest.Mock).mockReturnValueOnce('Toast.showMock')

    const close = jest.fn((needRefresh: boolean) => needRefresh)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useBridgeETHtoMATIC({ address: 'address', close }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.sendBridgeTransaction()
    })

    expect(getSigner).toHaveBeenCalledWith('getPrivateKeyMock', NETWORKS.LOCALHOST)
    expect(requestETHBridgeCall).toHaveBeenCalledWith('address', 'address', NaN, 'signer', NETWORKS.LOCALHOST)

    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Transaction failed! 😢',
      text2: 'requestETHBridgeCallMock',
    })

    expect(close).toHaveBeenCalledWith(false)
  })
})
