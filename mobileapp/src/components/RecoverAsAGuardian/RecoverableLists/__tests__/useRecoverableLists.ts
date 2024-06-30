import { NETWORKS } from '../../../../constants/Networks'
import { useContext } from 'react'
import { getGuardianWallets } from '../../../../services/transactions'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import useRecoverableLists from '../useRecoverableLists'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../../services/transactions', () => ({
  getGuardianWallets: jest.fn(),
}))

describe('useRecoverableLists', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch wallets at start up', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getGuardianWallets as jest.Mock).mockResolvedValueOnce(['wallet1', 'wallet2'])

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useRecoverableLists({ refreshRequest: false }))
      resultHook = result
    })

    expect(resultHook.current.wallets).toEqual(['wallet1', 'wallet2'])
  })

  it('should start recovering a wallet', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getGuardianWallets as jest.Mock).mockResolvedValueOnce(['wallet1', 'wallet2'])

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useRecoverableLists({ refreshRequest: false }))
      resultHook = result
    })

    await act(async () => {
      await resultHook.current.startRecovering('wallet1')
    })

    expect(resultHook.current.isRecovering).toBeTruthy()
    expect(resultHook.current.recoveringWallet).toEqual('wallet1')
  })

  it('should close the modal', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getWalletContractAddress: jest.fn(),
      currentNetwork: NETWORKS.LOCALHOST,
      ethersProvider: 'ethersProvider',
    })
    ;(getGuardianWallets as jest.Mock).mockResolvedValueOnce(['wallet1', 'wallet2'])

    let resultHook: any
    await waitFor(async () => {
      const { result } = renderHook(() => useRecoverableLists({ refreshRequest: false }))
      resultHook = result
    })
    await act(async () => {
      await resultHook.current.modalBackdrop()
    })

    expect(resultHook.current.isRecovering).toBeFalsy()
  })
})
