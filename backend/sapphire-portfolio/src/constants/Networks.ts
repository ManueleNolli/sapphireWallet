// @ts-ignore

export enum NETWORKS {
  LOCALHOST = 'localhost',
  SEPOLIA = 'sepolia',
  MUMBAI = 'mumbai',
}

type ChainIds = {
  [key: string]: NETWORKS;
};

export const CHAIN_IDS: ChainIds = {
  '1337': NETWORKS.LOCALHOST,
  '11155111': NETWORKS.SEPOLIA,
  '80001': NETWORKS.MUMBAI,
};

type ChainCryptos = {
  [key: string]: string;
};

export const CHAIN_CRYPTOS: ChainCryptos = {
  '1337': 'ETH',
  '11155111': 'ETH',
  '80001': 'MATIC',
};
