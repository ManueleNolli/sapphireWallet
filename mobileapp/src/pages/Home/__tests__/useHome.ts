import { useContext } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import useHome from '../useHome'
import { getBalance, getNFTBalance } from '../../../services/balances'
import { setStringAsync } from 'expo-clipboard'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}))

jest.mock('../../../services/balances')

describe('useHome', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('getBalance at start up', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue({
      sepolia: {
        balance: '1000000000000000000',
        chainID: '1',
        crypto: 'ETH',
      },
    })
    ;(getNFTBalance as jest.Mock).mockResolvedValue({
      sepolia: 0,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    const expectedBalances = {
      sepolia: {
        balance: '1.0',
        chainID: '1',
        crypto: 'ETH',
      },
    }

    expect(resultHook.current.balances).toEqual(expectedBalances)
  })

  it('should copy address to clipboard', async () => {
    ;(getBalance as jest.Mock).mockReturnValue({
      sepolia: {
        balance: '0',
        chainID: '1',
        crypto: 'ETH',
      },
    })
    ;(getNFTBalance as jest.Mock).mockResolvedValue({
      sepolia: 0,
    })
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

  it('call onRefresh', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValueOnce({
      sepolia: {
        balance: '1000000000000000000',
        chainID: '1',
        crypto: 'ETH',
      },
    })
    ;(getBalance as jest.Mock).mockReturnValueOnce({
      sepolia: {
        balance: '2000000000000000000',
        chainID: '1',
        crypto: 'ETH',
      },
    })
    ;(getNFTBalance as jest.Mock).mockResolvedValueOnce({
      sepolia: 0,
    })
    ;(getNFTBalance as jest.Mock).mockResolvedValueOnce({
      sepolia: 1,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    expect(getBalance).toHaveBeenCalledTimes(1)
    expect(getNFTBalance).toHaveBeenCalledTimes(1)

    await act(async () => {
      await resultHook.current.onRefresh()
    })

    expect(getBalance).toHaveBeenCalledTimes(2)
    expect(getNFTBalance).toHaveBeenCalledTimes(2)

    expect(resultHook.current.balances).toEqual({
      sepolia: {
        balance: '2.0',
        chainID: '1',
        crypto: 'ETH',
      },
    })

    expect(resultHook.current.balancesNFT).toEqual({
      sepolia: 1,
    })
  })

  it('call modalBackdrops', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      ethersProvider: null,
      getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
    })
    ;(getBalance as jest.Mock).mockReturnValue({
      sepolia: {
        balance: '1000000000000000000',
        chainID: '1',
        crypto: 'ETH',
      },
      amoy: {
        balance: '1000000000000000000',
        chainID: '1',
        crypto: 'MATIC',
      },
    })
    ;(getNFTBalance as jest.Mock).mockResolvedValueOnce({
      sepolia: 1,
    })

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useHome())
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.modalReceiveBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendETHBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendMATICBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalBridgeETHtoMATICBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendEthereumNFTBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalSendPolygonNFTBackdrop()
    })

    await act(async () => {
      await resultHook.current.modalBridgeNFTBackdrop()
    })

    expect(resultHook.current.isReceiveModalVisible).toBe(false)
    expect(resultHook.current.isSendETHModalVisible).toBe(false)
    expect(resultHook.current.isSendMATICModalVisible).toBe(false)
    expect(resultHook.current.isBridgeETHtoMATICModalVisible).toBe(false)
    expect(resultHook.current.isSendEthereumNFTModalVisible).toBe(false)
    expect(resultHook.current.isSendPolygonNFTModalVisible).toBe(false)
    expect(resultHook.current.isBridgeNFTModalVisible).toBe(false)
  })

  describe('closeModal', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      ;(setStringAsync as jest.Mock).mockResolvedValueOnce(undefined)
      ;(useContext as jest.Mock).mockReturnValue({
        ethersProvider: null,
        getWalletContractAddress: jest.fn().mockReturnValue('0x123'),
      })
      ;(getBalance as jest.Mock).mockReturnValueOnce({
        sepolia: {
          balance: '1000000000000000000',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '1000000000000000000',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
      ;(getBalance as jest.Mock).mockReturnValueOnce({
        sepolia: {
          balance: '2000000000000000000',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '2000000000000000000',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
      ;(getNFTBalance as jest.Mock).mockResolvedValueOnce({
        sepolia: 0,
      })
      ;(getNFTBalance as jest.Mock).mockResolvedValueOnce({
        sepolia: 1,
      })
    })

    it('call closeSendETHModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeSendETHModal(true)
      })

      expect(getBalance).toHaveBeenCalled()

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '2.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '2.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })

    it('call closeBridgeETHtoMATICModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeBridgeETHtoMATICModal(true)
      })

      expect(getBalance).toHaveBeenCalled()

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '2.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '2.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })

    it('call closeSendMATICModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeSendMATICModal(true)
      })

      expect(getBalance).toHaveBeenCalled()

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '2.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '2.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })

    it('call closeSendEthereumNFTModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeSendEthereumNFTModal()
      })

      expect(getBalance).toHaveBeenCalledTimes(1)

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '1.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '1.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })

    it('call closeSendPolygonNFTModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeSendPolygonNFTModal()
      })

      expect(getBalance).toHaveBeenCalledTimes(1)

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '2.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '2.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })

    it('call closeBridgeNFTModal', async () => {
      let resultHook: any
      await waitFor(async () => {
        const { result } = renderHook(() => useHome())
        resultHook = result
      })

      await act(async () => {
        await resultHook.current.closeBridgeNFTModal()
      })

      expect(getBalance).toHaveBeenCalledTimes(1)

      expect(resultHook.current.balances).toEqual({
        sepolia: {
          balance: '1.0',
          chainID: '1',
          crypto: 'ETH',
        },
        amoy: {
          balance: '1.0',
          chainID: '1',
          crypto: 'MATIC',
        },
      })
    })
  })
})
