import { Controller } from '@nestjs/common';
import { SapphireRelayerService } from './sapphire-relayer.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { AddAuthorisedEvent } from './events/add-authorised.event';
import { ExecuteTransactionEvent } from './events/execute-transaction.event';
import { BlockchainService } from './blockchain/blockchain.service';
import { EnvironmentService } from './environment/environment.service';

@Controller()
export class SapphireRelayerController {
  constructor(
    private readonly sapphireService: SapphireRelayerService,
    private readonly blockchainService: BlockchainService,
    private readonly environmentService: EnvironmentService,
  ) {}

  @EventPattern('add_authorised', Transport.TCP)
  async handleAddAuthorised(data: AddAuthorisedEvent) {
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

    return await this.sapphireService.addAuthorised(
      signer,
      this.environmentService.getWithNetwork(
        'DAPP_REGISTRY_ADDRESS',
        data.network,
      ),
      data,
    );
  }

  @EventPattern('execute_transaction', Transport.TCP)
  async handleExecuteTransaction(data: ExecuteTransactionEvent) {
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

    return await this.sapphireService.executeTransaction(
      signer,
      this.environmentService.getWithNetwork(
        'ARGENT_MODULE_ADDRESS',
        data.network,
      ),
      data,
    );
  }
}
