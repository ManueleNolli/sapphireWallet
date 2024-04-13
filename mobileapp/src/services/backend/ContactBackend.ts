/**
 * Service to contact wallet factory microservice through API
 */

import { BACKEND_ADDRESS } from '@env'
import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'
import { Balances, BalancesNFT } from '../../types/Balance'
import { OwnedNFT } from '../blockchain'

/**
 * ENDPOINTS
 */
export enum BACKEND_ENDPOINTS {
  CREATE_WALLET = 'create-wallet',
  ADD_AUTHORISED = 'add-authorised',
  EXECUTE_TRANSACTION = 'execute-transaction',
  GET_BALANCE = 'get-balance',
  GET_NFT_BALANCE = 'get-nft-balance',
  GET_NFT_METADATA = 'get-nft-metadata',
  GET_WRAPPED_ACCOUNT_ADDRESS = 'get-wrapped-account-address',
}

/**
 * REQUESTS BODY
 */
interface backendBaseBody {
  network: NETWORKS | BRIDGE_NETWORKS
}

interface createWalletBody extends backendBaseBody {
  eoaAddress: string
}

interface addAuthorisedBody extends backendBaseBody {
  address: string
}

interface executeTransactionBody extends backendBaseBody {
  walletAddress: string
  nonce: string
  signedTransaction: string
  transactionData: string
  bridgeNetwork: BRIDGE_NETWORKS | null
}

interface getBalanceBody extends backendBaseBody {
  walletAddress: string
}

interface getBalanceNFTBody extends backendBaseBody {
  walletAddress: string
}

interface getNFTMetadataBody extends backendBaseBody {
  address: string
}

interface getWrappedAccountAddressBody extends backendBaseBody {
  address: string
}

/**
 * RESPONSES
 */
export interface backendErrorResponse {
  error: string
}

interface backendBaseResponse {
  network: NETWORKS | BRIDGE_NETWORKS
}

export interface createWalletResponse extends backendBaseResponse {
  address: string
}

export interface addAuthorisedResponse extends backendBaseResponse {
  address: string
}

export interface executeTransactionResponse extends backendBaseResponse {
  hash: string
}
export interface getWrappedAccountAddressResponse extends backendBaseResponse {
  address: string
}

export type getBalanceResponse = Balances

export type getBalancesNFTResponse = BalancesNFT

export type getNFTMetadataResponse = OwnedNFT[]
/**
 * CONTACT BACKEND
 */
interface backendBody {
  [BACKEND_ENDPOINTS.CREATE_WALLET]: createWalletBody
  [BACKEND_ENDPOINTS.ADD_AUTHORISED]: addAuthorisedBody
  [BACKEND_ENDPOINTS.EXECUTE_TRANSACTION]: executeTransactionBody
  [BACKEND_ENDPOINTS.GET_BALANCE]: getBalanceBody
  [BACKEND_ENDPOINTS.GET_NFT_BALANCE]: getBalanceNFTBody
  [BACKEND_ENDPOINTS.GET_NFT_METADATA]: getNFTMetadataBody
  [BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS]: getWrappedAccountAddressBody
}

interface backendResponse {
  [BACKEND_ENDPOINTS.CREATE_WALLET]: createWalletResponse
  [BACKEND_ENDPOINTS.ADD_AUTHORISED]: addAuthorisedResponse
  [BACKEND_ENDPOINTS.EXECUTE_TRANSACTION]: executeTransactionResponse
  [BACKEND_ENDPOINTS.GET_BALANCE]: getBalanceResponse
  [BACKEND_ENDPOINTS.GET_NFT_BALANCE]: getBalanceResponse
  [BACKEND_ENDPOINTS.GET_NFT_METADATA]: getNFTMetadataResponse
  [BACKEND_ENDPOINTS.GET_WRAPPED_ACCOUNT_ADDRESS]: getWrappedAccountAddressResponse
}

export async function contactBackend(
  endpoint: BACKEND_ENDPOINTS,
  body: backendBody[typeof endpoint]
): Promise<backendResponse[typeof endpoint] | backendErrorResponse> {
  try {
    console.log('Sent request to backend: ', body)
    const response = await fetch(`http://${BACKEND_ADDRESS}:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseJson = await response.json()
    console.log('responseJson', responseJson)
    if ('error' in responseJson) {
      throw new Error(`${responseJson.error}: ${responseJson.message}`)
    }

    if ('statusCode' in responseJson && (responseJson.statusCode !== 200 || responseJson.statusCode !== 201)) {
      throw new Error(`${responseJson.statusCode}: ${responseJson.message}`)
    }

    return responseJson as backendResponse[typeof endpoint]
  } catch (error: any) {
    return {
      error: error.message || 'Unknown error',
    }
  }
}
