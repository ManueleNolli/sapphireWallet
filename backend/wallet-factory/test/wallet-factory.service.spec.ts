import { Test, TestingModule } from '@nestjs/testing';
import { WalletFactoryService } from '../src/wallet-factory.service';
import { EnvironmentService } from '../src/environment/environment.service';
import { ethers, Wallet, ContractTransaction } from 'ethers';
import { CreateWalletRequest } from '../src/dto/create-wallet-request.dto';
import { WalletFactory__factory } from '../src/contracts';

jest.mock('../src/environment/environment.service');

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
      const getContractAddressMock = jest.spyOn(
        // for argentModuleAddress
        environmentService,
        'getContractAddress',
      );
      getContractAddressMock.mockReturnValue('mockedContractAddress');

      // Mocking ethers functions
      const randomBytesMock = jest.spyOn(ethers, 'randomBytes');
      randomBytesMock.mockReturnValueOnce(ethers.toUtf8Bytes('mockedSalt'));

      // Mocking wait function
      const waitMock = jest.fn();
      const waitPromiseMock = Promise.resolve(); // Mocking the wait function to resolve immediately
      waitMock.mockReturnValue(waitPromiseMock);

      // Mocking getAddressForCounterfactualWallet and createCounterfactualWallet
      const getAddressForCounterfactualWalletMock = jest
        .fn()
        .mockResolvedValue('mockedExpectedAddress');
      const createCounterfactualWalletMock = jest.fn().mockResolvedValue({
        hash: 'fakeTransactionHash',
        wait: waitMock,
      } as unknown as ContractTransaction);

      // Mocking WalletFactory__factory.connect method
      const walletFactoryMock = {
        getAddressForCounterfactualWallet:
          getAddressForCounterfactualWalletMock,
        createCounterfactualWallet: createCounterfactualWalletMock,
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
        'mockedContractAddress',
        data,
      );

      // Assertions
      expect(result).toEqual({ address: 'mockedExpectedAddress' });
      expect(getContractAddressMock).toHaveBeenCalledWith(
        'ARGENT_MODULE_ADDRESS',
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
  });
});
