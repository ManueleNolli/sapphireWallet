import { NetworkSelectorEvent } from './network-selector.event';

export class CreateWalletRequestEvent extends NetworkSelectorEvent {
  constructor(
    public readonly eoaAddress: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
