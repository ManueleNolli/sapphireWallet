import { Controller, Get } from '@nestjs/common';
import { SapphirePortfolioService } from './sapphire-portfolio.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { EnvironmentService } from './environment/environment.service';
import { EventPattern, Transport } from '@nestjs/microservices';
import { GetBalanceEvent } from './events/get-balance-event';

@Controller()
export class SapphirePortfolioController {
  constructor(
    private readonly appService: SapphirePortfolioService,
    private readonly blockchainService: BlockchainService,
    private readonly environmentService: EnvironmentService,
  ) {}

  @EventPattern('get_balance', Transport.TCP)
  async getBalance(data: GetBalanceEvent) {
    return this.appService.getHello();
  }
}
