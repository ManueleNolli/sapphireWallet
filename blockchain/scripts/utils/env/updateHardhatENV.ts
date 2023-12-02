import {
  Infrastructure,
  InfrastructureAddresses,
} from "../../types/infrastructure";
import { setENVValue } from "./envConfig";

/**
 * Update the ENV variables with the infrastructure addresses
 * @param infrastructure
 * @return {Promise<InfrastructureAddresses>}
 */
export default async function updateHardhatENV(
  infrastructure: Infrastructure
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
  await setENVValue("GUARDIAN_STORAGE_ADDRESS", guardianStorageAddress);
  await setENVValue("TRANSFER_STORAGE_ADDRESS", transferStorageAddress);
  await setENVValue("BASE_WALLET_ADDRESS", baseWalletAddress);
  await setENVValue("WALLET_FACTORY_ADDRESS", walletFactoryAddress);
  await setENVValue("MODULE_REGISTRY_ADDRESS", moduleRegistryAddress);
  await setENVValue("DAPP_REGISTRY_ADDRESS", dappRegistryAddress);
  await setENVValue("UNISWAP_FACTORY_ADDRESS", uniswapFactoryAddress);
  await setENVValue("UNISWAP_ROUTER_ADDRESS", uniswapRouterAddress);
  await setENVValue("ARGENT_MODULE_ADDRESS", argentModuleAddress);
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
