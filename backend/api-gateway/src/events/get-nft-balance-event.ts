import { NetworkSelectorEvent } from './network-selector.event';

export class GetNFTBalanceEvent extends NetworkSelectorEvent {
  constructor(
    public readonly walletAddress: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
