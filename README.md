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
3. [mobileapp](mobileapp) (expo sdk 51 in branch `upgrade/expo51`)
4. [bridge](bridge)

## Running

It is possible to run the whole project with docker. 
1. Fill the `.env` files of each project with the correct information.
2. Run the following command:
```shell
docker-compose up
```
3. Run the mobile app with the following command:
```shell
cd mobileapp && yarn start
```

## General Information

The setup script will just copy the `.env.example` files to `.env` files. You need to fill the `.env` files with the correct information, mostly the private keys and the RPC URLs.

All the contracts are already deployed on testnets, more information can be found in the [blockchain](blockchain) folder. At the moment of deployment, the `.env` are filled with the addresses.
