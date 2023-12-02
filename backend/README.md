# Backend

## Prerequisites

* [Node.js](https://nodejs.org/en/) (18.18.2)
* [Yarn](https://yarnpkg.com/) (1.22.19)

## API Documentation
Those module has a swagger documentation. You can access it by the following link (after running the app):
http://localhost:3000/api

## Installation

```bash
yarn install
```

## Running
Firstly, modify the .env file in the wallet-factory microservice (Fill in the missing values).
```bash
cd wallet-factory
mv .env.example .env
```
Then, modify the .env file in the api-gateway microservice (Fill in the missing values).
```bash
cd api-gateway
mv .env.example .env
```

Remember: the contracts addresses are updated by the blockchain deployment script.

### Running the app in Docker

```bash
docker-compose up 
```
or 
```bash
docker-compose up --build
```
 ### Running the app locally

```bash
cd wallet-factory
yarn run start
cd ..
cd api-gateway
yarn run start
```
