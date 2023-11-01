import {
    ArgentModule,
    BaseWallet,
    DappRegistry,
    GuardianStorage,
    ITransferStorage,
    ModuleRegistry, UniswapV2FactoryMock, UniswapV2Router01Mock,
    WalletFactory
} from "../../typechain-types";

export type Infrastructure = {
    guardianStorage: GuardianStorage;
    transferStorage: ITransferStorage;
    baseWallet: BaseWallet;
    walletFactory: WalletFactory;
    moduleRegistry: ModuleRegistry;
    dappRegistry: DappRegistry;
    uniswapFactoryMock: UniswapV2FactoryMock;
    uniswapRouterMock: UniswapV2Router01Mock;
    argentModule: ArgentModule;
}

export type InfrastructureAddresses = {
    guardianStorageAddress: string;
    transferStorageAddress: string;
    baseWalletAddress: string;
    walletFactoryAddress: string;
    moduleRegistryAddress: string;
    dappRegistryAddress: string;
    uniswapFactoryAddress: string;
    uniswapRouterAddress: string;
    argentModuleAddress: string;
}