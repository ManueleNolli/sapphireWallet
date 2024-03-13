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
| GUARDIAN STORAGE | "0x8612A9Fd1069629e1d96BceaD47417E7604117e7" |
| TRANSFER STORAGE | "0x88c760BE337857a4456c59e0f8d2C768cAf65F3F" |
| BASE WALLET      | "0x34C3Bf2c140feb3204571b45EE55918e8c42f444" |
| WALLET FACTORY   | "0x73d71480152aAd8E92260b1Ef786291B240a867F" |
| MODULE REGISTRY  | "0xae3154e32B4514510c51637b3ccabdc46927A528" |
| DAPP REGISTRY    | "0xb32BeeFe6B8FBB6571C3f738b00bbA3F7bf09b91" |
| UNISWAP FACTORY  | "0x96aEC6fa064EA35Efe123E8BdBEbA49791931A3b" |
| UNISWAP ROUTER   | "0x40476fFe334df7C7395390F8B169dF801841E0E4" |
| ARGENT MODULE    | "0xf71a8C4A38540A81D4B8A7066B8127dC27d2e8bf" |

**Mumbai: Dest Chain**

| Contract                | Address                                      |
|-------------------------|----------------------------------------------|
| NFT STORAGE             | "0x566318a8d399a4500b4964C6Fe926966fad0cF05" |
| ARGENT WRAPPED ACCOUNTS | "0x22aEaA81882DeE54Af24679eC44A890450443464" |
