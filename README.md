# Sapphire Wallet: Enhancing Blockchain Usability

In my first specialization project as a Master of Science in Engineering student in Switzerland, I aimed to explore the current state of Blockchain technology, focusing on Account Abstraction and Cross-Chain Communication. Collaborating with the Institute of Information Systems and Networking (ISIN) at SUPSI, I developed the Sapphire Wallet, a decentralized wallet that enables users to interact seamlessly with multiple blockchains without needing technical expertise.

Through my research, I found that the Sapphire Wallet significantly improves user experience and interface compared to traditional Ethereum Virtual Machine (EVM) networks. It also offers innovative account recoverability through trusted third parties, or Guardians. However, I encountered challenges such as slow transaction speeds and high deployment costs, which currently hinder global adoption.

This project highlights the potential of Account Abstraction and underscores the need for protocol updates. I also suggest keeping an eye on new blockchain systems like ICP, which integrate Account Abstraction and advanced Cross-Chain Communication, as they may shape the future of Blockchain technology.

## Features

## Demo

I prepared three video demos:

1. [Recovery Wallet](https://drive.google.com/file/d/1m3j4DgvC4GL2HCXTU-_bPO6UaaY9_CNE/view?usp=sharing)
2. [Transfer and bridge ETH](https://drive.google.com/file/d/1SFumlTTdzHzg5j0u83cJ3b0MgecW1EtN/view?usp=sharing)
3. [Transfer and bridge NFT](https://drive.google.com/file/d/1lzdx93sr3OC5qjCVMlIiDanK6V8bdgfH/view?usp=sharing)

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


## Documentation

The documentation can be found in the [doc](doc) folder.

## Acknowledgements

I would like to thank my two supervisors and to the entire [ISIN Blockchain Team](https://github.com/IsinBlockchainTeam)


