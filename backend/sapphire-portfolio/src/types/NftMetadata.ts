import { NETWORKS } from '../constants/Networks';

export type NFT = {
  name: string;
  description: string;
  image: string;
  tokenId: number;
  network: string;
  collectionAddress: string;
  collectionName: string;
  collectionDescription: string;
};
