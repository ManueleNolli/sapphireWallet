import { useContext, useEffect, useState } from 'react'
import { BlockchainContext } from '../../context/BlockchainContext'
import { WalletContext } from '../../context/WalletContext'
import useLoading from '../../hooks/useLoading'
import { OwnedNFT, ownedNFTs } from '../../services/blockchain'
import { NETWORKS } from '../../constants/Networks'
import {
  LOCALHOST_SAPPHIRE_NFTS_ADDRESS,
  SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
} from '@env'

export default function useNFTs() {
  const { currentNetwork, ethersProvider } = useContext(BlockchainContext)
  const { getWalletContractAddress } = useContext(WalletContext)
  const { isLoading, setIsLoading } = useLoading(false)
  const {isLoading: isRefreshing, setIsLoading : setRefreshing} = useLoading(false)

  const [nfts, setNFTs] = useState<OwnedNFT[]>([])

  const getNFTs = async () => {
    let nfts = await ownedNFTs(
      getWalletContractAddress(),
      currentNetwork === NETWORKS.LOCALHOST
        ? LOCALHOST_SAPPHIRE_NFTS_ADDRESS
        : SEPOLIA_SAPPHIRE_NFTS_ADDRESS,
      ethersProvider,
      currentNetwork
    )

    return nfts
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
    refreshNFTs
  }
}
