import { Module } from '@nestjs/common';
import { SapphireRelayerController } from './sapphire-relayer.controller';
import { SapphireRelayerService } from './sapphire-relayer.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [EnvironmentModule, BlockchainModule],
  controllers: [SapphireRelayerController],
  providers: [SapphireRelayerService],
})
export class SapphireRelayerModule {}
