import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApiGatewayModule } from '../src/api-gateway.module';
import { ClientProxy } from '@nestjs/microservices';
import * as request from 'supertest';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let walletFactoryMock: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider('WALLET_FACTORY')
      .useValue({
        send: jest.fn().mockImplementation((pattern, data) => {
          if (pattern === 'create_wallet_request') {
            return of({
              address: '0x1234567890123456789012345678901234567890',
            });
          }
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/create-wallet (POST)', () => {
    return request(app.getHttpServer())
      .post('/create-wallet')
      .send({
        eoaAddress: '0x00',
        network: 'localhost',
      })
      .expect(201)
      .expect({
        address: '0x1234567890123456789012345678901234567890',
      });
  });
});
