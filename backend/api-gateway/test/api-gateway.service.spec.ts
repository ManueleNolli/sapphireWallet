import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayService } from '../src/api-gateway.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateWalletRequest } from '../../wallet-factory/src/dto/create-wallet-request.dto';
import { of, throwError } from 'rxjs';

describe('ApiGatewayService', () => {
  let apiGatewayService: ApiGatewayService;
  let walletFactoryMock: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiGatewayService,
        {
          provide: 'WALLET_FACTORY',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    apiGatewayService = module.get<ApiGatewayService>(ApiGatewayService);
    walletFactoryMock = module.get<ClientProxy>('WALLET_FACTORY');
  });

  describe('createWallet', () => {
    it('should create a wallet successfully', async () => {
      const createWalletRequest: CreateWalletRequest = {
        eoaAddress: '0x00',
        network: 'localhost',
      };

      const mockResponse = 'sampleWalletAddress';
      jest.spyOn(walletFactoryMock, 'send').mockReturnValue(of(mockResponse));

      apiGatewayService
        .createWallet(createWalletRequest)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
        });
    });

    it('should handle errors and throw RpcException', async () => {
      const createWalletRequest: CreateWalletRequest = {
        eoaAddress: '0x00',
        network: 'localhost',
      };

      const mockError = new Error('Sample error');
      jest
        .spyOn(walletFactoryMock, 'send')
        .mockReturnValue(throwError(() => mockError));

      const expectedError = new RpcException(mockError.message);

      apiGatewayService.createWallet(createWalletRequest).subscribe({
        error: (e) => expect(e).toBe(expectedError),
      });
    });
  });
});
