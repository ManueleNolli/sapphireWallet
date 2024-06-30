import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { WalletFactoryModule } from './wallet-factory.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WalletFactoryModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
        host: 'wallet-factory',
      },
    },
  );

  await app.listen();
}
bootstrap();
