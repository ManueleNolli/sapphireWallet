import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Wallet, ZeroAddress } from 'ethers';
import {
  ArgentModule__factory,
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
    signer: Wallet,
    contractAddress: string,
    data: ExecuteTransaction,
  ) {
    const argentModule = ArgentModule__factory.connect(contractAddress, signer);

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

    return {
      hash: tx.hash,
    };
  }
}
