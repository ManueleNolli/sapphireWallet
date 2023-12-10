import { Test, TestingModule } from '@nestjs/testing';
import { WalletFactoryController } from '../wallet-factory.controller';
import { WalletFactoryService } from '../wallet-factory.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { EnvironmentModule } from '../environment/environment.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { EnvironmentService } from '../environment/environment.service';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateWalletRequestEvent } from '../events/create-wallet-request.event';
import { Wallet } from 'ethers';

describe('AppController', () => {
  let walletFactoryController: WalletFactoryController;
  let blockchainService: BlockchainService;
  let environmentService: EnvironmentService;
  let walletFactoryService: WalletFactoryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletFactoryController],
      providers: [WalletFactoryService],
      imports: [EnvironmentModule, BlockchainModule],
    }).compile();

    walletFactoryController = app.get<WalletFactoryController>(
      WalletFactoryController,
    );
    blockchainService = app.get<BlockchainService>(BlockchainService);
    environmentService = app.get<EnvironmentService>(EnvironmentService);
    walletFactoryService = app.get<WalletFactoryService>(WalletFactoryService);
  });

  describe('Create Wallet Request', () => {
    it('Create wallet', async () => {
      jest.spyOn(environmentService, 'getUnhandled').mockReturnValue(undefined);
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue('signerPrivateKey');
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);

      jest
        .spyOn(walletFactoryService, 'callWalletFactoryContract')
        .mockResolvedValue({
          address: '0x1234567890123456789012345678901234567890',
          network: 'localhost',
        });

      const data = new CreateWalletRequestEvent('0x0', 'localhost');

      const result =
        await walletFactoryController.handleCreateWalletRequest(data);

      expect(environmentService.getWithNetwork).toHaveBeenCalled();
      expect(environmentService.getUnhandled).toHaveBeenCalled();
      expect(walletFactoryService.callWalletFactoryContract).toHaveBeenCalled();
      expect(result).toEqual({
        address: '0x1234567890123456789012345678901234567890',
        network: 'localhost',
      });
    });
  });
});
