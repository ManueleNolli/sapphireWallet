import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from '../environment/environment.service';
import { Wallet } from 'ethers';
import {
  ArgentWrappedAccounts__factory,
  BaseWallet__factory,
  ERC721__factory,
  ERC721Enumerable__factory,
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

  describe('getNFTBalance', () => {
    it('should get the NFT balance', async () => {
      const nftStorageMock = {
        balanceOf: jest.fn().mockResolvedValue('2'),
      };

      jest
        .spyOn(ERC721__factory, 'connect')
        .mockReturnValue(nftStorageMock as any);

      const result = await sapphireRelayerPortfolio.getNFTBalance(
        {} as Wallet,
        '0x0000000',
        '0x0000000',
      );

      expect(result).toEqual(2);
    });
  });

  describe('getWrappedAccountAddress', () => {
    it('should get Wrapped Account Address address', async () => {
      const getAccountContractMock = {
        getAccountContract: jest.fn().mockResolvedValue('0x012345'),
      };

      jest
        .spyOn(ArgentWrappedAccounts__factory, 'connect')
        .mockReturnValue(getAccountContractMock as any);

      const result = await sapphireRelayerPortfolio.getWrappedAccountAddress(
        {} as Wallet,
        '0x0000000',
        '0x0000000',
      );

      expect(result).toEqual('0x012345');
    });
  });

  describe('getNFTMetadata', () => {
    it('should get all nfts', async () => {
      const ERC721EnumerableMock = {
        balanceOf: jest.fn().mockResolvedValue(2),
        tokenOfOwnerByIndex: jest.fn().mockImplementation((_, i) => i),
        tokenURI: jest.fn().mockImplementation((i) => `ipfs://aaaa/${i}`),
      };

      jest
        .spyOn(ERC721Enumerable__factory, 'connect')
        .mockReturnValue(ERC721EnumerableMock as any);

      const fetchMock = jest.fn().mockImplementation(() => {
        return {
          json: jest.fn().mockResolvedValue({
            name: `mockName0`,
            description: `mockDescription0`,
            image: `ipfs://mockImage0.png`,
            attributes: [],
          }),
        };
      });
      const fetchMock2 = jest.fn().mockImplementation(() => {
        return {
          json: jest.fn().mockResolvedValue({
            name: `mockName1`,
            description: `mockDescription1`,
            image: `ipfs://mockImage1.png`,
            attributes: [],
          }),
        };
      });

      jest.spyOn(global, 'fetch').mockImplementationOnce(fetchMock);
      jest.spyOn(global, 'fetch').mockImplementationOnce(fetchMock2);

      const result = await sapphireRelayerPortfolio.getNFTMetadata(
        {} as Wallet,
        '0x0000000',
        '0x0000001',
        'mockNetwork',
        'https://mockIpfsGateway/',
      );

      expect(result).toEqual([
        {
          collectionAddress: '0x0000001',
          collectionDescription: '',
          collectionName: '',
          description: 'mockDescription0',
          image: 'https://mockIpfsGateway/mockImage0.png',
          name: 'mockName0',
          network: 'mockNetwork',
          tokenId: 0,
        },
        {
          collectionAddress: '0x0000001',
          collectionDescription: '',
          collectionName: '',
          description: 'mockDescription1',
          image: 'https://mockIpfsGateway/mockImage1.png',
          name: 'mockName1',
          network: 'mockNetwork',
          tokenId: 1,
        },
      ]);
    });

    it('should skip nfts without tokenURI', async () => {
      const ERC721EnumerableMock = {
        balanceOf: jest.fn().mockResolvedValue(2),
        tokenOfOwnerByIndex: jest.fn().mockImplementation((_, i) => i),
        tokenURI: jest.fn().mockImplementationOnce((i) => `ipfs://aaaa/${i}`), // first token has tokenURI
      };

      jest
        .spyOn(ERC721Enumerable__factory, 'connect')
        .mockReturnValueOnce(ERC721EnumerableMock as any);

      const fetchMock = jest.fn().mockImplementation(() => {
        return {
          json: jest.fn().mockResolvedValue({
            name: `mockName0`,
            description: `mockDescription0`,
            image: `ipfs://mockImage0.png`,
            attributes: [],
          }),
        };
      });

      jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

      const result = await sapphireRelayerPortfolio.getNFTMetadata(
        {} as Wallet,
        '0x0000000',
        '0x0000001',
        'mockNetwork',
        'https://mockIpfsGateway/',
      );

      expect(result).toEqual([
        {
          collectionAddress: '0x0000001',
          collectionDescription: '',
          collectionName: '',
          description: 'mockDescription0',
          image: 'https://mockIpfsGateway/mockImage0.png',
          name: 'mockName0',
          network: 'mockNetwork',
          tokenId: 0,
        },
      ]);
    });
  });
});
