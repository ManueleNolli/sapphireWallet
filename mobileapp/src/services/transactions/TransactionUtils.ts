import { ethers, Provider, Signer, ZeroAddress } from 'ethers'
import { BACKEND_ENDPOINTS, backendErrorResponse, contactBackend, getWrappedAccountAddressResponse } from '../backend'
import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'

export const gasLimit = 1000000

/**
 * Generate a random salt for relay
 */
export async function generateNonceForRelay(provider: Provider): Promise<string> {
  const block = await provider.getBlockNumber()
  const timestamp = new Date().getTime()
  return `0x${ethers.zeroPadValue(ethers.toBeHex(block), 16).slice(2)}${ethers
    .zeroPadValue(ethers.toBeHex(timestamp), 16)
    .slice(2)}`
}

/**
 * Generate a message hash
 * @param from
 * @param value
 * @param data
 * @param chainId
 * @param nonce
 * @param gasPrice
 * @param gasLimit
 * @param refundToken
 * @param refundAddress
 */
export function generateMessageHash(
  from: string,
  value: number,
  data: string,
  chainId: bigint,
  nonce: string,
  gasPrice: number,
  gasLimit: number,
  refundToken: string,
  refundAddress: string
): string {
  const message = `0x${[
    '0x19',
    '0x00',
    from,
    ethers.zeroPadValue(ethers.toBeHex(value), 32),
    data,
    ethers.zeroPadValue(ethers.toBeHex(chainId), 32),
    nonce,
    ethers.zeroPadValue(ethers.toBeHex(gasPrice), 32),
    ethers.zeroPadValue(ethers.toBeHex(gasLimit), 32),
    refundToken,
    refundAddress,
  ]
    .map((hex) => hex.slice(2))
    .join('')}`

  const messageHash = ethers.keccak256(message)
  return messageHash
}

/**
 * Sign a message
 * @param message
 * @param signer
 */
export async function signMessage(message: string, signer: Signer): Promise<string> {
  const sig = await signer.signMessage(ethers.getBytes(message))

  const v = parseInt(sig.substring(130, 132), 16)
  if (v !== 27 && v !== 28) {
    throw new Error("Invalid 'v' value in signature. Expected 27 or 28.")
  }
  const normalizedSig = `${sig.substring(0, 130)}${v.toString(16)}`
  return normalizedSig
}

/**
 * Sign a transaction offchain
 * @param signer
 * @param argentModuleAddress
 * @param data
 * @param chainId
 * @param nonce
 */
export async function signOffChain(
  signer: Signer,
  argentModuleAddress: string,
  data: string,
  chainId: bigint,
  nonce: string
): Promise<string> {
  const messageHash = generateMessageHash(
    argentModuleAddress,
    0,
    data,
    chainId,
    nonce,
    0,
    gasLimit,
    ZeroAddress,
    ZeroAddress
  )
  return await signMessage(messageHash, signer)
}

export async function signOffChainForBridge(
  signer: Signer,
  walletContractAddress: string,
  data: string,
  chainId: bigint
) {
  const message = `0x${['0x19', '0x00', walletContractAddress, data, ethers.zeroPadValue(ethers.toBeHex(chainId), 32)]
    .map((hex) => hex.slice(2))
    .join('')}`

  const messageHash = ethers.keccak256(message)

  return await signMessage(messageHash, signer)
}

export async function getWrappedAccountAddress(address: string, network: NETWORKS | BRIDGE_NETWORKS) {
  const result = (await contactBackend(BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS, {
    address,
    network,
  })) as getWrappedAccountAddressResponse | backendErrorResponse

  if ('error' in result) {
    throw new Error(result.error)
  }

  return result.address
}
