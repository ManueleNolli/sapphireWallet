import { NetworkSelector } from './network-selector.dto';

export class CreateWalletRequest extends NetworkSelector {
  eoaAddress: string;
}
