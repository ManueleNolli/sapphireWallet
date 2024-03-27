import { NetworkSelector } from './network-selector.dto';

export class GetBalance extends NetworkSelector {
  walletAddress: string;
}
