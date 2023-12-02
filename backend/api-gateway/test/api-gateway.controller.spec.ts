import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from '../src/api-gateway.controller';
import { ApiGatewayService } from '../src/api-gateway.service';
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
      ],
    }).compile();

    apiGatewayController = app.get<ApiGatewayController>(ApiGatewayController);
    apiGatewayService = app.get<ApiGatewayService>(ApiGatewayService);
  });

  it('Service returns correct address', () => {
    const mockWalletAddress: string =
      '0x1234567890123456789012345678901234567890';

    jest
      .spyOn(apiGatewayService, 'createWallet')
      .mockReturnValue(of(mockWalletAddress));

    apiGatewayController
      .createWallet({
        eoaAddress: '0x0',
        network: 'localhost',
      })
      .subscribe((result) => {
        // Assert that the result matches the expected value
        expect(result).toEqual(mockWalletAddress);
      });
  });
});
