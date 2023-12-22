# Backend

## Prerequisites

* [Node.js](https://nodejs.org/en/) (18.18.2)
* [Yarn](https://yarnpkg.com/) (1.22.19)

## Microservices

* [api-gateway](api-gateway): Forward calls to other microservices, DTO validation
* [wallet-factory](wallet-factory): Contact blockchain requesting a new wallet
* [sapphire-relayer](sapphire-relayer): Pay signed transactions

## API Documentation
Those module has a swagger documentation. You can access it by the following link (after running api-gateway):
http://localhost:3000/api

## Running the app in Docker

```bash
docker-compose up 
```
or 
```bash
docker-compose up --build
```
 ## Running the app locally

```bash
cd wallet-factory && yarn install && yarn run start
cd ..
cd sapphire-wallet && yarn install && yarn run start
cd ..
cd api-gateway && yarn install && yarn run start
```
