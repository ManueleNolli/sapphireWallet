import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { CreateWalletRequestEvent } from './events/create-wallet-request.event';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('WALLET_FACTORY') private readonly walletFactory: ClientProxy,
  ) {}

  createWallet(createWalletRequest: CreateWalletRequest) {
    return this.walletFactory
      .send(
        'create_wallet_request',
        new CreateWalletRequestEvent(
          createWalletRequest.eoaAddress,
          createWalletRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
