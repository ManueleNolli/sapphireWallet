import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApiGatewayModule } from '../src/api-gateway.module';
import * as request from 'supertest';
import { of } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider('WALLET_FACTORY')
      .useValue({
        send: jest.fn().mockImplementation((pattern) => {
          if (pattern === 'create_wallet_request') {
            return of({
              address: '0x1234567890123456789012345678901234567890',
              network: 'localhost',
            });
          }
        }),
      })
      .overrideProvider('SAPPHIRE_RELAYER')
      .useValue({
        send: jest.fn().mockImplementation((pattern) => {
          if (pattern === 'add_authorised') {
            return of({
              address: '0x1234567890123456789012345678901234567890',
              network: 'localhost',
            });
          } else if (pattern === 'execute_transaction') {
            return of({
              hash: '0x82b9eea000ba798f1cae87bc89024a7cb55bc180db6e9545096e3eb2a7f38c9275d51018b41fc8779577b5f73c36ae5c5a1bd4a48a6a63bd880b1493bb20ad701c',
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
        network: 'localhost',
      });
  });

  it('/add-authorised (POST)', () => {
    return request(app.getHttpServer())
      .post('/add-authorised')
      .send({
        address: '0x00',
        network: 'localhost',
      })
      .expect(201)
      .expect({
        address: '0x1234567890123456789012345678901234567890',
        network: 'localhost',
      });
  });

  it('/execute-transaction (POST)', () => {
    return request(app.getHttpServer())
      .post('/execute-transaction')
      .send({
        network: 'localhost',
        walletAddress: '0x1234567890123456789012345678901234567890',
        nonce: '0',
        signedTransaction: '0x0',
        transactionData: '0x0',
      })
      .expect(201)
      .expect({
        hash: '0x82b9eea000ba798f1cae87bc89024a7cb55bc180db6e9545096e3eb2a7f38c9275d51018b41fc8779577b5f73c36ae5c5a1bd4a48a6a63bd880b1493bb20ad701c',
      });
  });
});
