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

<i class="fa-duotone fa-triangle-exclamation" style="--fa-primary-color: #ff0000; --fa-secondary-color: #000000;"></i> fill your personal information inside `.env` files (project sapphire-relayer and wallet-factory)

```bash
docker-compose up 
```
or 
```bash
docker-compose up --build
```
 ## Install apps locally

Follow the README.md inside each microservice folder.