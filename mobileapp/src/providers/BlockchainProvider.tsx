import React, { useContext, useEffect } from 'react'
import { Provider } from 'ethers'
import useLoading from '../hooks/useLoading'
import { BlockchainContext } from '../context/BlockchainContext'
import { getProvider } from '../services/blockchain'
import { NETWORKS } from '../constants/Networks'
import Loading from '../pages/Loading/Loading'
import Error from '../pages/Error/Error'
import { getData, storeData } from '../services/storage'
import constants from '../constants/Constants'

type BlockchainProviderProps = {
  children: React.ReactNode
}

export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const { currentNetwork } = useContext(BlockchainContext)
  const { isLoading, setIsLoading, isError, setIsError } = useLoading(true)

  const [provider, setProvider] = React.useState<Provider | null>(null)
  const [currentNetworkLocal, setCurrentNetwork] =
    React.useState<NETWORKS>(currentNetwork)

  // load in local state for performance
  useEffect(() => {
    const initialiseCurrentNetwork = async () => {
      const currentNetwork = await getData(
        constants.asyncStoreKeys.currentNetwork
      )
      // if not null check if NETWORKS enum
      if (Object.values(NETWORKS).includes(currentNetwork as NETWORKS)) {
        setCurrentNetwork(currentNetwork as NETWORKS)
        return currentNetwork as NETWORKS
      } else {
        await saveCurrentNetwork(currentNetworkLocal)
        return currentNetworkLocal
      }
    }

    initialiseCurrentNetwork()
      .then(setEthersProvider)
      .then(() => setIsLoading(false))
  }, [])

  const saveCurrentNetwork = async (network: NETWORKS) => {
    await storeData(constants.asyncStoreKeys.currentNetwork, String(network))
    setCurrentNetwork(network)
  }

  const setEthersProvider = async (network: NETWORKS) => {
    let connectedProvider
    try {
      console.log('setEthersProvider', network)
      await saveCurrentNetwork(network)
      connectedProvider = await getProvider(network)
    } catch (e) {
      setIsError(true)
      console.error('Error connecting to blockchain')
    }

    if (connectedProvider) {
      setProvider(connectedProvider)
    }
  }

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
