import { Controller } from '@nestjs/common';
import { SapphirePortfolioService } from './sapphire-portfolio.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { EnvironmentService } from './environment/environment.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { GetBalanceEvent } from './events/get-balance-event';
import { Balances } from './types/Balances';
import { CHAIN_CRYPTOS, CHAIN_IDS } from './constants/Networks';

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
      this.environmentService.getWithNetwork(
        'BASE_WALLET_ADDRESS',
        data.network,
      ),
    );

    const baseChainID =
      await this.blockchainService.getChainID(baseChainSigner);

    // Remove the base chain from the list of chains
    chainsIDs = chainsIDs.filter((chainID) => chainID !== baseChainID);

    const balances: Balances = [];

    balances.push({
      chainID: baseChainID,
      balance: await this.sapphirePortfolioService.getBaseChainBalance(
        baseChainSigner,
        data.walletAddress,
      ),
      crypto: CHAIN_CRYPTOS[baseChainID.toString()],
    });

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

      balances.push({
        chainID: chainID,
        balance: await this.sapphirePortfolioService.getDestChainBalance(
          signer,
          this.environmentService.getWithNetwork(
            'ARGENT_WRAPPED_ACCOUNTS_ADDRESS',
            networkName,
          ),
          data.walletAddress,
        ),
        crypto: CHAIN_CRYPTOS[chainID.toString()],
      });
    }

    return balances;
  }
}
