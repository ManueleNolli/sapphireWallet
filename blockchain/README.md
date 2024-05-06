# Hardhat project

This project includes the Argent smart contracts of those two repositories:

* [Argent Contracts](https://github.com/argentlabs/argent-contracts) (commit: 320e3d82a8a0625b896e1380e9088812e22db759)
* [Argent Trustlist](https://github.com/argentlabs/argent-trustlists) (commit: 41bc368a66bef247809560fe1bec1dd01e3fd236)

## Prerequisites

* [Node.js](https://nodejs.org/en/) (18.18.2)
* [Yarn](https://yarnpkg.com/) (1.22.19)

## Install

```bash
yarn install
```
<img src="https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/progetti_master/2023_2024/manuele-nolli/aa-interoperability/uploads/7247c41762af1229ee0f92b6e0d5573f/attention.png" alt="attention image" width="40" height="auto"> Fill your personal information inside `.env`. The used provider is [Alchemy](https://www.alchemy.com/), you can create a free account and get your own API key.

## Compile
Hardhat compile has been wrapped in yarn, also typechain types are copied.

```bash
yarn compile
```

## Run local hardhat network

```bash
yarn start:local
```

## Deploy 

Because the project has the feature of a bridge, the contracts must be deployed in **two** (Base chain contracts and Dest chain contracts) different EVM networks. The possible networks are:
* [Local](https://hardhat.org/hardhat-network/)
* [Sepolia](https://sepolia.io/)
* [Amoy](https://amoy.polygon.io/)

<img src="https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/progetti_master/2023_2024/manuele-nolli/aa-interoperability/uploads/7247c41762af1229ee0f92b6e0d5573f/attention.png" alt="attention image" width="40" height="auto"> Do not forget to deploy both Base Chain and Destination Chain. Of course read the [Bridge](../bridge/README.md) documentation to understand the bridge architecture.

### Base Chain
The contracts of Argent (Relayer, Account Abstraction, ...) are deployed in the so called, **Base Chain**.

```bash
yarn deployBaseChain:<network>
```

where `<network>` can be:
* `local` for a local hardhat network
* `sepolia` for the Sepolia testnet 
* `mumbai` for the Mumbai testnet

### Destination Chain
The contracts that manage the abstract accounts for the bridge are deployed in the so called, **Destination Chain**.

```bash
yarn deployDestinationChain:<network>
```

where `<network>` can be:
* `local` for a local hardhat network
* `sepolia` for the Sepolia testnet
* `mumbai` for the Mumbai testnet

### Envs autoupdate
Deploy will update the `.env` files to the necessary modules.
The updated .env are:
* [.env](.env)
* [backend/wallet-factory/.env](../backend/wallet-factory/.env)
* [backend/sapphire-relayer/.env](../backend/sapphire-relayer/.env)
* [backend/sapphire-portfolio/.env](../backend/sapphire-portfolio/.env)
* [mobileapp/.env](../mobileapp/.env)
* [bridge/.env](../bridge/basicOffChainBridge/.env)

For know which keys are added/updated please check the `deployBaseChain.ts` and `deployDestinationChain.ts` files.

# Alrady deployed contracts

The contracts are already deployed in the following networks:

**Sepolia: Base Chain**

| Contract         | Address                                    | Env Key                             |
|------------------|--------------------------------------------|-------------------------------------|
| GUARDIAN STORAGE | 0x2a819EED43bB972a8342Ea2CB277c83B4C54354D | \<network>_GUARDIAN_STORAGE_ADDRESS |
| TRANSFER STORAGE | 0xDa7936b739BbF30995D7EC25F4E445Bb935bAA67 | \<network>_TRANSFER_STORAGE_ADDRESS |
| BASE WALLET      | 0x43e02796256Bcb29D989A74D80e19f1DEDd28C75 | \<network>_BASE_WALLET_ADDRESS      |
| WALLET FACTORY   | 0xBE6029812934AbABA63A4B80cb4EC878f45E2682 | \<network>_WALLET_FACTORY_ADDRESS   |
| MODULE REGISTRY  | 0x602619Acd15F0f419b91611EE499eC012D9c9290 | \<network>_MODULE_REGISTRY_ADDRESS  |
| DAPP REGISTRY    | 0xb0029aae7a8F78ab454E6e07578dBB2DC95A13A3 | \<network>_DAPP_REGISTRY_ADDRESS    |
| UNISWAP FACTORY  | 0xe340735AF82C2Ba24b4373702F306b6d0B368a41 | \<network>_UNISWAP_FACTORY_ADDRESS  |
| UNISWAP ROUTER   | 0x03d68F9C8Da7B1B77Fc85F180102C27C589796D4 | \<network>_UNISWAP_ROUTER_ADDRESS   | 
| ARGENT MODULE    | 0x684968a2cfc38CD4d5A27cE79A7a9b2C7A058406 | \<network>_ARGENT_MODULE_ADDRESS    |
| SAPPHIRE NFTs    | 0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD | \<network>_SAPPHIRE_NFTS_ADDRESS    |

**Amoy: Dest Chain**

| Contract                | Address                                    | Env Key                                    |
|-------------------------|--------------------------------------------|--------------------------------------------|
| NFT STORAGE             | 0x2Ccf4DAFAF0F7f5ABE2A74e40100E45824DAFB11 | \<network>_NFT_STORAGE_ADDRESS             |
| ARGENT WRAPPED ACCOUNTS | 0x57bB7c33fEC21EACE177092D6E3117F470FF0BFa | \<network>_ARGENT_WRAPPED_ACCOUNTS_ADDRESS |
