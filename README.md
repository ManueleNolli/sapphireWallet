# Account Abstraction - Blockchain Interoperability

## Prerequisites

* [Node.js](https://nodejs.org/en/) (18.18.2)
* [Yarn](https://yarnpkg.com/) (1.22.19)

## Setup

Run setup file: 

```shell
./setup.sh
```

Go to those folders and follow the setup procedure:
1. [blockchain](blockchain)
2. [backend](backend)
3. [mobileapp](mobileapp)
4. [bridge](bridge)

## General Information

The setup script will just copy the `.env.example` files to `.env` files. You need to fill the `.env` files with the correct information, mostly the private keys and the RPC URLs.

All the contracts are already deployed on testnets, more information can be found in the [blockchain](blockchain) folder. At the moment of deployment, the `.env` are filled with the addresses.

## Documentation

The documentation can be found in the [docs](docs) folder.