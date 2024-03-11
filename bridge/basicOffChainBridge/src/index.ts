import 'dotenv/config'
import { ethers } from "ethers";
import { ArgentModule__factory, ArgentWrappedAccounts__factory } from './contracts'
import {parseArgentModuleAddress, parseArgentWrappedAccountsAddress, parseNetworks} from "./argsParsers";
import {BridgeActionType, BridgeCallType} from "./contracts/types";
import {getProviderAndSigner} from "./ethersUtils";
import {bridgeLogger} from "./logger";
import {handleDEST} from "./contracts/handleDEST";
import {handleBridgeETH} from "./handleBridgeETH";
import {handleBridgeNFT} from "./handleBridgeNFT";


  /**
  * Delegate the call to the correct function based on the callType
 */
async function bridgeAction({signer, argentWrappedAccountsAddress, callID, wallet, callType, to, value, data, signature, owner }: BridgeActionType) {
  bridgeLogger({callID, wallet, callType, to, value, data, signature, owner});

  switch (callType) {
    case BridgeCallType.DEST:
      await handleDEST()
      break;
    case BridgeCallType.BRIDGE_ETH:
      await handleBridgeETH()
      break;
    case BridgeCallType.BRIDGE_NFT:
      await handleBridgeNFT()
      break;
  }

  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(argentWrappedAccountsAddress, signer);
  await argentWrappedAccounts.depositToAccountContract(to, value as ethers.BigNumberish)
}

/**
 * Main function. It listens to the BridgeCall event and calls bridgeAction when it is detected
 */
async function main() {
  const {baseChain, destinationChain } = parseNetworks();
  const { signer : baseChainSigner } = getProviderAndSigner(baseChain);
  const argentModuleAddress = parseArgentModuleAddress(baseChain);

  const { signer : destinationChainSigner } = getProviderAndSigner(destinationChain);

  const argentModuleContract = ArgentModule__factory.connect(argentModuleAddress, baseChainSigner);
  const argentWrappedAccountsAddress = parseArgentWrappedAccountsAddress(destinationChain);

  await argentModuleContract.addListener('BridgeCall',
    (callID: BigInt, wallet: string, callType: BridgeCallType, to: string, value: BigInt, data: string, signature: string, owner: string) => {
      bridgeAction({signer: destinationChainSigner, argentWrappedAccountsAddress, callID, wallet, callType, to, value, data, signature, owner});
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});