import { Module } from '@nestjs/common';
import { SapphirePortfolioController } from './sapphire-portfolio.controller';
import { SapphirePortfolioService } from './sapphire-portfolio.service';
import { EnvironmentModule } from './environment/environment.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [EnvironmentModule, BlockchainModule],
  controllers: [SapphirePortfolioController],
  providers: [SapphirePortfolioService],
})
export class SapphirePortfolioModule {}
