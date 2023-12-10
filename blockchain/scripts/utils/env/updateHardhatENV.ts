import {
  InfrastructureTypes,
  InfrastructureAddresses,
} from "../../argentContracts/utils/infrastructureTypes";
import { setENVValue } from "./envConfig";
import Constants from "../../constants/constants";
/**
 * Update the ENV variables with the infrastructure addresses
 * @param infrastructure
 * @return {Promise<InfrastructureAddresses>}
 */
export default async function updateHardhatENV(
  infrastructure: InfrastructureTypes
): Promise<InfrastructureAddresses> {
  const [
    guardianStorageAddress,
    transferStorageAddress,
    baseWalletAddress,
    walletFactoryAddress,
    moduleRegistryAddress,
    dappRegistryAddress,
    uniswapFactoryAddress,
    uniswapRouterAddress,
    argentModuleAddress,
  ] = await Promise.all([
    infrastructure.guardianStorage.getAddress(),
    infrastructure.transferStorage.getAddress(),
    infrastructure.baseWallet.getAddress(),
    infrastructure.walletFactory.getAddress(),
    infrastructure.moduleRegistry.getAddress(),
    infrastructure.dappRegistry.getAddress(),
    infrastructure.uniswapFactoryMock.getAddress(),
    infrastructure.uniswapRouterMock.getAddress(),
    infrastructure.argentModule.getAddress(),
  ]);

  console.log("Updating Harhat ENV variables...");
  await setENVValue(
    Constants.envValues.guardianStorage,
    guardianStorageAddress
  );
  await setENVValue(
    Constants.envValues.transferStorage,
    transferStorageAddress
  );
  await setENVValue(Constants.envValues.baseWallet, baseWalletAddress);
  await setENVValue(Constants.envValues.walletFactory, walletFactoryAddress);
  await setENVValue(Constants.envValues.moduleRegistry, moduleRegistryAddress);
  await setENVValue(Constants.envValues.dappRegistry, dappRegistryAddress);
  await setENVValue(Constants.envValues.uniswapFactory, uniswapFactoryAddress);
  await setENVValue(Constants.envValues.uniswapRouter, uniswapRouterAddress);
  await setENVValue(Constants.envValues.argentModule, argentModuleAddress);
  console.log("Updated Harhat ENV variables!");

  return {
    guardianStorageAddress,
    transferStorageAddress,
    baseWalletAddress,
    walletFactoryAddress,
    moduleRegistryAddress,
    dappRegistryAddress,
    uniswapFactoryAddress,
    uniswapRouterAddress,
    argentModuleAddress,
  };
}
