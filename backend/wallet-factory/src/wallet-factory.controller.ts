import { BadRequestException, Controller } from '@nestjs/common';
import { WalletFactoryService } from './wallet-factory.service';
import { EventPattern, RpcException, Transport } from '@nestjs/microservices';
import { CreateWalletRequestEvent } from './events/create-wallet-request.event';
import { EnvironmentService } from './environment/environment.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { Provider, Wallet } from 'ethers';

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

    const signer = await this.blockchainService.getProviderAndSigner(
      data.network,
      this.environmentService.getWithNetwork(
        'SIGNER_PRIVATE_KEY',
        data.network,
      ),
      apiKey,
    );

    return await this.walletFactoryService.callWalletFactoryContract(
      signer,
      data,
    );
  }
}
