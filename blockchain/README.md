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
* [Mumbai](https://mumbai.polygon.io/)

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

| Contract         | Address                                      |
|------------------|----------------------------------------------|
| GUARDIAN STORAGE | "0x4620a3db5347291C81AA435a106Fa0666612A5ff" |
| TRANSFER STORAGE | "0x842Aec2acF9d78527FaA726Fd8A67c55795f8374" |
| BASE WALLET      | "0xDb374aB55769A96515B9e19e47e0c45296Ce9B1d" |
| WALLET FACTORY   | "0xb7DC32b9dFD95FA265dd7222958a342804E3289a" |
| MODULE REGISTRY  | "0x49023706BAAA0BA01Be256c259fF909173Fa865a" |
| DAPP REGISTRY    | "0xA5E1D420eF14Ca4a5Ff48BE96E8Ad23F53bf6c86" |
| UNISWAP FACTORY  | "0x3a337904cdf339D3A94eD9a021b28F47990DDB1f" |
| UNISWAP ROUTER   | "0xB6fBcf77b57c2A46B3cC447fCFF8b3f6cf85738a" |
| ARGENT MODULE    | "0xa81228d1A9a5a55e6256ae2d2397D70F78B5b7c9" |
| SAPPHIRE NFTs    | "0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD  |

**Mumbai: Dest Chain**

| Contract                | Address                                      |
|-------------------------|----------------------------------------------|
| NFT STORAGE             | "0x89F6a23acA6270791823e34906894E954BB62cA9" |
| ARGENT WRAPPED ACCOUNTS | "0x15609e1d99473C9835d2C5bb7e7b696969532D99" |
