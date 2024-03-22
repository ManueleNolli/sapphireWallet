import { Wallet } from "ethers";

export enum BridgeCallType {
DEST,
BRIDGE_ETH,
BRIDGE_NFT
}

export type BridgeCallEvent = {
  callID: BigInt,
  wallet: string,
  callType: BridgeCallType,
  to: string,
  value: BigInt,
  data: string,
  signature: string,
  owner: string
}

export type BridgeActionType = {
  signer: Wallet,
  argentWrappedAccountsAddress: string,
} & BridgeCallEvent