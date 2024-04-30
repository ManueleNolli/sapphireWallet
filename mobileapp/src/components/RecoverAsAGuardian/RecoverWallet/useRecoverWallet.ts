import { useContext, useState } from 'react'
import useLoading from '../../../hooks/useLoading'
import { RecoverWallet, RecoverWalletToJSON } from '../../../types/RecoverWallet'
import { prepareRecoverWallet } from '../../../services/transactions'
import { createWallet, getSigner } from '../../../services/wallet'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'

type useRecoverWalletProps = {
  wallet: string
}

export function useRecoverWallet({ wallet }: useRecoverWalletProps) {
  const { getPrivateKey } = useContext(WalletContext)
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading } = useLoading()
  const [recoverWalletInfo, setRecoverWalletInfo] = useState<string | undefined>()

  const prepareTransactionAndShowQrCode = async () => {
    setIsLoading(true)
    const signer = await getSigner(await getPrivateKey('Confirm recovery by signing the transaction'), currentNetwork)
    const newWallet = createWallet()
    const data = await prepareRecoverWallet(signer, currentNetwork, wallet, newWallet)
    const dataString = RecoverWalletToJSON(data)
    setRecoverWalletInfo(dataString)
    setIsLoading(false)
  }

  return {
    isLoading,
    prepareTransactionAndShowQrCode,
    recoverWalletInfo,
  }
}
