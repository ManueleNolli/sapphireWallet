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
<i class="fa-duotone fa-triangle-exclamation" style="--fa-primary-color: #ff0000; --fa-secondary-color: #000000;"></i> fill your personal information inside `.env`

<i class="fab fa-gitlab fa-fw" style="color:rgb(252,109,38); font-size:.85em" aria-hidden="true"></i> Tested on Gitlab CI/CD

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
```bash
npx hardhat run scripts\deploy.ts --network <network>
```

where `<network>` can be:
* `localhost` (default) for a local hardhat network
* `sepolia` for the Sepolia testnet 

### Envs autoupdate
Deploy will update the `.env` files to the necessary modules.
The updated .env are:
* [.env](.env)
* [backend/wallet-factory/.env](../backend/wallet-factory/.env)
* [backend/sapphire-relayer/.env](../backend/sapphire-relayer/.env)
* [mobileapp/.env](../mobileapp/.env)

For know which keys are added/updated please check the `deploy.ts` file.

