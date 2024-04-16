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
| GUARDIAN STORAGE | 0x0778C832Bc79Ca95908Fd1f9fFECE7972d7647C2 |
| TRANSFER STORAGE | 0x507e5558d2bDe8bDfa00CeA51F6A466Ef127e71B |
| BASE WALLET      | 0x5a5734402d09ed2F7caf328591F037de4F68D57f |
| WALLET FACTORY   | 0x598A67Cf31EB32b89bA8C0Ab959161236947409b |
| MODULE REGISTRY  | 0xd7D3174E575E44045b78D3ddCf96fffF433C26D6 |
| DAPP REGISTRY    | 0x80564DB647181B9281956462cEEC654ea30D1F1F |
| UNISWAP FACTORY  | 0x764Af2277F767126CEEA3E4b30c1b8E8f04E1742 |
| UNISWAP ROUTER   | 0x7F5482bc1074Fe6707Bc9859ED43ECD9976BC34A |
| ARGENT MODULE    | 0x7ce41A92f938030ceb189DbdEF97ddc51407a134 |
| SAPPHIRE NFTs    | 0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD |

**Amoy: Dest Chain**

| Contract                | Address                                    |
|-------------------------|--------------------------------------------|
| NFT STORAGE             | 0x2Ccf4DAFAF0F7f5ABE2A74e40100E45824DAFB11 |
| ARGENT WRAPPED ACCOUNTS | 0x57bB7c33fEC21EACE177092D6E3117F470FF0BFa |
