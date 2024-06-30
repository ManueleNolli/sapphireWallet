import { renderHook, act } from '@testing-library/react-native'
import { useContext } from 'react'
import { IndexPath } from '@ui-kitten/components'
import useNetworkSelector from '../useNetworkSelector'
import { NETWORKS } from '../../../constants/Networks'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

describe('useNetworkSelector hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should select network', async () => {
    const setEthersProviderMock = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      setEthersProvider: setEthersProviderMock,
    })

    const { result } = renderHook(() => useNetworkSelector({ onChainChange: jest.fn() }))

    await act(async () => {
      result.current.onNetworkSelect(new IndexPath(1))
    })
  })
  it('should select network with Array', async () => {
    const setEthersProviderMock = jest.fn()

    ;(useContext as jest.Mock).mockReturnValue({
      setEthersProvider: setEthersProviderMock,
    })

    const { result } = renderHook(() => useNetworkSelector({ onChainChange: jest.fn() }))

    const IndexPathArray = [new IndexPath(1)]

    await act(async () => {
      result.current.onNetworkSelect(IndexPathArray)
    })

    expect(setEthersProviderMock).toHaveBeenCalledWith(NETWORKS.SEPOLIA)
  })
})
