import { Provider } from 'ethers'

export async function getBalance(provider: Provider, walletAddress: string) {
  return await provider.getBalance(walletAddress)
}
