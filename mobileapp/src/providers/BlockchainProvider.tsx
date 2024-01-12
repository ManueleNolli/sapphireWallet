import React, { useContext, useEffect } from 'react'
import { Provider } from 'ethers'
import useLoading from '../hooks/useLoading'
import { BlockchainContext } from '../context/BlockchainContext'
import { getProvider } from '../services/blockchain'
import { NETWORKS } from '../constants/Networks'
import Loading from '../pages/Loading/Loading'
import Error from '../pages/Error/Error'

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
      console.error('Error connecting to blockchain')
    }

    if (connectedProvider) {
      setProvider(connectedProvider)
    }
  }

  useEffect(() => {
    setEthersProvider(currentNetwork).then(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <Loading text={'Connecting to blockchain...'} />
  }

  if (isError) {
    return <Error text={'Error connecting to blockchain'} />
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
