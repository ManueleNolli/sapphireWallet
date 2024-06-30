import { Controller } from '@nestjs/common';
import { WalletFactoryService } from './wallet-factory.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { CreateWalletRequestEvent } from './events/create-wallet-request.event';
import { EnvironmentService } from './environment/environment.service';
import { BlockchainService } from './blockchain/blockchain.service';

@Controller()
export class WalletFactoryController {
  constructor(
    private readonly walletFactoryService: WalletFactoryService,
    private readonly environmentService: EnvironmentService,
    private readonly blockchainService: BlockchainService,
  ) {}

  @EventPattern('create_wallet_request', Transport.TCP)
  async handleCreateWalletRequest(data: CreateWalletRequestEvent) {
    const apiKey = this.environmentService.getUnhandled(
      'API_KEY',
      data.network,
    );

    const backendAddress = this.environmentService.getUnhandled(
      'ADDRESS',
      data.network,
    );

    const signer = await this.blockchainService.getProviderAndSigner({
      network: data.network,
      signerKey: this.environmentService.getWithNetwork(
        'SIGNER_PRIVATE_KEY',
        data.network,
      ),
      localHostAddress: backendAddress,
      apiKey: apiKey,
    });

    return await this.walletFactoryService.callWalletFactoryContract(
      signer,
      data,
    );
  }
}
