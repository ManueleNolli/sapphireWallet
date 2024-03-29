import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from '../environment/environment.service';
import { Wallet } from 'ethers';
import {
  ArgentWrappedAccounts__factory,
  BaseWallet__factory,
} from '../contracts';
import { SapphirePortfolioService } from '../sapphire-portfolio.service';

describe('SapphireRelyerService', () => {
  let sapphireRelayerPortfolio: SapphirePortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SapphirePortfolioService, EnvironmentService],
    }).compile();

    sapphireRelayerPortfolio = module.get<SapphirePortfolioService>(
      SapphirePortfolioService,
    );
  });

  describe('getChains', () => {
    it('should get the chains', async () => {
      const baseWalletMock = {
        getChains: jest.fn().mockResolvedValue(['mock1', 'mock2']),
      };

      jest
        .spyOn(BaseWallet__factory, 'connect')
        .mockReturnValue(baseWalletMock as any);

      const result = await sapphireRelayerPortfolio.getChains(
        {} as Wallet,
        '0x0000000',
      );

      expect(result).toEqual(['mock1', 'mock2']);
    });
  });

  describe('getBaseChainBalance', () => {
    it('should get the base chain balance', async () => {
      const providerMock = {
        getBalance: jest.fn().mockResolvedValue('mock'),
      };

      const walletMock = {
        provider: providerMock as any,
      };

      const result = await sapphireRelayerPortfolio.getBaseChainBalance(
        walletMock as Wallet,
        '0x0000000',
      );

      expect(result).toEqual('mock');
    });
  });

  describe('getDestChainBalance', () => {
    it('should get the destination chain balance', async () => {
      const argentWrappedAccountsMock = {
        getAccountBalance: jest.fn().mockResolvedValue('mock'),
      };

      jest
        .spyOn(ArgentWrappedAccounts__factory, 'connect')
        .mockReturnValue(argentWrappedAccountsMock as any);

      const result = await sapphireRelayerPortfolio.getDestChainBalance(
        {} as Wallet,
        '0x0000000',
        '0x0000000',
      );

      expect(result).toEqual('mock');
    });
  });
});
