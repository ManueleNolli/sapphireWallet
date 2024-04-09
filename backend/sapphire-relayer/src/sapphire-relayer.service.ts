import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Wallet, ZeroAddress } from 'ethers';
import {
  ArgentModule__factory,
  ArgentWrappedAccounts__factory,
  SapphireAuthoriser__factory,
} from './contracts';

import { AddAuthorised } from './dto/add-authorised.dto';
import { ExecuteTransaction } from './dto/execute-transaction.dto';
import { RpcException } from '@nestjs/microservices';
import { GetWrappedAccountAddress } from './dto/get-wrapped-account-address.dto';

@Injectable()
export class SapphireRelayerService {
  async addAuthorised(
    signer: Wallet,
    contractAddress: string,
    data: AddAuthorised,
  ) {
    // get contract
    const sapphireAuthoriser = SapphireAuthoriser__factory.connect(
      contractAddress,
      signer,
    );
    const tx = await sapphireAuthoriser.setAuthorised(data.address, true);

    const receipt = await tx.wait();

    // check if event Authorised is emitted
    const events = await sapphireAuthoriser.queryFilter(
      sapphireAuthoriser.filters.Authorised(data.address, true),
      receipt.blockNumber,
      receipt.blockNumber,
    );
    if (events.length === 0) {
      throw new RpcException(
        new ServiceUnavailableException(
          "Blockchain does not confirm event 'Authorised'",
        ),
      );
    }

    return {
      address: data.address,
      network: data.network,
    };
  }

  async executeTransaction(
    signerBaseChain: Wallet,
    signerDestChain: Wallet,
    argentModuleAddress: string,
    argentWrappedAccountsAddress: string,
    data: ExecuteTransaction,
  ) {
    /*************
     * DEST CHAIN
     **************/

    let eventDeposit, eventNFTMinted, eventTransactionExecuted;
    if (signerDestChain != null) {
      // wait just one of the events Deposit, NFTMinted, TransactionExecuted of ArgentWrappedAccounts
      const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(
        argentWrappedAccountsAddress,
        signerDestChain,
      );

      // Create listeners

      eventDeposit = new Promise<void>((resolve) => {
        argentWrappedAccounts.once(
          argentWrappedAccounts.filters.Deposit,
          () => {
            resolve();
          },
        );
      });

      eventNFTMinted = new Promise<void>((resolve) => {
        argentWrappedAccounts.once(
          argentWrappedAccounts.filters.NFTMinted,
          () => {
            resolve();
          },
        );
      });

      eventTransactionExecuted = new Promise<void>((resolve, reject) => {
        argentWrappedAccounts.once(
          argentWrappedAccounts.filters.TransactionExecuted,
          (_wallet: string, success: boolean) => {
            if (!success) {
              reject(
                new RpcException(
                  new ServiceUnavailableException(
                    'Relayer executed the transaction, but it failed on destination chain',
                  ),
                ),
              );
            } else {
              resolve();
            }
          },
        );
      });
    }

    /*************
     * BASE CHAIN
     **************/
    const argentModule = ArgentModule__factory.connect(
      argentModuleAddress,
      signerBaseChain,
    );

    const tx = await argentModule.execute(
      data.walletAddress,
      data.transactionData,
      data.nonce,
      data.signedTransaction,
      0,
      1000000,
      ZeroAddress,
      ZeroAddress,
    );

    const receipt = await tx.wait();

    // check if event Authorised is emitted
    const events = await argentModule.queryFilter(
      argentModule.filters.TransactionExecuted(data.walletAddress),
      receipt.blockNumber,
      receipt.blockNumber,
    );
    if (events.length === 0) {
      throw new RpcException(
        new ServiceUnavailableException(
          "Blockchain does not confirm event 'TransactionExecuted'",
        ),
      );
    }

    const executedTransactionSuccess = events[0].args[1];

    if (!executedTransactionSuccess) {
      throw new RpcException(
        new ServiceUnavailableException(
          'Relayer executed the transaction, but it failed',
        ),
      );
    }
    if (signerDestChain == null) {
      return {
        hash: tx.hash,
      };
    }

    /*************
     * DEST CHAIN
     **************/
    // get all listeners

    // IF AFTER 15 SECONDS NO EVENT IS RECEIVED, THROW AN EXCEPTION
    let eventReceived = false;
    const timeoutPromise = new Promise<void>((_resolve, reject) => {
      setTimeout(() => {
        if (!eventReceived) {
          reject(
            new RpcException(
              new ServiceUnavailableException(
                'Relayer executed the transaction, but no event detected on destination chain',
              ),
            ),
          );
        }
      }, 30000);
    });

    // Return if one of the events is received
    const _result = () => {
      eventReceived = true;
      return {
        hash: tx.hash,
      };
    };

    return await Promise.race([
      eventDeposit.then(() => _result()),
      eventNFTMinted.then(() => _result()),
      eventTransactionExecuted
        .then(() => _result())
        .catch((e: any) => {
          eventReceived = true;
          throw e;
        }),
      timeoutPromise,
    ]);
  }

  async getWrappedAccountAddress(
    signer: Wallet,
    argentWrappedAccountsAddress: string,
    data: GetWrappedAccountAddress,
  ) {
    const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(
      argentWrappedAccountsAddress,
      signer,
    );
    const address = await argentWrappedAccounts.getAccountContract(
      data.address,
    );

    return {
      address: address,
      network: data.network,
    };
  }
}
