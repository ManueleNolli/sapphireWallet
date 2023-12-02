import { createContext } from 'react'

type FirstAccessContextType = {
  isFirstAccess: boolean
  toggleFirstAccess: () => Promise<void>
}

export const FirstAccessContext = createContext<FirstAccessContextType>({
  isFirstAccess: true,
  toggleFirstAccess: async (): Promise<void> => {},
})
