import { ArgentWrappedAccounts__factory,  ERC721URIStorage__factory, IERC721__factory } from "./contracts";
import { ethers } from 'ethers'


async function handleBridgeNFT(argentWrappedAccountsAddress: string, wallet: string, originalNFTAddress: string, data: string, baseChainSigner: ethers.Signer,destChainSigner: ethers.Signer) {
  // Parse the data
  const [, , tokenId] = IERC721__factory.createInterface().decodeFunctionData('safeTransferFrom(address,address,uint256)', data)
  console.log('tokenId', tokenId)

  // Check if the token supports ERC721URIStorage
  try {
  const tokenUriSupport = await IERC721__factory.connect(originalNFTAddress, baseChainSigner).supportsInterface('0x5b5e139f')
    console.log('tokenUriSupport', tokenUriSupport)
  if (!tokenUriSupport) {
    console.error('handleBridgeNFT: NFT does not support tokenURI, it cannot be bridged')
    return
  }} catch (e) {
    console.error('ERROR boh', e)
  }

  const tokenURI = await ERC721URIStorage__factory.connect(originalNFTAddress, baseChainSigner).tokenURI(tokenId)
  console.log('tokenURI', tokenURI)

  // Mint the NFT
  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(argentWrappedAccountsAddress, destChainSigner)
  console.log('Minting NFT...')
  const tx = await argentWrappedAccounts.safeMint(wallet, tokenURI, originalNFTAddress, tokenId)
  console.log('Minted NFT')

  const receipt = await tx.wait()
  console.log('receipt', receipt)

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