import { Test, TestingModule } from '@nestjs/testing';
import { SapphireRelayerController } from '../sapphire-relayer.controller';
import { SapphireRelayerService } from '../sapphire-relayer.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { EnvironmentService } from '../environment/environment.service';
import { EnvironmentModule } from '../environment/environment.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { Wallet } from 'ethers';
import { AddAuthorisedEvent } from '../events/add-authorised.event';
import { ExecuteTransactionEvent } from '../events/execute-transaction.event';
import { GetWrappedAccountAddressEvent } from '../events/get-wrapped-account-address.event';

describe('AppController', () => {
  let sapphireRelayerController: SapphireRelayerController;
  let blockchainService: BlockchainService;
  let environmentService: EnvironmentService;
  let sapphireService: SapphireRelayerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SapphireRelayerController],
      providers: [SapphireRelayerService],
      imports: [EnvironmentModule, BlockchainModule],
    }).compile();

    sapphireRelayerController = app.get<SapphireRelayerController>(
      SapphireRelayerController,
    );
    blockchainService = app.get<BlockchainService>(BlockchainService);
    environmentService = app.get<EnvironmentService>(EnvironmentService);
    sapphireService = app.get<SapphireRelayerService>(SapphireRelayerService);
  });

  it('add_authorised', async () => {
    jest.spyOn(environmentService, 'getUnhandled').mockReturnValue(undefined);
    jest.spyOn(environmentService, 'getWithNetwork').mockReturnValue(undefined);
    jest
      .spyOn(blockchainService, 'getProviderAndSigner')
      .mockResolvedValue({} as Wallet);
    jest.spyOn(sapphireService, 'addAuthorised').mockResolvedValue({
      address: '0x1234567890123456789012345678901234567890',
      network: 'localhost',
    });

    const data = new AddAuthorisedEvent('0x0', 'localhost');

    const result = await sapphireRelayerController.handleAddAuthorised(data);

    expect(environmentService.getUnhandled).toHaveBeenCalledWith(
      'API_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(2);
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'SIGNER_PRIVATE_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'DAPP_REGISTRY_ADDRESS',
      'localhost',
    );
    expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();
    expect(sapphireService.addAuthorised).toHaveBeenCalled();
    expect(result).toEqual({
      address: '0x1234567890123456789012345678901234567890',
      network: 'localhost',
    });
  });

  it('execute_transaction NO BRIDGE', async () => {
    jest.spyOn(environmentService, 'getUnhandled').mockReturnValue(undefined);
    jest.spyOn(environmentService, 'getWithNetwork').mockReturnValue(undefined);
    jest
      .spyOn(blockchainService, 'getProviderAndSigner')
      .mockResolvedValue({} as Wallet);
    jest.spyOn(sapphireService, 'executeTransaction').mockResolvedValue({
      hash: '1234567890123456789012345678901234567890',
    });

    const data = new ExecuteTransactionEvent(
      'mockWalletAddress',
      'mockNonce',
      'mockSignedTransaction',
      'mockTransactionData',
      'localhost',
      '',
    );

    const result =
      await sapphireRelayerController.handleExecuteTransaction(data);

    expect(environmentService.getUnhandled).toHaveBeenCalledWith(
      'API_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(4);
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'SIGNER_PRIVATE_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'SIGNER_PRIVATE_KEY',
      '',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'ARGENT_MODULE_ADDRESS',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'ARGENT_WRAPPED_ACCOUNTS_ADDRESS',
      '',
    );
    expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();
    expect(sapphireService.executeTransaction).toHaveBeenCalled();
    expect(result).toEqual({
      hash: '1234567890123456789012345678901234567890',
    });
  });

  it('get_wrapped_account_address', async () => {
    jest.spyOn(environmentService, 'getUnhandled').mockReturnValue(undefined);
    jest.spyOn(environmentService, 'getWithNetwork').mockReturnValue(undefined);
    jest
      .spyOn(blockchainService, 'getProviderAndSigner')
      .mockResolvedValue({} as Wallet);
    jest.spyOn(sapphireService, 'getWrappedAccountAddress').mockResolvedValue({
      address: '0x1234567890123456789012345678901234567890',
      network: 'localhost',
    });

    const data = new GetWrappedAccountAddressEvent('0x0', 'localhost');

    const result =
      await sapphireRelayerController.handleGetWrappedAccountAddress(data);

    expect(environmentService.getUnhandled).toHaveBeenCalledWith(
      'API_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledTimes(2);
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'SIGNER_PRIVATE_KEY',
      'localhost',
    );
    expect(environmentService.getWithNetwork).toHaveBeenCalledWith(
      'ARGENT_WRAPPED_ACCOUNTS_ADDRESS',
      'localhost',
    );
    expect(blockchainService.getProviderAndSigner).toHaveBeenCalled();
    expect(sapphireService.getWrappedAccountAddress).toHaveBeenCalled();
    expect(result).toEqual({
      address: '0x1234567890123456789012345678901234567890',
      network: 'localhost',
    });
  });
});
