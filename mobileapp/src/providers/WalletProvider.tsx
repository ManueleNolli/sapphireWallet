import React, { useEffect } from 'react'
import { WalletContext } from '../context/WalletContext'
import * as SecureStore from 'expo-secure-store'
import { getData, storeData } from '../services/AsyncStorageHelper'
import constants from '../constants/Constants'
import useLoading from '../hooks/useLoading'
import Loading from '../pages/Loading/Loading'

type WalletProviderProps = {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { isLoading, setIsLoading } = useLoading(true)
  const [EOAAddress, setEOAAddress] = React.useState<string | null>(null)
  const [walletContractAddress, setWalletContractAddress] = React.useState<
    string | null
  >(null)

  // load in local state for performance
  useEffect(() => {
    const initialiseEOAAddress = async () => {
      const EOAAddress = await getData(constants.asyncStoreKeys.EOAAddress)
      if (EOAAddress) {
        setEOAAddress(EOAAddress)
      }
    }

    const initialiseWallet = async () => {
      const walletContractAddress = await getData(
        constants.asyncStoreKeys.walletContractAddress
      )
      if (walletContractAddress) {
        setWalletContractAddress(walletContractAddress)
      }
    }

    // When both EOAAddress and walletContractAddress are done, stop loading
    Promise.all([initialiseEOAAddress(), initialiseWallet()]).then(() =>
      setIsLoading(false)
    )
  }, [])

  /**
   * Using Expo SecureStore
   * @param privateKey
   */
  const setPrivateKey = async (privateKey: string) => {
    await SecureStore.setItemAsync('privateKey', privateKey, {
      authenticationPrompt: 'Please authenticate to save your private key',
      requireAuthentication: true,
    })
  }

  /**
   * Using Expo SecureStore
   * @returns privateKey
   */
  const getPrivateKey = async (purposeMessage: string) => {
    const privateKey = await SecureStore.getItemAsync('privateKey', {
      authenticationPrompt: purposeMessage,
    })
    if (privateKey) {
      return privateKey
    }
    throw new Error('Private key not found')
  }

  const getEOAAddress = (): string => {
    if (EOAAddress) {
      return EOAAddress
    }
    throw new Error('EOA Address not found')
  }

  const setEOAAddressStorage = async (EOAAddress: string) => {
    await storeData(constants.asyncStoreKeys.EOAAddress, EOAAddress)
    setEOAAddress(EOAAddress)
  }

  const getWalletContractAddress = (): string => {
    if (walletContractAddress) {
      return walletContractAddress
    }
    throw new Error('Wallet Contract Address not found')
  }

  const setWalletContractAddressStorage = async (
    walletContractAddress: string
  ) => {
    await storeData(
      constants.asyncStoreKeys.walletContractAddress,
      walletContractAddress
    )
    setWalletContractAddress(walletContractAddress)
  }

  if (isLoading) {
    return <Loading text={'Checking wallet information...'} />
  }

  return (
    <WalletContext.Provider
      value={{
        setPrivateKey,
        getPrivateKey,
        getEOAAddress,
        setEOAAddress: setEOAAddressStorage,
        getWalletContractAddress,
        setWalletContractAddress: setWalletContractAddressStorage,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
