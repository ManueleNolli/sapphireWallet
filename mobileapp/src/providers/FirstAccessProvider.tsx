import React, { useEffect, useState } from 'react'
import useLoading from '../hooks/useLoading'
import { getData, storeData } from '../services/storage/'
import constants from '../constants/Constants'
import Loading from '../pages/Loading/Loading'
import { FirstAccessContext } from '../context/FirstAccessContext'
import FirstAccessStack from '../navigation/FirstAccessStack'

type FirstAccessProviderProps = {
  children: React.ReactNode
}

export function FirstAccessProvider({ children }: FirstAccessProviderProps) {
  const { isLoading, setIsLoading } = useLoading(true)
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(false)

  // load in local state for performance
  useEffect(() => {
    const initialiseFirstAccess = async () => {
      const firstAccess = await getData(constants.asyncStoreKeys.firstAccess)
      if (firstAccess === null || firstAccess === 'true') {
        setIsFirstAccess(true)
      }
    }

    initialiseFirstAccess().then(() => setIsLoading(false))
  }, [])

  const toggleFirstAccess = async () => {
    const nextValue = !isFirstAccess
    await storeData(constants.asyncStoreKeys.firstAccess, String(nextValue))
    setIsFirstAccess(!isFirstAccess)
  }

  if (isLoading) {
    return <Loading text={'Checking first access...'} />
  }

  return (
    <FirstAccessContext.Provider value={{ isFirstAccess, toggleFirstAccess }}>
      {isFirstAccess ? <FirstAccessStack /> : children}
    </FirstAccessContext.Provider>
  )
}
