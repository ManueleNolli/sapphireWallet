import { NetworkSelectorEvent } from './network-selector.event';

export class ExecuteTransactionEvent extends NetworkSelectorEvent {
  constructor(
    public readonly walletAddress: string,
    public readonly nonce: string,
    public readonly signedTransaction: string,
    public readonly transactionData: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
