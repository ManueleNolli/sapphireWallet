export type Balance = {
  chainID: string;
  balance: string;
  crypto: string;
};

export type Balances = {
  [key: string]: Balance;
};

export type NFTBalances = {
  [key: string]: number;
};
