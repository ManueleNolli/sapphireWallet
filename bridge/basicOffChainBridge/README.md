# Basic Off-Chain Bridge


## Prerequisites

* [Node.js](https://nodejs.org/en/) (18.18.2)
* [Yarn](https://yarnpkg.com/) (1.22.19)

## Install

```bash
yarn install
```
<img src="https://gitlab-edu.supsi.ch/dti-isin/giuliano.gremlich/progetti_master/2023_2024/manuele-nolli/aa-interoperability/uploads/7247c41762af1229ee0f92b6e0d5573f/attention.png" alt="attention image" width="40" height="auto"> fill your personal information inside `.env`. The used provider is [Alchemy](https://www.alchemy.com/), you can create a free account and get your own API key.

## Usage

```bash
yarn start <baseChain> <destinationChain>
```

All combinations of the following chains are supported:
* `local` for a local hardhat network
* `sepolia` for the Sepolia testnet
* `mumbai` for the Mumbai testnet