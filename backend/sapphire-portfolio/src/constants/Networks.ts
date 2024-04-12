// @ts-ignore

export enum NETWORKS {
  LOCALHOST = 'localhost',
  SEPOLIA = 'sepolia',
  AMOY = 'amoy',
}

type ChainIds = {
  [key: string]: NETWORKS;
};

export const CHAIN_IDS: ChainIds = {
  '1337': NETWORKS.LOCALHOST,
  '11155111': NETWORKS.SEPOLIA,
  '80002': NETWORKS.AMOY,
};

type ChainCryptos = {
  [key: string]: string;
};

export const CHAIN_CRYPTOS: ChainCryptos = {
  '1337': 'ETH',
  '11155111': 'ETH',
  '80002': 'MATIC',
};
