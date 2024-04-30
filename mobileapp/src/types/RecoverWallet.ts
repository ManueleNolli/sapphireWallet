export type RecoverWallet = {
  walletAddress: string
  chainID: string
  nonce: string
  wrappedTransaction: string
  signedTransaction: string
  mnemonic: string[]
}

export const RecoverWalletToJSON = (value: RecoverWallet): string => {
  const mnemonic = value.mnemonic.join(' ')
  return JSON.stringify({ ...value, mnemonic })
}

export const JSONToRecoverWallet = (value: string): RecoverWallet => {
  const parsed = JSON.parse(value)
  return { ...parsed, mnemonic: parsed.mnemonic.split(' ') }
}
