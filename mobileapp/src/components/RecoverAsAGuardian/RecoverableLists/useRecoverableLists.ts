import { useContext, useEffect, useState } from 'react'
import useLoading from '../../../hooks/useLoading'
import { getGuardians, getGuardianWallets } from '../../../services/transactions'
import { WalletContext } from '../../../context/WalletContext'
import { BlockchainContext } from '../../../context/BlockchainContext'

export function useRecoverableLists() {
  const { getWalletContractAddress } = useContext(WalletContext)
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const [wallets, setWallets] = useState<string[]>([])
  const { isLoading: isFetching, setIsLoading: setIsFetching } = useLoading(true)
  const [isRecovering, setIsRecovering] = useState(false)
  const [recoveringWallet, setRecoveringWallet] = useState<string>('')

  useEffect(() => {
    const fetchWallets = async () => {
      setWallets(await getGuardianWallets(ethersProvider, currentNetwork, getWalletContractAddress()))
    }
    fetchWallets()
    setIsFetching(false)
  }, [])

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
