import { ArgentWrappedAccounts__factory, ERC721URIStorage__factory, IERC721__factory } from './contracts'
import { ethers } from 'ethers'


async function handleBridgeNFT(argentWrappedAccountsAddress: string, wallet: string, originalNFTAddress: string, data: string, signer: ethers.Signer) {
  // Parse the data
  const [, , tokenId] = IERC721__factory.createInterface().decodeFunctionData('safeTransferFrom(address,address,uint256)', data)

  // Check if the token supports ERC721URIStorage
  const tokenUriSupport = IERC721__factory.connect(originalNFTAddress, signer).supportsInterface('0x5b5e139f')
  if (!tokenUriSupport) {
    console.error('handleBridgeNFT: NFT does not support tokenURI, it cannot be bridged')
    return
  }

  const tokenURI = await ERC721URIStorage__factory.connect(originalNFTAddress, signer).tokenURI(tokenId)

  // Mint the NFT
  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(argentWrappedAccountsAddress, signer)
  const tx = await argentWrappedAccounts.safeMint(wallet, tokenURI, originalNFTAddress, tokenId)

  const receipt = await tx.wait()

  if (receipt == null || receipt.blockNumber == null) {
    console.error('Transaction failed')
    return
  }


  // CHECK Events
  const filter = argentWrappedAccounts.filters.NFTMinted(wallet)
  const events = await argentWrappedAccounts.queryFilter(filter, receipt.blockNumber, receipt.blockNumber)

  if (events.length === 0) {
    console.error('No handle Bridge NFT Minted event, something went wrong')
  }

}

export {
  handleBridgeNFT
}