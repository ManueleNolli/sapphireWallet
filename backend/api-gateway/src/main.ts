import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { RpcExceptionFilter } from './rpc-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  // GLOBAL FILTERS (for RPC exceptions)
  app.useGlobalFilters(new RpcExceptionFilter());

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Sapphire backend')
    .setDescription('The Sapphire backend API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
