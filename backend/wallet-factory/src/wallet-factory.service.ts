import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { ethers, Wallet, ZeroAddress } from 'ethers';
import { WalletFactory__factory } from './contracts';
import { EnvironmentService } from './environment/environment.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WalletFactoryService {
  constructor(private readonly environmentService: EnvironmentService) {}

  async callWalletFactoryContract(signer: Wallet, data: CreateWalletRequest) {
    // get contract
    const walletFactory = WalletFactory__factory.connect(
      this.environmentService.getWithNetwork(
        'WALLET_FACTORY_ADDRESS',
        data.network,
      ),
      signer,
    );

    const salt = ethers.zeroPadValue(ethers.randomBytes(20), 20);

    const argentModuleAddress = this.environmentService.getWithNetwork(
      'ARGENT_MODULE_ADDRESS',
      data.network,
    );

    const expectedAddress =
      await walletFactory.getAddressForCounterfactualWallet(
        data.eoaAddress,
        [argentModuleAddress],
        signer.address,
        salt,
      );

    const tx = await walletFactory.createCounterfactualWallet(
      data.eoaAddress,
      [argentModuleAddress],
      signer.address,
      salt,
      0,
      ZeroAddress,
      '0x',
      '0x',
    );

    const receipt = await tx.wait();

    // check if event WalletCreated is emitted
    const events = await walletFactory.queryFilter(
      walletFactory.filters.WalletCreated(expectedAddress, data.eoaAddress),
      receipt.blockNumber,
      receipt.blockNumber,
    );
    if (events.length === 0) {
      throw new RpcException(
        new ServiceUnavailableException(
          "Blockchain does not confirm event 'WalletCreated'",
        ),
      );
    }

    return {
      address: expectedAddress,
      network: data.network,
    };
  }
}
