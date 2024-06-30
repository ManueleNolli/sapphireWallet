import {
  InfrastructureTypes,
  InfrastructureAddresses,
} from "./infrastructureTypes";

export default async function printInfrastructure(
  infrastructure: InfrastructureAddresses | InfrastructureTypes
): Promise<InfrastructureAddresses> {
  let infrastructureAddresses: InfrastructureAddresses;

  if ((infrastructure as InfrastructureTypes).baseWallet) {
    // infrastructure is type Infrastructure
    infrastructure = infrastructure as InfrastructureTypes;
    infrastructureAddresses = {
      guardianStorageAddress: await infrastructure.guardianStorage.getAddress(),
      transferStorageAddress: await infrastructure.transferStorage.getAddress(),
      baseWalletAddress: await infrastructure.baseWallet.getAddress(),
      walletFactoryAddress: await infrastructure.walletFactory.getAddress(),
      moduleRegistryAddress: await infrastructure.moduleRegistry.getAddress(),
      dappRegistryAddress: await infrastructure.dappRegistry.getAddress(),
      uniswapFactoryAddress:
        await infrastructure.uniswapFactoryMock.getAddress(),
      uniswapRouterAddress: await infrastructure.uniswapRouterMock.getAddress(),
      argentModuleAddress: await infrastructure.argentModule.getAddress(),
    };
  } else {
    infrastructureAddresses = infrastructure as InfrastructureAddresses;
  }

  for (const [key, value] of Object.entries(infrastructureAddresses)) {
    console.log(`${key} = ${value}`);
  }

  return infrastructureAddresses;
}
