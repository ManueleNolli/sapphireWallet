import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { CreateWalletRequestEvent } from './events/create-wallet-request.event';
import { catchError, throwError } from 'rxjs';
import { AddAuthorised } from './dto/add-authorised.dto';
import { AddAuthorisedEvent } from './events/add-authorised.event';
import { ExecuteTransaction } from './dto/execute-transaction.dto';
import { ExecuteTransactionEvent } from './events/execute-transaction.event';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('WALLET_FACTORY') private readonly walletFactory: ClientProxy,
    @Inject('SAPPHIRE_RELAYER') private readonly sapphireRelayer: ClientProxy,
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
        catchError((error) => {
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  addAuthorised(addAuthorisedRequest: AddAuthorised) {
    return this.sapphireRelayer
      .send(
        'add_authorised',
        new AddAuthorisedEvent(
          addAuthorisedRequest.address,
          addAuthorisedRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  executeTransaction(executeTransactionRequest: ExecuteTransaction) {
    return this.sapphireRelayer
      .send(
        'execute_transaction',
        new ExecuteTransactionEvent(
          executeTransactionRequest.walletAddress,
          executeTransactionRequest.nonce,
          executeTransactionRequest.signedTransaction,
          executeTransactionRequest.transactionData,
          executeTransactionRequest.network,
          executeTransactionRequest.bridgeNetwork,
        ),
      )
      .pipe(
        catchError((error) => {
          console.log('Error: ', error);
          return throwError(() => new RpcException(error.response));
        }),
      );
  }
}
