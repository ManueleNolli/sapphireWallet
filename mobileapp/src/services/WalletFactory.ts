/**
 * Service to contact wallet factory microservice through API
 */

import { BACKEND_ADDRESS } from '@env'

export async function requestContractWallet(eoaAddress: string) {
  const response = await fetch(`http://${BACKEND_ADDRESS}/create-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eoaAddress, network: 'localhost' }),
  }).catch((error) => {
    console.error('error', error)
  })

  if (!response) {
    return { eoaAddress: 'error' }
  }

  return await response.json()
}
