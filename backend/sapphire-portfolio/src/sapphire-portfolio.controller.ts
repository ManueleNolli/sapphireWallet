import { Controller } from '@nestjs/common';
import { SapphirePortfolioService } from './sapphire-portfolio.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { EnvironmentService } from './environment/environment.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { GetBalanceEvent } from './events/get-balance-event';
import { Balances, NFTBalances } from './types/Balances';
import { CHAIN_CRYPTOS, CHAIN_IDS } from './constants/Networks';
import { GetNFTBalanceEvent } from './events/get-nft-balance-event';
import { ZeroAddress } from 'ethers';

@Controller()
export class SapphirePortfolioController {
  constructor(
    private readonly sapphirePortfolioService: SapphirePortfolioService,
    private readonly blockchainService: BlockchainService,
    private readonly environmentService: EnvironmentService,
  ) {}

  @EventPattern('get_balance', Transport.TCP)
  async getBalance(data: GetBalanceEvent) {
    const apiKey = this.environmentService.getUnhandled(
      'API_KEY',
      data.network,
    );

    // In case of local chain
    const backendAddress = this.environmentService.getUnhandled(
      'ADDRESS',
      data.network,
    );

    const baseChainSigner = await this.blockchainService.getProviderAndSigner({
      network: data.network,
      signerKey: this.environmentService.getWithNetwork(
        'SIGNER_PRIVATE_KEY',
        data.network,
      ),
      localHostAddress: backendAddress,
      apiKey: apiKey,
    });

    let chainsIDs = await this.sapphirePortfolioService.getChains(
      baseChainSigner,
      data.walletAddress,
    );

    const baseChainID =
      await this.blockchainService.getChainID(baseChainSigner);
    const baseChainName = CHAIN_IDS[baseChainID.toString()];

    // Remove the base chain from the list of chains
    chainsIDs = chainsIDs.filter((chainID) => chainID !== baseChainID);

    const balances: Balances = {};

    const balanceBigInt =
      await this.sapphirePortfolioService.getBaseChainBalance(
        baseChainSigner,
        data.walletAddress,
      );

    balances[baseChainName] = {
      chainID: baseChainID.toString(),
      balance: balanceBigInt.toString(),
      crypto: CHAIN_CRYPTOS[baseChainID.toString()],
    };

    for (const chainID of chainsIDs) {
      const networkName = CHAIN_IDS[chainID.toString()];

      const signer = await this.blockchainService.getProviderAndSigner({
        network: networkName,
        signerKey: this.environmentService.getWithNetwork(
          'SIGNER_PRIVATE_KEY',
          networkName,
        ),
        localHostAddress: backendAddress,
        apiKey: apiKey,
      });

      const balanceBigInt =
        await this.sapphirePortfolioService.getDestChainBalance(
          signer,
          this.environmentService.getWithNetwork(
            'ARGENT_WRAPPED_ACCOUNTS_ADDRESS',
            networkName,
          ),
          data.walletAddress,
        );

      balances[networkName] = {
        chainID: chainID.toString(),
        balance: balanceBigInt.toString(),
        crypto: CHAIN_CRYPTOS[chainID.toString()],
      };
    }

    return balances;
  }

  @EventPattern('get_nft_balance', Transport.TCP)
  async getNFTBalance(data: GetNFTBalanceEvent) {
    const apiKey = this.environmentService.getUnhandled(
      'API_KEY',
      data.network,
    );

    // In case of local chain
    const backendAddress = this.environmentService.getUnhandled(
      'ADDRESS',
      data.network,
    );

    const baseChainSigner = await this.blockchainService.getProviderAndSigner({
      network: data.network,
      signerKey: this.environmentService.getWithNetwork(
        'SIGNER_PRIVATE_KEY',
        data.network,
      ),
      localHostAddress: backendAddress,
      apiKey: apiKey,
    });

    const baseChainNFTStorage = this.environmentService.getWithNetwork(
      'SAPPHIRE_NFTS_ADDRESS',
      data.network,
    );

    const baseChainBalance = await this.sapphirePortfolioService.getNFTBalance(
      baseChainSigner,
      data.walletAddress,
      baseChainNFTStorage,
    );

    const nftBalances: NFTBalances = {};

    nftBalances[data.network] = baseChainBalance;

    for (const network of data.destinationChains) {
      const signer = await this.blockchainService.getProviderAndSigner({
        network: network,
        signerKey: this.environmentService.getWithNetwork(
          'SIGNER_PRIVATE_KEY',
          network,
        ),
        localHostAddress: backendAddress,
        apiKey: apiKey,
      });

      const argentWrappedAccountsAddress =
        this.environmentService.getWithNetwork(
          'ARGENT_WRAPPED_ACCOUNTS_ADDRESS',
          network,
        );

      const wrappedAccountAddress =
        await this.sapphirePortfolioService.getWrappedAccountAddress(
          signer,
          argentWrappedAccountsAddress,
          data.walletAddress,
        );

      if (wrappedAccountAddress === ZeroAddress) {
        nftBalances[network] = 0;
        continue;
      }

      const nftStorage = this.environmentService.getWithNetwork(
        'DEST_CHAIN_NFT_STORAGE_ADDRESS',
        network,
      );

      const balance = await this.sapphirePortfolioService.getNFTBalance(
        signer,
        wrappedAccountAddress,
        nftStorage,
      );

      nftBalances[network] = balance;
    }

    nftBalances['total'] = Object.values(nftBalances).reduce(
      (acc, val) => acc + val,
      0,
    );

    return nftBalances;
  }
}
