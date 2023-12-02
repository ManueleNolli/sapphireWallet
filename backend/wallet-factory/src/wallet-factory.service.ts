import { Injectable } from '@nestjs/common';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { ethers, Wallet, ZeroAddress } from 'ethers';
import { WalletFactory__factory } from './contracts';
import { EnvironmentService } from './environment/environment.service';

@Injectable()
export class WalletFactoryService {
  constructor(private readonly environmentService: EnvironmentService) {}

  async callWalletFactoryContract(
    signer: Wallet,
    contractAddress: string,
    data: CreateWalletRequest,
  ) {
    // get contract
    const walletFactory = WalletFactory__factory.connect(
      contractAddress,
      signer,
    );

    const salt = ethers.zeroPadValue(ethers.randomBytes(20), 20);

    const argentModuleAddress = this.environmentService.getContractAddress(
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

    await tx.wait();

    return {
      address: expectedAddress,
    };
  }
}
