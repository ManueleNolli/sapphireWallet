import { NETWORKS } from '../constants/Networks';

export type Balance = {
  chainID: string;
  balance: string;
  crypto: string;
};

export type Balances = {
  [key in NETWORKS]?: Balance;
};

export type NFTBalances = {
  [key in NETWORKS]?: number;
};
