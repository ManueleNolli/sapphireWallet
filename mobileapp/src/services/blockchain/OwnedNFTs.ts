import { Provider } from 'ethers'
import { SapphireNFTs__factory } from '../../contracts'
import { NETWORKS } from '../../constants/Networks'

export type OwnedNFT = {
  name: string
  description: string
  image: string
  tokenId: string
  network: NETWORKS
  collectionAddress: string
  collectionName: string
  collectionDescription: string
}

export async function ownedNFTs(
  accountAddress: string,
  contractERC721Address: string,
  provider: Provider,
  network: NETWORKS
): Promise<OwnedNFT[]> {
  const contract = SapphireNFTs__factory.connect(
    contractERC721Address,
    provider
  )

  const balance = await contract.balanceOf(accountAddress)
  const balanceInt = parseInt(balance.toString())
  const tokens: OwnedNFT[] = []

  for (let i = 0; i < balanceInt; i++) {
    const token = await contract.tokenOfOwnerByIndex(accountAddress, i)
    const tokenURI = await contract.tokenURI(token)
    const metadata = await getNFTMetadata(tokenURI)

    tokens.push({
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      tokenId: token.toString(),
      network,
      collectionAddress: contractERC721Address,
      collectionName: metadata.collectionName
        ? metadata.collectionName
        : 'collectionName',
      collectionDescription: metadata.collectionDescription
        ? metadata.collectionDescription
        : 'collectionDescription',
    })
  }
  return tokens
}

export async function getNFTMetadata(tokenURI: string) {
  const tokenURIGateway = 'https://gateway.pinata.cloud/ipfs/'
  tokenURI = tokenURI.replace('ipfs://', tokenURIGateway)
  const response = await fetch(tokenURI)
  const metadata = await response.json()
  metadata.image = metadata.image.replace('ipfs://', tokenURIGateway)
  return metadata
}
