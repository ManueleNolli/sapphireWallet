import { BlockchainService } from '../src/blockchain/blockchain.service';
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
      ).rejects.toThrowError(
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

      const provider = await blockchainService.getHardhatProvider();

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
});
