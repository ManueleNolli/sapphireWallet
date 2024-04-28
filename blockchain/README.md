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
<img src="https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/progetti_master/2023_2024/manuele-nolli/aa-interoperability/uploads/7247c41762af1229ee0f92b6e0d5573f/attention.png" alt="attention image" width="40" height="auto"> fill your personal information inside `.env`. The used provider is [Alchemy](https://www.alchemy.com/), you can create a free account and get your own API key.

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

Because the project has the feature of a bridge, the contracts must be deployed in two different EVM networks. The possible networks are:
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
* [mobileapp/.env](../mobileapp/.env)
* [bridge/.env](../bridge/basicOffChainBridge/.env)

For know which keys are added/updated please check the `deployBaseChain.ts` and `deployDestinationChain.ts` files.

# Alrady deployed contracts

The contracts are already deployed in the following networks:

**Sepolia: Base Chain**

| Contract         | Address                                    |
|------------------|--------------------------------------------|
| GUARDIAN STORAGE | 0x032CEe07E7eCC1fD10576BB86372327b3826b0A2 |
| TRANSFER STORAGE | 0x4459B1b7f396B15DB3713473A2F4959B68C96D39 |
| BASE WALLET      | 0xde2376755Bd71945A9A6bF43F4253f99eac13395 |
| WALLET FACTORY   | 0xa244F973164FC259418BB86F44A03D752a1C32b9 |
| MODULE REGISTRY  | 0xb1A10dAfcbd933b236E9B8c1935A8D4C418d8DA1 |
| DAPP REGISTRY    | 0x3BB8fa09243C8e1e6e2402aC061665297D3FBE68 |
| UNISWAP FACTORY  | 0x93d3fc857d7F5B64409318D396BA1b4FC04e3503 |
| UNISWAP ROUTER   | 0xC17d3379e3D172A4940e8bD99433EdcF5eE2B278 |
| ARGENT MODULE    | 0xCaa33108A14c7fcF69355363DAE5F0d8b058850c |
| SAPPHIRE NFTs    | 0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD |

**Amoy: Dest Chain**

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| NFT STORAGE             | 0x2Ccf4DAFAF0F7f5ABE2A74e40100E45824DAFB11 |
| ARGENT WRAPPED ACCOUNTS | 0x57bB7c33fEC21EACE177092D6E3117F470FF0BFa |
