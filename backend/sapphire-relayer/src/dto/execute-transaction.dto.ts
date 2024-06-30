import { NetworkSelector } from './network-selector.dto';

export class ExecuteTransaction extends NetworkSelector {
  walletAddress: string;
  nonce: string;
  signedTransaction: string;
  transactionData: string;
}
