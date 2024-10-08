import { Test, TestingModule } from '@nestjs/testing';
import { SapphirePortfolioController } from '../sapphire-portfolio.controller';
import { SapphirePortfolioService } from '../sapphire-portfolio.service';
import { EnvironmentModule } from '../environment/environment.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { EnvironmentService } from '../environment/environment.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Wallet, ZeroAddress } from 'ethers';
import { GetBalanceEvent } from '../events/get-balance-event';
import { GetNFTBalanceEvent } from '../events/get-nft-balance-event';
import { GetNFTMetadataEvent } from '../events/get-nft-metadata-event';

describe('AppController', () => {
  let sapphirePortfolioController: SapphirePortfolioController;
  let blockchainService: BlockchainService;
  let environmentService: EnvironmentService;
  let sapphireService: SapphirePortfolioService;

  beforeEach(async () => {
    jest.clearAllMocks();

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

  describe('getNFTBalance', () => {
    it('should return NFT balances for all chains', async () => {
      jest
        .spyOn(environmentService, 'getUnhandled')
        .mockReturnValue('mockValue');
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue('mockValue');
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);
      jest
        .spyOn(sapphireService, 'getChains')
        .mockResolvedValue([11155111n, 80002n]);
      jest.spyOn(blockchainService, 'getChainID').mockResolvedValue(11155111n);
      jest.spyOn(sapphireService, 'getNFTBalance').mockResolvedValue(10);
      jest
        .spyOn(sapphireService, 'getWrappedAccountAddress')
        .mockResolvedValue('0x0000000');

      const data = new GetNFTBalanceEvent('0x0', 'sepolia');

      const result = await sapphirePortfolioController.getNFTBalance(data);

      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'API_KEY',
        'sepolia',
      );
      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'ADDRESS',
        'sepolia',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(5);
      expect(blockchainService.getProviderAndSigner).toHaveBeenCalledTimes(2);
      expect(sapphireService.getChains).toHaveBeenCalled();
      expect(blockchainService.getChainID).toHaveBeenCalled();
      expect(sapphireService.getNFTBalance).toHaveBeenCalledTimes(2);
      expect(sapphireService.getWrappedAccountAddress).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        sepolia: 10,
        amoy: 10,
      });
    });

    it('should return 0 for NFT balance if wrapped account address is zero address', async () => {
      jest
        .spyOn(environmentService, 'getUnhandled')
        .mockReturnValue('mockValue');
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue('mockValue');
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);
      jest
        .spyOn(sapphireService, 'getChains')
        .mockResolvedValue([11155111n, 80002n]);
      jest.spyOn(blockchainService, 'getChainID').mockResolvedValue(11155111n);
      jest.spyOn(sapphireService, 'getNFTBalance').mockResolvedValue(10);
      jest
        .spyOn(sapphireService, 'getWrappedAccountAddress')
        .mockResolvedValue(ZeroAddress);

      const data = new GetNFTBalanceEvent('0x0', 'sepolia');

      const result = await sapphirePortfolioController.getNFTBalance(data);

      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'API_KEY',
        'sepolia',
      );
      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'ADDRESS',
        'sepolia',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(4);
      expect(blockchainService.getProviderAndSigner).toHaveBeenCalledTimes(2);
      expect(sapphireService.getChains).toHaveBeenCalled();
      expect(blockchainService.getChainID).toHaveBeenCalled();
      expect(sapphireService.getNFTBalance).toHaveBeenCalledTimes(1);
      expect(sapphireService.getWrappedAccountAddress).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        sepolia: 10,
        amoy: 0,
      });
    });
  });

  describe('getNFTMetadata', () => {
    it('should return NFT metadata for base chain', async () => {
      jest
        .spyOn(environmentService, 'getUnhandled')
        .mockReturnValue('mockValue');
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue('mockValue');
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);
      jest.spyOn(sapphireService, 'getNFTMetadata').mockResolvedValue([
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

      const data = new GetNFTMetadataEvent('0x0', 'sepolia');

      const result = await sapphirePortfolioController.getNFTMetadata(data);

      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'API_KEY',
        'sepolia',
      );
      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'ADDRESS',
        'sepolia',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
        'SAPPHIRE_NFTS_ADDRESS',
        'sepolia',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(2);
      expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();
      expect(sapphireService.getNFTMetadata).toHaveBeenCalled();

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

    it('should return NFT metadata for dest chain', async () => {
      jest
        .spyOn(environmentService, 'getUnhandled')
        .mockReturnValue('mockValue');
      jest
        .spyOn(environmentService, 'getWithNetwork')
        .mockReturnValue('mockValue');
      jest
        .spyOn(blockchainService, 'getProviderAndSigner')
        .mockResolvedValue({} as Wallet);
      jest.spyOn(sapphireService, 'getNFTMetadata').mockResolvedValue([
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

      const data = new GetNFTMetadataEvent('0x0', 'amoy');

      const result = await sapphirePortfolioController.getNFTMetadata(data);

      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'API_KEY',
        'amoy',
      );
      expect(environmentService.getUnhandled).toHaveBeenCalledWith(
        'ADDRESS',
        'amoy',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
        'DEST_CHAIN_NFT_STORAGE_ADDRESS',
        'amoy',
      );
      expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(2);
      expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();
      expect(sapphireService.getNFTMetadata).toHaveBeenCalled();

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
  });
});
