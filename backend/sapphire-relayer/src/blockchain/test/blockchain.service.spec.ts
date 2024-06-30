import { BlockchainService } from '../blockchain.service';
import { BadRequestException } from '@nestjs/common';
import { AlchemyProvider, ethers, JsonRpcProvider, Wallet } from 'ethers';
import { RpcException } from '@nestjs/microservices';

describe('BlockchainService', () => {
  let blockchainService: BlockchainService;

  beforeEach(() => {
    blockchainService = new BlockchainService();
  });

  describe('testConnection', () => {
    it('should not throw an exception when the connection is successful', async () => {
      const providerMock = {
        getBlockNumber: jest.fn().mockResolvedValueOnce(123),
      } as unknown as ethers.Provider;

      await expect(
        blockchainService.testConnection(providerMock),
      ).resolves.not.toThrow();
    });

    it('should throw RpcException when the connection fails', async () => {
      const providerMock = {
        getBlockNumber: jest
          .fn()
          .mockRejectedValueOnce(new Error('Connection error')),
      } as unknown as ethers.Provider;

      await expect(
        blockchainService.testConnection(providerMock),
      ).rejects.toThrow(
        new RpcException(
          new BadRequestException('Connection to blockchain failed'),
        ),
      );
    });
  });

  describe('getHardhatProvider', () => {
    it('should return a JsonRpcProvider with a successful connection', async () => {
      jest
        .spyOn(blockchainService, 'testConnection')
        .mockResolvedValueOnce(undefined);

      const provider = await blockchainService.getHardhatProvider('address');

      expect(provider).toBeInstanceOf(JsonRpcProvider);
    });
  });

  describe('getSepoliaProvider', () => {
    it('should return an AlchemyProvider with a successful connection', async () => {
      jest
        .spyOn(blockchainService, 'testConnection')
        .mockResolvedValueOnce(undefined);

      const api_key = 'test_api_key';
      const provider = await blockchainService.getSepoliaProvider(api_key);

      expect(provider).toBeInstanceOf(AlchemyProvider);
    });
  });

  describe('getAmoyProvider', () => {
    it('should return an AlchemyProvider with a successful connection', async () => {
      jest
        .spyOn(blockchainService, 'testConnection')
        .mockResolvedValueOnce(undefined);

      const api_key = 'test_api_key';
      const provider = await blockchainService.getAmoyProvider(api_key);

      expect(provider).toBeInstanceOf(JsonRpcProvider);
    });
  });

  describe('getSigner', () => {
    it('should return a Wallet with the provided private key and provider', async () => {
      const private_key =
        'afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890';
      const providerMock = {} as ethers.Provider;

      const signer = await blockchainService.getSigner(
        private_key,
        providerMock,
      );

      expect(signer).toBeInstanceOf(Wallet);
      expect(signer.privateKey).toEqual(`0x${private_key}`);
      expect(signer.provider).toEqual(providerMock);
    });
  });

  describe('getProviderAndSigner', () => {
    it('should return a signer for localhost', async () => {
      jest
        .spyOn(blockchainService, 'getHardhatProvider')
        .mockResolvedValueOnce({} as JsonRpcProvider);
      jest
        .spyOn(blockchainService, 'getSigner')
        .mockResolvedValueOnce({} as Wallet);

      await blockchainService.getProviderAndSigner({
        network: 'localhost',
        signerKey: 'test_private_key',
        localHostAddress: 'test_local_host_address',
      });

      expect(blockchainService.getHardhatProvider).toHaveBeenCalled();
      expect(blockchainService.getSigner).toHaveBeenCalled();
    });

    it('should return a signer for sepolia', async () => {
      jest
        .spyOn(blockchainService, 'getSepoliaProvider')
        .mockResolvedValueOnce({} as AlchemyProvider);
      jest
        .spyOn(blockchainService, 'getSigner')
        .mockResolvedValueOnce({} as Wallet);

      await blockchainService.getProviderAndSigner({
        network: 'sepolia',
        signerKey: 'test_private_key',
        apiKey: 'test_api_key',
      });

      expect(blockchainService.getSepoliaProvider).toHaveBeenCalled();
      expect(blockchainService.getSigner).toHaveBeenCalled();
    });

    it('should return a signer for amoy', async () => {
      jest
        .spyOn(blockchainService, 'getAmoyProvider')
        .mockResolvedValueOnce({} as JsonRpcProvider);
      jest
        .spyOn(blockchainService, 'getSigner')
        .mockResolvedValueOnce({} as Wallet);

      await blockchainService.getProviderAndSigner({
        network: 'amoy',
        signerKey: 'test_private_key',
        apiKey: 'test_api_key',
      });

      expect(blockchainService.getAmoyProvider).toHaveBeenCalled();
      expect(blockchainService.getSigner).toHaveBeenCalled();
    });

    it('should return a network not found', async () => {
      await expect(
        blockchainService.getProviderAndSigner({
          network: 'sapphire_network',
          signerKey: 'test_private_key',
        }),
      ).rejects.toThrow(
        new RpcException(
          new BadRequestException(`Network 'sapphire_network' not found`),
        ),
      );
    });
  });
});
