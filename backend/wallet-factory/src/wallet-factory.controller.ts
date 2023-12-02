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
    let provider: Provider;
    let signer: Wallet;

    if (data.network === 'localhost') {
      provider = await this.blockchainService.getHardhatProvider();
      signer = await this.blockchainService.getSigner(
        this.environmentService.get('LOCALHOST_SIGNER_PRIVATE_KEY'),
        provider,
      );
    } else if (data.network === 'sepolia') {
      provider = await this.blockchainService.getSepoliaProvider(
        this.environmentService.get('SEPOLIA_API_KEY'),
      );
      signer = await this.blockchainService.getSigner(
        this.environmentService.get('SEPOLIA_SIGNER_PRIVATE_KEY'),
        provider,
      );
    } else {
      throw new RpcException(
        new BadRequestException(`Network '${data.network}' not found`),
      );
    }

    return await this.walletFactoryService.callWalletFactoryContract(
      signer,
      this.environmentService.getContractAddress(
        'WALLET_FACTORY_ADDRESS',
        data.network,
      ),
      data,
    );
  }
}
