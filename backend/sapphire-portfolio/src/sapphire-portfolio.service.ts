import { Injectable } from '@nestjs/common';
import { Wallet } from 'ethers';
import {
  ArgentWrappedAccounts__factory,
  BaseWallet__factory,
  ERC721__factory,
} from './contracts';

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
}
