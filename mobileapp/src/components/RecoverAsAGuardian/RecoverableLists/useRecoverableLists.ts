import { useContext, useEffect, useState } from 'react'
import useLoading from '../../../hooks/useLoading'
import { getGuardianWallets } from '../../../services/transactions'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'

type useRecoverableListsProps = {
  refreshRequest: boolean
}

export default function useRecoverableLists({ refreshRequest }: useRecoverableListsProps) {
  const { getWalletContractAddress } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const [wallets, setWallets] = useState<string[]>([])
  const { isLoading: isFetching, setIsLoading: setIsFetching } = useLoading(true)
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveringWallet, setRecoveringWallet] = useState<string>('')

  useEffect(() => {
    const fetchWallets = async () => {
      setWallets([])
      setWallets(await getGuardianWallets(ethersProvider, currentNetwork, getWalletContractAddress()))
    }

    setIsFetching(true)
    fetchWallets().then(() => setIsFetching(false))
  }, [refreshRequest])

  const startRecovering = (wallet: string) => {
    setIsRecovering(true)
    setRecoveringWallet(wallet)
  }

  return {
    wallets,
    isFetching,
    isRecovering,
    startRecovering,
    recoveringWallet,
    modalBackdrop: () => setIsRecovering(false),
  }
}
