import React, { useContext, useEffect } from 'react'
import { ethers, Provider } from 'ethers'
import useLoading from '../hooks/useLoading'
import { BlockchainContext } from '../context/BlockchainContext'
import { getProvider } from '../services/blockchain'
import { NETWORKS } from '../constants/Networks'
import Loading from '../pages/Loading/Loading'

type BlockchainProviderProps = {
  children: React.ReactNode
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading, isError, setIsError } = useLoading(true)

  const [provider, setProvider] = React.useState<Provider | null>(null)
  const [currentNetworkLocal, setCurrentNetwork] =
    React.useState<NETWORKS>(currentNetwork)

  const setEthersProvider = async (network: NETWORKS) => {
    let connectedProvider
    try {
      connectedProvider = await getProvider(network)
      setCurrentNetwork(network)
    } catch (e) {
      setIsError(true)
      console.log('Error connecting to blockchain', e)
    }

    if (connectedProvider) {
      setProvider(connectedProvider)
    }
  }

  useEffect(() => {
    setEthersProvider(currentNetwork).then(() => setIsLoading(false))
  }, [currentNetwork])

  if (isLoading) {
    return <Loading text={'Connecting to blockchain...'} />
  }

  if (isError) {
    return <Loading text={'Error connecting to blockchain'} />
  }

  return (
    <BlockchainContext.Provider
      value={{
        currentNetwork: currentNetworkLocal,
        ethersProvider: provider,
        setEthersProvider,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}
