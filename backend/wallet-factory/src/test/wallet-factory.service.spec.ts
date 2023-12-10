import { Test, TestingModule } from '@nestjs/testing';
import { WalletFactoryService } from '../wallet-factory.service';
import { EnvironmentService } from '../environment/environment.service';
import { ethers, Wallet, ContractTransaction } from 'ethers';
import { CreateWalletRequest } from '../dto/create-wallet-request.dto';
import { WalletFactory__factory } from '../contracts';
import { ServiceUnavailableException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

jest.mock('../environment/environment.service');

describe('WalletFactoryService', () => {
  let walletFactoryService: WalletFactoryService;
  let environmentService: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletFactoryService, EnvironmentService],
    }).compile();

    walletFactoryService =
      module.get<WalletFactoryService>(WalletFactoryService);
    environmentService = module.get<EnvironmentService>(EnvironmentService);
  });

  describe('callWalletFactoryContract', () => {
    it('should create a counterfactual wallet and return the expected address', async () => {
      // Mocking environmentService.getContractAddress method
      const getWithNetworkMock = jest.spyOn(
        // for argentModuleAddress
        environmentService,
        'getWithNetwork',
      );
      getWithNetworkMock.mockReturnValue('mockedContractAddress');

      // Mocking ethers functions
      const randomBytesMock = jest.spyOn(ethers, 'randomBytes');
      randomBytesMock.mockReturnValueOnce(ethers.toUtf8Bytes('mockedSalt'));

      // Mocking wait function
      const waitMock = jest.fn().mockResolvedValue({
        blockNumber: 1,
      });

      // Mocking getAddressForCounterfactualWallet and createCounterfactualWallet
      const getAddressForCounterfactualWalletMock = jest
        .fn()
        .mockResolvedValue('mockedExpectedAddress');
      const createCounterfactualWalletMock = jest.fn().mockResolvedValue({
        hash: 'fakeTransactionHash',
        wait: waitMock,
      } as unknown as ContractTransaction);

      // Mock query filter
      const queryFilterMock = jest.fn().mockResolvedValue([
        {
          args: {
            wallet: 'mockedExpectedAddress',
          },
        },
      ]);

      // Mocking WalletFactory__factory.connect method
      const walletFactoryMock = {
        getAddressForCounterfactualWallet:
          getAddressForCounterfactualWalletMock,
        createCounterfactualWallet: createCounterfactualWalletMock,
        filters: {
          WalletCreated: jest.fn(),
        },
        queryFilter: queryFilterMock,
      };
      jest
        .spyOn(WalletFactory__factory, 'connect')
        .mockReturnValue(walletFactoryMock as any);

      // Mocking input data
      const data: CreateWalletRequest = {
        eoaAddress: 'mockedEOAAddress',
        network: 'mockedNetwork',
      };

      // Mocking signer
      const signerMock = {} as Wallet;

      // Testing the method
      const result = await walletFactoryService.callWalletFactoryContract(
        signerMock,
        data,
      );

      // Assertions
      expect(result).toEqual({
        address: 'mockedExpectedAddress',
        network: 'mockedNetwork',
      });
      expect(getWithNetworkMock).toHaveBeenCalledWith(
        'ARGENT_MODULE_ADDRESS',
        'mockedNetwork',
      );
      expect(getWithNetworkMock).toHaveBeenCalledWith(
        'WALLET_FACTORY_ADDRESS',
        'mockedNetwork',
      );
      expect(randomBytesMock).toHaveBeenCalledWith(20);
      expect(getAddressForCounterfactualWalletMock).toHaveBeenCalledWith(
        'mockedEOAAddress',
        ['mockedContractAddress'],
        signerMock.address,
        '0x000000000000000000006d6f636b656453616c74', // 'mockedSalt' in hex
      );
      expect(createCounterfactualWalletMock).toHaveBeenCalledWith(
        'mockedEOAAddress',
        ['mockedContractAddress'],
        signerMock.address,
        '0x000000000000000000006d6f636b656453616c74', // 'mockedSalt' in hex
        0,
        '0x0000000000000000000000000000000000000000',
        '0x',
        '0x',
      );
    });

    it('should handle the case where the event is not emitted', async () => {
      // Mocking environmentService.getContractAddress method
      const getWithNetworkMock = jest.spyOn(
        // for argentModuleAddress
        environmentService,
        'getWithNetwork',
      );
      getWithNetworkMock.mockReturnValue('mockedContractAddress');

      // Mocking ethers functions
      const randomBytesMock = jest.spyOn(ethers, 'randomBytes');
      randomBytesMock.mockReturnValueOnce(ethers.toUtf8Bytes('mockedSalt'));

      // Mocking wait function
      const waitMock = jest.fn().mockResolvedValue({
        blockNumber: 1,
      });

      // Mocking getAddressForCounterfactualWallet and createCounterfactualWallet
      const getAddressForCounterfactualWalletMock = jest
        .fn()
        .mockResolvedValue('mockedExpectedAddress');
      const createCounterfactualWalletMock = jest.fn().mockResolvedValue({
        hash: 'fakeTransactionHash',
        wait: waitMock,
      } as unknown as ContractTransaction);

      // Mock query filter
      const queryFilterMock = jest.fn().mockResolvedValue([]);

      // Mocking WalletFactory__factory.connect method
      const walletFactoryMock = {
        getAddressForCounterfactualWallet:
          getAddressForCounterfactualWalletMock,
        createCounterfactualWallet: createCounterfactualWalletMock,
        filters: {
          WalletCreated: jest.fn(),
        },
        queryFilter: queryFilterMock,
      };
      jest
        .spyOn(WalletFactory__factory, 'connect')
        .mockReturnValue(walletFactoryMock as any);

      // Mocking input data
      const data: CreateWalletRequest = {
        eoaAddress: 'mockedEOAAddress',
        network: 'mockedNetwork',
      };

      // Mocking signer
      const signerMock = {} as Wallet;

      // Testing the method
      await expect(
        walletFactoryService.callWalletFactoryContract(signerMock, data),
      ).rejects.toThrow(
        new RpcException(
          new ServiceUnavailableException(
            "Blockchain does not confirm event 'WalletCreated'",
          ),
        ),
      );
    });
  });
});
