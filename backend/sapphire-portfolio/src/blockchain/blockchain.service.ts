import { BadRequestException, Injectable } from '@nestjs/common';
import { AlchemyProvider, ethers, JsonRpcProvider, Wallet } from 'ethers';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class BlockchainService {
  async testConnection(provider: ethers.Provider) {
    await provider.getBlockNumber().catch((error) => {
      throw new RpcException(
        new BadRequestException('Connection to blockchain failed'),
      );
    });
  }

  async getHardhatProvider(localHostAddress: string) {
    const provider = new JsonRpcProvider(`http://${localHostAddress}:8545`);
    await this.testConnection(provider);
    return provider;
  }

  async getSepoliaProvider(api_key: string) {
    const provider = new AlchemyProvider('sepolia', api_key);
    await this.testConnection(provider);
    return provider;
  }

  async getMumbaiProvider(api_key: string) {
    const provider = new AlchemyProvider('matic-mumbai', api_key);
    await this.testConnection(provider);
    return provider;
  }

  async getSigner(
    private_key: string,
    provider: ethers.Provider,
  ): Promise<Wallet> {
    return new ethers.Wallet(private_key, provider);
  }

  /**
   * Get provider and signer for a given network. Params are wrapped in an object to avoid ambiguity in optional params.
   * @param details - Object containing network, signerKey, localHostAddress (Only required if network is localhost) and apiKey (Only required if network is sepolia)
   * */
  async getProviderAndSigner(details: {
    network: string;
    signerKey: string;
    localHostAddress?: string;
    apiKey?: string;
  }) {
    let signer: Wallet;

    if (details.network === 'localhost' && details.localHostAddress) {
      const provider = await this.getHardhatProvider(details.localHostAddress);
      signer = await this.getSigner(details.signerKey, provider);
    } else if (details.network === 'sepolia' && details.apiKey) {
      const provider = await this.getSepoliaProvider(details.apiKey);
      signer = await this.getSigner(details.signerKey, provider);
    } else if (details.network === 'mumbai') {
      const provider = await this.getMumbaiProvider(details.apiKey);
      signer = await this.getSigner(details.signerKey, provider);
    } else {
      throw new RpcException(
        new BadRequestException(`Network '${details.network}' not found`),
      );
    }

    return signer;
  }

  async getChainID(signer: Wallet) {
    return (await signer.provider.getNetwork()).chainId;
  }
}
