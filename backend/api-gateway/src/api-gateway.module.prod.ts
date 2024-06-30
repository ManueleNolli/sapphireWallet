import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WALLET_FACTORY',
        transport: Transport.TCP,
        options: {
          port: 3001,
          host: 'wallet-factory',
        },
      },
      {
        name: 'SAPPHIRE_RELAYER',
        transport: Transport.TCP,
        options: {
          port: 3002,
          host: 'sapphire-relayer',
        },
      },
      {
        name: 'SAPPHIRE_PORTFOLIO',
        transport: Transport.TCP,
        options: {
          port: 3003,
          host: 'sapphire-portfolio',
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
