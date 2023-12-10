import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from '../environment/environment.service';
import { Wallet, ContractTransaction } from 'ethers';
import {
  ArgentModule__factory,
  SapphireAuthoriser__factory,
} from '../contracts';
import { SapphireRelayerService } from '../sapphire-relayer.service';
import { AddAuthorised } from '../dto/add-authorised.dto';
import { ExecuteTransaction } from '../dto/execute-transaction.dto';

describe('SapphireRelyerService', () => {
  let sapphireRelayerService: SapphireRelayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SapphireRelayerService, EnvironmentService],
    }).compile();

    sapphireRelayerService = module.get<SapphireRelayerService>(
      SapphireRelayerService,
    );
  });

  describe('addAuthorised', () => {
    it('should add an authorised address', async () => {
      const sapphireAuthoriserMock = {
        setAuthorised: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue({
            blockNumber: 1,
          }),
        } as unknown as ContractTransaction),
        filters: {
          Authorised: jest.fn(),
        },
        queryFilter: jest.fn().mockResolvedValue([
          {
            args: {
              value: 'mock',
            },
          },
        ]),
      };
      jest
        .spyOn(SapphireAuthoriser__factory, 'connect')
        .mockReturnValue(sapphireAuthoriserMock as any);

      const data: AddAuthorised = {
        address: '0x1110000',
        network: 'localhost',
      };

      const result = await sapphireRelayerService.addAuthorised(
        {} as Wallet,
        '0x0000000',
        data,
      );

      expect(result).toEqual({
        address: '0x1110000',
        network: 'localhost',
      });
    });

    it('should handle event not emitted', async () => {
      const sapphireAuthoriserMock = {
        setAuthorised: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue({
            blockNumber: 1,
          }),
        } as unknown as ContractTransaction),
        filters: {
          Authorised: jest.fn(),
        },
        queryFilter: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(SapphireAuthoriser__factory, 'connect')
        .mockReturnValue(sapphireAuthoriserMock as any);

      const data: AddAuthorised = {
        address: '0x1110000',
        network: 'localhost',
      };

      await expect(
        sapphireRelayerService.addAuthorised({} as Wallet, '0x0000000', data),
      ).rejects.toThrow("Blockchain does not confirm event 'Authorised'");
    });
  });

  describe('executeTransaction', () => {
    it('should execute transaction', async () => {
      const argentModuleMock = {
        execute: jest.fn().mockResolvedValue({
          hash: 'hashMock',
          wait: jest.fn().mockResolvedValue({
            blockNumber: 1,
          }),
        } as unknown as ContractTransaction),
        filters: {
          TransactionExecuted: jest.fn(),
        },
        queryFilter: jest.fn().mockResolvedValue([
          {
            args: ['mock', true],
          },
        ]),
      };

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any);

      const data: ExecuteTransaction = {
        walletAddress: '0x1110000',
        nonce: '0x0000000',
        signedTransaction: '0x0000000',
        transactionData: '0x0000000',
        network: 'localhost',
      };

      const result = await sapphireRelayerService.executeTransaction(
        {} as Wallet,
        '0x0000000',
        data,
      );

      expect(result).toEqual({
        hash: 'hashMock',
      });
    });

    it('should handle event not emitted', async () => {
      const argentModuleMock = {
        execute: jest.fn().mockResolvedValue({
          hash: 'hashMock',
          wait: jest.fn().mockResolvedValue({
            blockNumber: 1,
          }),
        } as unknown as ContractTransaction),
        filters: {
          TransactionExecuted: jest.fn(),
        },
        queryFilter: jest.fn().mockResolvedValue([]),
      };

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any);

      const data: ExecuteTransaction = {
        walletAddress: '0x1110000',
        nonce: '0x0000000',
        signedTransaction: '0x0000000',
        transactionData: '0x0000000',
        network: 'localhost',
      };

      await expect(
        sapphireRelayerService.executeTransaction(
          {} as Wallet,
          '0x0000000',
          data,
        ),
      ).rejects.toThrow(
        "Blockchain does not confirm event 'TransactionExecuted'",
      );
    });

    it('should handle event emitted but transaction failed', async () => {
      const argentModuleMock = {
        execute: jest.fn().mockResolvedValue({
          hash: 'hashMock',
          wait: jest.fn().mockResolvedValue({
            blockNumber: 1,
          }),
        } as unknown as ContractTransaction),
        filters: {
          TransactionExecuted: jest.fn(),
        },
        queryFilter: jest.fn().mockResolvedValue([
          {
            args: ['mock', false],
          },
        ]),
      };

      jest
        .spyOn(ArgentModule__factory, 'connect')
        .mockReturnValue(argentModuleMock as any);

      const data: ExecuteTransaction = {
        walletAddress: '0x1110000',
        nonce: '0x0000000',
        signedTransaction: '0x0000000',
        transactionData: '0x0000000',
        network: 'localhost',
      };

      await expect(
        sapphireRelayerService.executeTransaction(
          {} as Wallet,
          '0x0000000',
          data,
        ),
      ).rejects.toThrow('Relayer executed the transaction, but it failed');
    });
  });
});
