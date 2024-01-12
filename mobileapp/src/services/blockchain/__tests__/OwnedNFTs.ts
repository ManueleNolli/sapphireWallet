import { ethers, JsonRpcProvider } from 'ethers'
import { SapphireNFTs__factory } from '../../../contracts'
import { NETWORKS } from '../../../constants/Networks'
import { ownedNFTs, getNFTMetadata } from '../OwnedNFTs'

describe('ownedNFTs Function', () => {
  it('returns an array of OwnedNFT objects', async () => {
    const accountAddress = '0x123456789abcdef'
    const contractERC721Address = '0x987654321fedcba'
    const provider = new JsonRpcProvider()
    const network = NETWORKS.LOCALHOST

    // Mocking balanceOf and tokenOfOwnerByIndex
    const mockBalanceOf = jest.fn().mockResolvedValue(2)
    const mockTokenOfOwnerByIndex = jest.fn().mockResolvedValue(0)

    // Mock contract
    const mockContract = {
      balanceOf: mockBalanceOf,
      tokenOfOwnerByIndex: mockTokenOfOwnerByIndex,
      tokenURI: jest.fn().mockResolvedValue('ipfs://metadataHash'),
    }

    jest
      .spyOn(SapphireNFTs__factory, 'connect')
      .mockReturnValue(mockContract as any)

    // mock fetch
    const jsonMock = jest.fn().mockResolvedValue({
      name: 'name',
      description: 'description',
      image: 'ipfs://imageHash',
      token: 0n,
      collectionName: 'collectionName',
      collectionDescription: 'collectionDescription',
    })
    const fetchMock = jest.fn().mockResolvedValue({
      json: jsonMock,
    })
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)

    const result = await ownedNFTs(
      accountAddress,
      contractERC721Address,
      provider,
      network
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'name',
      description: 'description',
      image: 'https://gateway.pinata.cloud/ipfs/imageHash',
      tokenId: '0',
      network: NETWORKS.LOCALHOST,
      collectionAddress: '0x987654321fedcba',
      collectionName: 'collectionName',
      collectionDescription: 'collectionDescription',
    })

    // Ensure that necessary functions were called with the correct arguments
    expect(SapphireNFTs__factory.connect).toHaveBeenCalledWith(
      '0x987654321fedcba',
      provider
    )
    expect(mockBalanceOf).toHaveBeenCalledWith(accountAddress)
    expect(mockTokenOfOwnerByIndex).toHaveBeenCalledWith(accountAddress, 0)
    expect(mockTokenOfOwnerByIndex).toHaveBeenCalledWith(accountAddress, 1)
  })
})
