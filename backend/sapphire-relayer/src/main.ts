import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SapphireRelayerModule } from './sapphire-relayer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SapphireRelayerModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
  );

  await app.listen();
}
bootstrap();
