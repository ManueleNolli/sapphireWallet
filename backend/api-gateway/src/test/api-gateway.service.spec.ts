import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayService } from '../api-gateway.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateWalletRequest } from '../../../wallet-factory/src/dto/create-wallet-request.dto';
import { of, throwError } from 'rxjs';

describe('ApiGatewayService', () => {
  let apiGatewayService: ApiGatewayService;
  let walletFactoryMock: ClientProxy;
  let sapphireRelayerMock: ClientProxy;

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
        {
          provide: 'SAPPHIRE_RELAYER',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    apiGatewayService = module.get<ApiGatewayService>(ApiGatewayService);
    walletFactoryMock = module.get<ClientProxy>('WALLET_FACTORY');
    sapphireRelayerMock = module.get<ClientProxy>('SAPPHIRE_RELAYER');
  });

  describe('createWallet', () => {
    it('should create a wallet successfully', async () => {
      const createWalletRequest: CreateWalletRequest = {
        eoaAddress: '0x00',
        network: 'localhost',
      };

      const mockResponse = {
        address: '0x00',
        network: 'localhost',
      };
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

      const rpcExceptionMock = new RpcException('Original RPC error');

      jest
        .spyOn(walletFactoryMock, 'send')
        .mockReturnValue(throwError(() => rpcExceptionMock));

      apiGatewayService.createWallet(createWalletRequest).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RpcException);
        },
      });
    });
  });

  describe('addAuthorised', () => {
    it('should add authorised successfully', async () => {
      const addAuthorisedRequest = {
        address: '0x00',
        network: 'localhost',
      };

      const mockResponse = {
        address: '0x00',
        network: 'localhost',
      };
      jest.spyOn(sapphireRelayerMock, 'send').mockReturnValue(of(mockResponse));

      apiGatewayService
        .addAuthorised(addAuthorisedRequest)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
        });
    });

    it('should handle errors and throw RpcException', async () => {
      const addAuthorisedRequest = {
        address: '0x00',
        network: 'localhost',
      };

      const rpcExceptionMock = new RpcException('Original RPC error');

      jest
        .spyOn(sapphireRelayerMock, 'send')
        .mockReturnValue(throwError(() => rpcExceptionMock));

      apiGatewayService.addAuthorised(addAuthorisedRequest).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RpcException);
        },
      });
    });
  });

  describe('executeTransaction', () => {
    it('should execute transaction successfully', async () => {
      const executeTransactionRequest = {
        network: 'localhost',
        walletAddress: '0x1234567890123456789012345678901234567890',
        nonce: '0',
        signedTransaction: '0x0',
        transactionData: '0x0',
      };

      const mockResponse = {
        hash: '0x82b9eea000ba798f1cae87bc89024a7cb55bc180db6e9545096e3eb2a7f38c9275d51018b41fc8779577b5f73c36ae5c5a1bd4a48a6a63bd880b1493bb20ad701c',
      };
      jest.spyOn(sapphireRelayerMock, 'send').mockReturnValue(of(mockResponse));

      apiGatewayService
        .executeTransaction(executeTransactionRequest)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
        });
    });

    it('should handle errors and throw RpcException', async () => {
      const executeTransactionRequest = {
        network: 'localhost',
        walletAddress: '0x1234567890123456789012345678901234567890',
        nonce: '0',
        signedTransaction: '0x0',
        transactionData: '0x0',
      };

      const rpcExceptionMock = new RpcException('Original RPC error');

      jest
        .spyOn(sapphireRelayerMock, 'send')
        .mockReturnValue(throwError(() => rpcExceptionMock));

      apiGatewayService
        .executeTransaction(executeTransactionRequest)
        .subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(RpcException);
          },
        });
    });
  });
});
