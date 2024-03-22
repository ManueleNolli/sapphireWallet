import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from '../api-gateway.controller';
import { ApiGatewayService } from '../api-gateway.service';
import { ClientsModule } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('AppController', () => {
  let apiGatewayController: ApiGatewayController;
  let apiGatewayService: ApiGatewayService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayController],
      providers: [ApiGatewayService],
      imports: [
        ClientsModule.register([
          {
            name: 'WALLET_FACTORY',
          },
        ]),
        ClientsModule.register([
          {
            name: 'SAPPHIRE_RELAYER',
          },
        ]),
      ],
    }).compile();

    apiGatewayController = app.get<ApiGatewayController>(ApiGatewayController);
    apiGatewayService = app.get<ApiGatewayService>(ApiGatewayService);
  });

  describe('WalletFactory', () => {
    it('createWallet', async () => {
      const mockResult = {
        address: '0x1234567890123456789012345678901234567890',
        network: 'localhost',
      };
      jest
        .spyOn(apiGatewayService, 'createWallet')
        .mockReturnValue(of(mockResult));
      jest
        .spyOn(apiGatewayService, 'addAuthorised')
        .mockReturnValue(of(mockResult));

      const createWalletResponse = await apiGatewayController.createWallet({
        eoaAddress: '0x0',
        network: 'localhost',
      });

      expect(createWalletResponse).toEqual(mockResult);
    });
  });

  describe('Sapphire Relayer', () => {
    it('addAuthorised', () => {
      const mockResult = {
        address: '0x1234567890123456789012345678901234567890',
        network: 'localhost',
      };

      jest
        .spyOn(apiGatewayService, 'addAuthorised')
        .mockReturnValue(of(mockResult));

      apiGatewayController
        .addAuthorised({
          address: '0x0',
          network: 'localhost',
        })
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
        });
    });

    it('executeTransaction', () => {
      const mockResult = {
        hash: '0x82b9eea000ba798f1cae87bc89024a7cb55bc180db6e9545096e3eb2a7f38c9275d51018b41fc8779577b5f73c36ae5c5a1bd4a48a6a63bd880b1493bb20ad701c',
      };

      jest
        .spyOn(apiGatewayService, 'executeTransaction')
        .mockReturnValue(of(mockResult));

      apiGatewayController
        .executeTransaction({
          network: 'localhost',
          walletAddress: '0x1234567890123456789012345678901234567890',
          nonce: '0',
          signedTransaction: '0x0',
          transactionData: '0x0',
        })
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
        });
    });
  });
});
