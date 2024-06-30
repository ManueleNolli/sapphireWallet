import { Module } from '@nestjs/common';
import { WalletFactoryController } from './wallet-factory.controller';
import { WalletFactoryService } from './wallet-factory.service';
import { EnvironmentModule } from './environment/environment.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [EnvironmentModule, BlockchainModule],
  controllers: [WalletFactoryController],
  providers: [WalletFactoryService],
})
export class WalletFactoryModule {}
