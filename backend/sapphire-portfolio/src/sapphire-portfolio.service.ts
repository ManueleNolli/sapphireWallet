import { Injectable } from '@nestjs/common';
import { Wallet } from 'ethers';
import {
  ArgentWrappedAccounts__factory,
  BaseWallet__factory,
  ERC721__factory,
  ERC721Enumerable__factory,
} from './contracts';
import { NFT } from './types/NftMetadata';
import { isStandardERC721Metadata } from './constants/NFTMetadata';

@Injectable()
export class SapphirePortfolioService {
  async getChains(signerBaseChain: Wallet, baseWalletAddress: string) {
    // Get the base wallet contract
    const baseWallet = BaseWallet__factory.connect(
      baseWalletAddress,
      signerBaseChain,
    );

    // Get the chain IDs
    return await baseWallet.getChains();
  }

  async getBaseChainBalance(signerBaseChain: Wallet, walletAddress: string) {
    // Get balance of the wallet
    return await signerBaseChain.provider.getBalance(walletAddress);
  }

  async getDestChainBalance(
    signerDestChain: Wallet,
    argentWrappedAccountsAddress: string,
    walletAddress: string,
  ) {
    // Get the argent wrapped accounts contract
    const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(
      argentWrappedAccountsAddress,
      signerDestChain,
    );

    return await argentWrappedAccounts.getAccountBalance(walletAddress);
  }

  async getNFTBalance(
    signer: Wallet,
    walletAddress: string,
    nftStorageAddress: string,
  ) {
    const nftStorage = ERC721__factory.connect(nftStorageAddress, signer);

    return Number(await nftStorage.balanceOf(walletAddress));
  }

  async getWrappedAccountAddress(
    signer: Wallet,
    argentWrappedAccountsAddress: string,
    walletAddress: string,
  ) {
    const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(
      argentWrappedAccountsAddress,
      signer,
    );
    return await argentWrappedAccounts.getAccountContract(walletAddress);
  }

  async getNFTMetadata(
    signer: Wallet,
    walletAddress: string,
    nftStorageAddress: string,
    network: string,
    ipfsGateway: string,
  ) {
    const nftStorage = ERC721Enumerable__factory.connect(
      nftStorageAddress,
      signer,
    );

    const balance = await nftStorage.balanceOf(walletAddress);
    const balanceInt = parseInt(balance.toString());

    const name = await nftStorage.name();
    const symbol = await nftStorage.symbol();

    const tokens: NFT[] = [];

    for (let i = 0; i < balanceInt; i++) {
      const tokenId = await nftStorage.tokenOfOwnerByIndex(walletAddress, i);
      let tokenURI = await nftStorage.tokenURI(tokenId);

      if (!tokenURI || !tokenURI.includes('ipfs://')) {
        continue;
      }

      tokenURI = tokenURI.replace('ipfs://', ipfsGateway);
      const response = await fetch(tokenURI);
      const metadata = await response.json();

      // check the metadata is a type of StandardMetadata
      isStandardERC721Metadata(metadata);

      if (metadata.image.includes('ipfs://')) {
        metadata.image = metadata.image.replace('ipfs://', ipfsGateway);
      }

      const nft: NFT = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        tokenId: parseInt(tokenId.toString()),
        collectionName: metadata.collectionName
          ? metadata.collectionName
          : name,
        collectionDescription: metadata.collectionDescription
          ? metadata.collectionDescription
          : symbol,
        collectionAddress: nftStorageAddress,
        network: network,
      };

      tokens.push(nft);
    }

    return tokens;
  }
}
