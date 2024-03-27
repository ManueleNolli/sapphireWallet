export type Balance = {
  chainID: bigint;
  balance: bigint;
  crypto: string;
};

export type Balances = Balance[];
