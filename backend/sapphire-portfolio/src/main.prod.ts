import { NestFactory } from '@nestjs/core';
import { SapphirePortfolioModule } from './sapphire-portfolio.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SapphirePortfolioModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3003,
        host: 'sapphire-portfolio',
      },
    },
  );

  await app.listen();
}
bootstrap();
