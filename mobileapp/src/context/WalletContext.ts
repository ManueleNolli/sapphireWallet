import { createContext } from 'react'

type WalletContextType = {
  setPrivateKey: (privateKey: string) => Promise<void>
  getPrivateKey: (purposeMessage: string) => Promise<string>
  getEOAAddress: () => string
  setEOAAddress: (eoaAddress: string) => Promise<void>
  getWalletContractAddress: () => string
  setWalletContractAddress: (walletContractAddress: string) => Promise<void>
  resetWallet: () => Promise<void>
}

export const WalletContext = createContext<WalletContextType>(<
  WalletContextType
>{
  setPrivateKey: async (privateKey: string): Promise<void> => {},
  getPrivateKey: async (purposeMessage: string): Promise<string> => {
    console.warn('WalletContext.getPrivateKey not implemented')
    return Promise.resolve('')
  },
  getEOAAddress: (): string => {
    console.warn('WalletContext.getEOAAddress not implemented')
    return ''
  },
  setEOAAddress: async (eoaAddress: string): Promise<void> => {},
  getWalletContractAddress: (): string => {
    console.warn('WalletContext.getWalletContractAddress not implemented')
    return ''
  },
  setWalletContractAddress: async (
    walletContractAddress: string
  ): Promise<void> => {},
  resetWallet: async (): Promise<void> => {},
})
