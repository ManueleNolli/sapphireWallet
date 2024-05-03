import useRecoverWallet from '../useRecoverWallet'
import { useContext } from 'react'
import { createWallet, getSigner } from '../../../../services/wallet'
import { prepareRecoverWallet } from '../../../../services/transactions'
import { act, renderHook } from '@testing-library/react-native'
import { RecoverWalletToJSON } from '../../../../types/RecoverWallet'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}))

jest.mock('../../../../services/transactions', () => ({
  prepareRecoverWallet: jest.fn(),
}))

jest.mock('../../../../types/RecoverWallet', () => ({
  RecoverWalletToJSON: jest.fn(),
}))

jest.mock('../../../../services/wallet', () => ({
  createWallet: jest.fn(),
  getSigner: jest.fn(),
}))

describe('useRecoverWallet', () => {
  it('should prepare transaction and show qr code', async () => {
    ;(useContext as jest.Mock).mockReturnValue({
      getPrivateKey: jest.fn().mockResolvedValueOnce('privateKey'),
    })
    ;(getSigner as jest.Mock).mockResolvedValueOnce('signer')
    ;(createWallet as jest.Mock).mockReturnValue('newWallet')
    ;(prepareRecoverWallet as jest.Mock).mockResolvedValueOnce('data')
    ;(RecoverWalletToJSON as jest.Mock).mockReturnValue('RecoverWalletToJSON')

    const { result } = renderHook(() => useRecoverWallet({ wallet: 'wallet' }))

    await act(async () => {
      await result.current.prepareTransactionAndShowQrCode()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.recoverWalletInfo).toBe('RecoverWalletToJSON')
  })
})
