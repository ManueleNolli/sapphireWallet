import { Body, Controller, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ApiResponse } from '@nestjs/swagger';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { AddAuthorised } from './dto/add-authorised.dto';
import { ExecuteTransaction } from './dto/execute-transaction.dto';
import { lastValueFrom } from 'rxjs';
import { GetBalance } from './dto/get-balance.dto';
import { GetWrappedAccountAddress } from './dto/get-wrapped-account-address.dto';
import { GetNFTBalance } from './dto/get-nft-balance.dto';
import { GetNFTMetadata } from './dto/get-nft-metadata.dto';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/create-wallet')
  @ApiResponse({
    status: 201,
    description:
      'Wallet created successfully. It will return the wallet address',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              example: '0x1234567890123456789012345678901234567890',
            },
            network: {
              type: 'string',
              example: 'localhost',
            },
          },
        },
      },
    },
  })
  async createWallet(@Body() createWalletRequest: CreateWalletRequest) {
    const createWalletResponse =
      this.apiGatewayService.createWallet(createWalletRequest);

    const data = await lastValueFrom(createWalletResponse);

    const address = data.address;
    const network = data.network;

    await lastValueFrom(
      this.apiGatewayService.addAuthorised({ address, network }),
    );

    return data;
  }

  @Post('/add-authorised')
  @ApiResponse({
    status: 201,
    description:
      'Authorised added successfully. It will return the authorised address',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              example: '0x1234567890123456789012345678901234567890',
            },
            network: {
              type: 'string',
              example: 'localhost',
            },
          },
        },
      },
    },
  })
  addAuthorised(@Body() addAuthorisedRequest: AddAuthorised) {
    return this.apiGatewayService.addAuthorised(addAuthorisedRequest);
  }

  @Post('/execute-transaction')
  @ApiResponse({
    status: 201,
    description:
      'Transaction executed successfully. It will return the transaction hash',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            transactionHash: {
              type: 'string',
              example:
                '0x82b9eea000ba798f1cae87bc89024a7cb55bc180db6e9545096e3eb2a7f38c9275d51018b41fc8779577b5f73c36ae5c5a1bd4a48a6a63bd880b1493bb20ad701c',
            },
          },
        },
      },
    },
  })
  executeTransaction(@Body() executeTransactionRequest: ExecuteTransaction) {
    return this.apiGatewayService.executeTransaction(executeTransactionRequest);
  }

  @Post('/get-balance')
  @ApiResponse({
    status: 201,
    description: 'Balance successfully retrieved. It will return the balance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            network_name: {
              type: 'object',
              properties: {
                network: {
                  type: 'string',
                  example: 1n.toString(),
                },
                balance: {
                  type: 'string',
                  example: 1000000000000000000n.toString(),
                },
                crypto: {
                  type: 'string',
                  example: 'ETH',
                },
              },
            },
          },
        },
      },
    },
  })
  getBalance(@Body() getBalanceRequest: GetBalance) {
    return this.apiGatewayService.getBalance(getBalanceRequest);
  }

  @Post('/get-nft-balance')
  @ApiResponse({
    status: 201,
    description: 'Balance successfully retrieved. It will return the balance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            network_name: {
              type: 'number',
              example: 1,
            },
          },
        },
      },
    },
  })
  getNFTBalance(@Body() getNFTBalanceRequest: GetNFTBalance) {
    return this.apiGatewayService.getNFTBalance(getNFTBalanceRequest);
  }

  @Post('/get-nft-metadata')
  @ApiResponse({
    status: 201,
    description: 'Metadata successfully retrieved. It will return the metadata',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: "NFT's name",
            },
            description: {
              type: 'string',
              example: "NFT's description",
            },
            image: {
              type: 'string',
              example:
                'https://gateway.pinata.cloud/ipfs/bafybeib3pgyhzx7j7yfeigqtjqxnvjz7c4ic32dxu6lp4iqhjnq2sd2tum/0.png',
            },
            tokenId: {
              type: 'number',
              example: 0,
            },
            collectionName: {
              type: 'string',
              example: "Collection's name",
            },
            collectionDescription: {
              type: 'string',
              example: "Collection's description",
            },
            collectionAddress: {
              type: 'string',
              example: '0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD',
            },
            network: {
              type: 'string',
              example: 'sepolia',
            },
          },
        },
      },
    },
  })
  getNFTMetadata(@Body() getNFTMetadataRequest: GetNFTMetadata) {
    return this.apiGatewayService.getNFTMetadata(getNFTMetadataRequest);
  }

  @Post('/get-wrapped-account-address')
  @ApiResponse({
    status: 201,
    description:
      'Wrapped account address retrieved successfully. It will return the wrapped account address',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            address: {
              type: 'string',
              example: '0x1234567890123456789012345678901234567890',
            },
            network: {
              type: 'string',
              example: 'localhost',
            },
          },
        },
      },
    },
  })
  getWrappedAccountAddress(
    @Body() getWrappedAccountRequest: GetWrappedAccountAddress,
  ) {
    return this.apiGatewayService.getWrappedAccountAddress(
      getWrappedAccountRequest,
    );
  }
}
