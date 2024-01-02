import { formatBlockchainAddress } from '../formatBlockchainData'

describe('formatBlockchainData', () => {
  it('should return the correct formatted data', () => {
    const data = formatBlockchainAddress(
      '0x1234567890123456789012345678901234567890'
    )
    expect(data).toEqual('0x1234...7890')
  })
})
