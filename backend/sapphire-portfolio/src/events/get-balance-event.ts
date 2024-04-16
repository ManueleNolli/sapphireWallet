import { NetworkSelectorEvent } from './network-selector.event';

export class GetBalanceEvent extends NetworkSelectorEvent {
  constructor(
    public readonly walletAddress: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
