import { Test, TestingModule } from '@nestjs/testing';
import { WalletFactoryController } from '../src/wallet-factory.controller';
import { WalletFactoryService } from '../src/wallet-factory.service';
import { BlockchainService } from '../src/blockchain/blockchain.service';
import { EnvironmentModule } from '../src/environment/environment.module';
import { BlockchainModule } from '../src/blockchain/blockchain.module';
import { EnvironmentService } from '../src/environment/environment.service';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CreateWalletRequestEvent } from '../src/events/create-wallet-request.event';

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
    it('Create wallet localhost', async () => {
      jest.spyOn(blockchainService, 'getHardhatProvider').mockReturnValue(null);
      jest.spyOn(blockchainService, 'getSigner').mockReturnValue(null);
      jest.spyOn(environmentService, 'get').mockReturnValue(null);
      jest
        .spyOn(environmentService, 'getContractAddress')
        .mockReturnValue(null);

      jest
        .spyOn(walletFactoryService, 'callWalletFactoryContract')
        .mockResolvedValue({
          address: '0x1234567890123456789012345678901234567890',
        });

      const data = new CreateWalletRequestEvent('0x0', 'localhost');

      const result =
        await walletFactoryController.handleCreateWalletRequest(data);

      expect(blockchainService.getHardhatProvider).toHaveBeenCalled();
      expect(blockchainService.getSigner).toHaveBeenCalled();
      expect(environmentService.get).toHaveBeenCalled();
      expect(environmentService.getContractAddress).toHaveBeenCalled();
      expect(walletFactoryService.callWalletFactoryContract).toHaveBeenCalled();
      expect(result).toEqual({
        address: '0x1234567890123456789012345678901234567890',
      });
    });

    it('Create wallet sepolia', async () => {
      jest.spyOn(blockchainService, 'getSepoliaProvider').mockReturnValue(null);
      jest.spyOn(blockchainService, 'getSigner').mockReturnValue(null);
      jest.spyOn(environmentService, 'get').mockReturnValue(null);
      jest
        .spyOn(environmentService, 'getContractAddress')
        .mockReturnValue(null);
      jest
        .spyOn(walletFactoryService, 'callWalletFactoryContract')
        .mockResolvedValue({
          address: '0x1234567890123456789012345678901234567890',
        });

      const data = new CreateWalletRequestEvent('0x0', 'sepolia');

      const result =
        await walletFactoryController.handleCreateWalletRequest(data);

      expect(blockchainService.getSepoliaProvider).toHaveBeenCalled();
      expect(blockchainService.getSigner).toHaveBeenCalled();
      expect(environmentService.get).toHaveBeenCalled();
      expect(environmentService.getContractAddress).toHaveBeenCalled();
      expect(walletFactoryService.callWalletFactoryContract).toHaveBeenCalled();
      expect(result).toEqual({
        address: '0x1234567890123456789012345678901234567890',
      });
    });

    it('Create wallet unknown network', async () => {
      const data = new CreateWalletRequestEvent('0x0', 'sapphire network');

      await expect(
        walletFactoryController.handleCreateWalletRequest(data),
      ).rejects.toThrow(
        new RpcException(
          new BadRequestException(`Network '${data.network}' not found`),
        ),
      );
    });
  });
});
