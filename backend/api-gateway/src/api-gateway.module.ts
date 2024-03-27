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
        },
      },
      {
        name: 'SAPPHIRE_RELAYER',
        transport: Transport.TCP,
        options: {
          port: 3002,
        },
      },
      {
        name: 'SAPPHIRE_PORTFOLIO',
        transport: Transport.TCP,
        options: {
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
