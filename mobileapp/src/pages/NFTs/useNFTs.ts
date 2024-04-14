import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import useLoading from '../../hooks/useLoading'
import { OwnedNFT, ownedNFTs } from '../../services/blockchain'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'

export default function useNFTs() {
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const { isLoading, setIsLoading } = useLoading(false)
  const { isLoading: isRefreshing, setIsLoading: setRefreshing } = useLoading(false)

  const [nfts, setNFTs] = useState<OwnedNFT[]>([])

  const getNFTs = async () => {
    const currentNetworkNFTs = await ownedNFTs(getWalletContractAddress(), currentNetwork)
    const amoyNFTs = await ownedNFTs(getWalletContractAddress(), BRIDGE_NETWORKS.AMOY)
    return currentNetworkNFTs.concat(amoyNFTs)
  }

  const refreshNFTs = async () => {
    setRefreshing(true)
    let nfts = await getNFTs()
    setNFTs(nfts)
    setRefreshing(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getNFTs()
      .then((nfts) => {
        setNFTs(nfts)
      })
      .catch((err) => setNFTs([]))
      .finally(() => setIsLoading(false))
  }, [ethersProvider])

  return {
    isLoading,
    nfts,
    isRefreshing,
    refreshNFTs,
  }
}
