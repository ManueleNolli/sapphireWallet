/**
 * Service to contact wallet factory microservice through API
 */

import { BACKEND_ADDRESS } from '@env'
import { NETWORKS } from '../../constants/Networks'
import { BRIDGE_NETWORKS } from '../../constants/BridgeNetworks'

/**
 * ENDPOINTS
 */
export enum BACKEND_ENDPOINTS {
  CREATE_WALLET = 'create-wallet',
  ADD_AUTHORISED = 'add-authorised',
  EXECUTE_TRANSACTION = 'execute-transaction',
}

/**
 * REQUESTS BODY
 */
interface backendBaseBody {
  network: NETWORKS
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

/**
 * RESPONSES
 */
export interface backendErrorResponse {
  error: string
}

interface backendBaseResponse {
  network: NETWORKS
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

/**
 * CONTACT BACKEND
 */
interface backendBody {
  [BACKEND_ENDPOINTS.CREATE_WALLET]: createWalletBody
  [BACKEND_ENDPOINTS.ADD_AUTHORISED]: addAuthorisedBody
  [BACKEND_ENDPOINTS.EXECUTE_TRANSACTION]: executeTransactionBody
}

interface backendResponse {
  [BACKEND_ENDPOINTS.CREATE_WALLET]: createWalletResponse
  [BACKEND_ENDPOINTS.ADD_AUTHORISED]: addAuthorisedResponse
  [BACKEND_ENDPOINTS.EXECUTE_TRANSACTION]: executeTransactionResponse
}

export async function contactBackend(
  endpoint: BACKEND_ENDPOINTS,
  body: backendBody[typeof endpoint]
): Promise<backendResponse[typeof endpoint] | backendErrorResponse> {
  try {
    const response = await fetch(`http://${BACKEND_ADDRESS}:3000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const responseJson = await response.json()

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
