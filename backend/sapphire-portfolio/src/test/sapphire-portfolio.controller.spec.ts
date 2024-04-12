import { Test, TestingModule } from '@nestjs/testing';
import { SapphirePortfolioController } from '../sapphire-portfolio.controller';
import { SapphirePortfolioService } from '../sapphire-portfolio.service';
import { EnvironmentModule } from '../environment/environment.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { EnvironmentService } from '../environment/environment.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Wallet } from 'ethers';
import { GetBalanceEvent } from '../events/get-balance-event';

describe('AppController', () => {
  let sapphirePortfolioController: SapphirePortfolioController;
  let blockchainService: BlockchainService;
  let environmentService: EnvironmentService;
  let sapphireService: SapphirePortfolioService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SapphirePortfolioController],
      providers: [SapphirePortfolioService],
      imports: [EnvironmentModule, BlockchainModule],
    }).compile();

    sapphirePortfolioController = app.get<SapphirePortfolioController>(
      SapphirePortfolioController,
    );

    blockchainService = app.get<BlockchainService>(BlockchainService);
    environmentService = app.get<EnvironmentService>(EnvironmentService);
    sapphireService = app.get<SapphirePortfolioService>(
      SapphirePortfolioService,
    );
  });

  describe('getBalance', () => {
    it('should return list of balance', async () => {
      jest.spyOn(environmentService, 'getUnhandled').mockReturnValue(undefined);
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue(undefined);
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);
      jest
        .spyOn(sapphireService, 'getChains')
        .mockResolvedValue([1337n, 11155111n, 80002n]);

      jest.spyOn(blockchainService, 'getChainID').mockResolvedValue(1337n);

      jest
        .spyOn(sapphireService, 'getBaseChainBalance')
        .mockResolvedValue(1000000000000000000n);

      jest
        .spyOn(sapphireService, 'getDestChainBalance')
        .mockResolvedValue(2000000000000000000n);

      const data = new GetBalanceEvent('0x0', 'localhost');

      const result = await sapphirePortfolioController.getBalance(data);

      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'API_KEY',
        'localhost',
      );
      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'ADDRESS',
        'localhost',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(5);

      expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();

      expect(sapphireService.getChains).toHaveBeenCalled();

      expect(blockchainService.getChainID).toHaveBeenCalled();

      expect(sapphireService.getBaseChainBalance).toHaveBeenCalledTimes(1);

      expect(sapphireService.getDestChainBalance).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        localhost: {
          chainID: '1337',
          balance: '1000000000000000000',
          crypto: 'ETH',
        },
        sepolia: {
          chainID: '11155111',
          balance: '2000000000000000000',
          crypto: 'ETH',
        },
        amoy: {
          chainID: '80002',
          balance: '2000000000000000000',
          crypto: 'MATIC',
        },
      });
    });
  });
});
