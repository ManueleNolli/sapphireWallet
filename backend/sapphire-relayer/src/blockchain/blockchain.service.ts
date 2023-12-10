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

  async getHardhatProvider() {
    const provider = new JsonRpcProvider('http://127.0.0.1:8545');
    await this.testConnection(provider);
    return provider;
  }

  async getSepoliaProvider(api_key: string) {
    const provider = new AlchemyProvider('sepolia', api_key);
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
   * Get provider and signer for a given network
   * @param network
   * @param signerKey
   * @param apiKey - Only required if network needs an API key
   */
  async getProviderAndSigner(
    network: string,
    signerKey: string,
    apiKey?: string,
  ) {
    let signer: Wallet;

    if (network === 'localhost') {
      const provider = await this.getHardhatProvider();
      signer = await this.getSigner(signerKey, provider);
    } else if (network === 'sepolia' && apiKey) {
      const provider = await this.getSepoliaProvider(apiKey);
      signer = await this.getSigner(signerKey, provider);
    } else {
      throw new RpcException(
        new BadRequestException(`Network '${network}' not found`),
      );
    }

    return signer;
  }
}
