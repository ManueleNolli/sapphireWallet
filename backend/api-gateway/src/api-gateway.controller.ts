import { Body, Controller, Post } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/create-wallet')
  @ApiResponse({
    status: 500,
    description: 'Internal server error. Connection failed to microservice',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request. Network not found or Connection to blockchain failed',
  })
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
          },
        },
      },
    },
  })
  createWallet(@Body() createWalletRequest: CreateWalletRequest) {
    return this.apiGatewayService.createWallet(createWalletRequest);
  }
}
