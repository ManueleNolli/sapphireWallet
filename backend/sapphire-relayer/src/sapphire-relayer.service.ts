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

      // Create a listener for one of the events, from blockNumberDestChain to the first event

      eventDeposit = argentWrappedAccounts.once(
        argentWrappedAccounts.filters.Deposit(data.walletAddress),
        () => {
          argentWrappedAccounts.removeAllListeners();
          return {
            hash: tx.hash,
          };
        },
      );

      eventNFTMinted = argentWrappedAccounts.once(
        argentWrappedAccounts.filters.NFTMinted(data.walletAddress),
        () => {
          argentWrappedAccounts.removeAllListeners();
          return {
            hash: tx.hash,
          };
        },
      );

      eventTransactionExecuted = argentWrappedAccounts.once(
        argentWrappedAccounts.filters.TransactionExecuted(data.walletAddress),
        (_wallet: string, success: boolean) => {
          argentWrappedAccounts.removeAllListeners();
          if (!success) {
            throw new RpcException(
              new ServiceUnavailableException(
                'Relayer executed the transaction, but it failed on destination chain',
              ),
            );
          }
          return {
            hash: tx.hash,
          };
        },
      );
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

    // IF AFTER 30 SECONDS NO EVENT IS RECEIVED, THROW AN EXCEPTION
    setTimeout(() => {
      throw new RpcException(
        new ServiceUnavailableException(
          'Relayer executed the transaction, but no event was received on destination chain',
        ),
      );
    }, 5000);

    await Promise.all([eventDeposit, eventNFTMinted, eventTransactionExecuted]);
  }
}
