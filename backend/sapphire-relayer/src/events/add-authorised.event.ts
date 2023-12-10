import { NetworkSelectorEvent } from './network-selector.event';

export class AddAuthorisedEvent extends NetworkSelectorEvent {
  constructor(
    public readonly address: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
