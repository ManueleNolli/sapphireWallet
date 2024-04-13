import { NetworkSelectorEvent } from './network-selector.event';

export class GetNFTMetadataEvent extends NetworkSelectorEvent {
  constructor(
    public readonly address: string,
    public readonly network: string,
  ) {
    super(network);
  }
}
