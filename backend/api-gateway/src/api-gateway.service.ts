import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateWalletRequest } from './dto/create-wallet-request.dto';
import { CreateWalletRequestEvent } from './events/create-wallet-request.event';
import { catchError, throwError, timeout } from 'rxjs';
import { AddAuthorised } from './dto/add-authorised.dto';
import { AddAuthorisedEvent } from './events/add-authorised.event';
import { ExecuteTransaction } from './dto/execute-transaction.dto';
import { ExecuteTransactionEvent } from './events/execute-transaction.event';
import { GetBalance } from './dto/get-balance.dto';
import { GetBalanceEvent } from './events/get-balance-event';
import { GetWrappedAccountAddress } from './dto/get-wrapped-account-address.dto';
import { GetWrappedAccountAddressEvent } from './events/get-wrapped-account-address.event';
import { GetNFTBalance } from './dto/get-nft-balance.dto';
import { GetNFTBalanceEvent } from './events/get-nft-balance-event';
import { GetNFTMetadata } from './dto/get-nft-metadata.dto';
import { GetNFTMetadataEvent } from './events/get-nft-metadata-event';

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('WALLET_FACTORY') private readonly walletFactory: ClientProxy,
    @Inject('SAPPHIRE_RELAYER') private readonly sapphireRelayer: ClientProxy,
    @Inject('SAPPHIRE_PORTFOLIO')
    private readonly sapphirePortofolio: ClientProxy,
  ) {}

  createWallet(createWalletRequest: CreateWalletRequest) {
    return this.walletFactory
      .send(
        'create_wallet_request',
        new CreateWalletRequestEvent(
          createWalletRequest.eoaAddress,
          createWalletRequest.guardianAddress,
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
        timeout(60000),
        catchError((error) => {
          if (error.message === 'Timeout has occurred') {
            // Probably not the best way to check for timeout.
            const errorResponse = {
              statusCode: 503,
              message: 'Timeout between microservices has occurred',
              name: 'ServiceUnavailableException',
            };
            return throwError(() => new RpcException(errorResponse));
          }
          return throwError(() => new RpcException(error.response));
        }),
      );
  }

  getBalance(getBalanceRequest: GetBalance) {
    return this.sapphirePortofolio
      .send(
        'get_balance',
        new GetBalanceEvent(
          getBalanceRequest.walletAddress,
          getBalanceRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  getNFTBalance(getNFTBalanceRequest: GetNFTBalance) {
    return this.sapphirePortofolio
      .send(
        'get_nft_balance',
        new GetNFTBalanceEvent(
          getNFTBalanceRequest.walletAddress,
          getNFTBalanceRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  getNFTMetadata(getNFTMetadataRequest: GetNFTMetadata) {
    return this.sapphirePortofolio
      .send(
        'get_nft_metadata',
        new GetNFTMetadataEvent(
          getNFTMetadataRequest.address,
          getNFTMetadataRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  getWrappedAccountAddress(getWrappedAccountRequest: GetWrappedAccountAddress) {
    return this.sapphireRelayer
      .send(
        'get_wrapped_account_address',
        new GetWrappedAccountAddressEvent(
          getWrappedAccountRequest.address,
          getWrappedAccountRequest.network,
        ),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
