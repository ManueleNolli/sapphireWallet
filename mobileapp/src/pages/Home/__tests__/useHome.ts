import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import useHome from '../useHome'
import { getBalance } from '../../../services/transactions/Balance'
import { setStringAsync } from 'expo-clipboard'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}))
jest.mock('../../../services/transactions/Balance')

describe('useHome', () => {
  it('getBalance at start up', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue(1000000000000000000n)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    expect(resultHook.current.balance).toBe('1.0')
  })

  it('should copy address to clipboard', async () => {
    ;(setStringAsync as jest.Mock).mockResolvedValueOnce(undefined)
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.copyAddressToClipboard()
    })

    expect(setStringAsync).toHaveBeenCalledWith('0x123')
  })

  it('call closeSendETHModal', async () => {
    ;(setStringAsync as jest.Mock).mockResolvedValueOnce(undefined)
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue(1000000000000000000n)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.closeSendETHModal(true)
    })

    expect(getBalance).toHaveBeenCalled()
  })

  it('call onRefresh', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue(1000000000000000000n)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    expect(getBalance).toHaveBeenCalledTimes(5)

    await act(async () => {
      await resultHook.current.onRefresh()
    })

    expect(getBalance).toHaveBeenCalledTimes(6)

  })

    it('call backdrp', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue(1000000000000000000n)

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.modalReceiveBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendNFTBackdrop()
    })

    await act(async () => {
      await resultHook.current.closeSendNFTModal()
    })

    expect(resultHook.current.isReceiveModalVisible).toBe(false)
    expect(resultHook.current.isSendETHModalVisible).toBe(false)
    expect(resultHook.current.isSendNFTModalVisible).toBe(false)
  })
})
