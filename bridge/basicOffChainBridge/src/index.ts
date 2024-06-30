import 'dotenv/config'
import { ArgentModule__factory } from './contracts'
import {parseArgentModuleAddress, parseArgentWrappedAccountsAddress, parseNetworks} from "./argsParsers";
import {BridgeActionType, BridgeCallType} from "./types";
import {getProviderAndSigner} from "./ethersUtils";
import {bridgeLogger} from "./logger";
import {handleDEST} from "./handleDEST";
import {handleBridgeETH} from "./handleBridgeETH";
import {handleBridgeNFT} from "./handleBridgeNFT";
import { ethers } from "ethers";


  /**
  * Delegate the call to the correct function based on the callType
 */
async function bridgeAction({baseChainSigner,destChainSigner, argentWrappedAccountsAddress, callID, wallet, callType, to, value, data, signature, owner }: BridgeActionType) {
  bridgeLogger({callID, wallet, callType, to, value, data, signature, owner});
  const callTypeInt = parseInt(callType.toString())
  switch (callTypeInt) {
    case BridgeCallType.DEST:
      console.log("Handling DEST...")
      await handleDEST(argentWrappedAccountsAddress, wallet, owner, data, signature, destChainSigner)
      console.log("DEST handled")
      break;
    case BridgeCallType.BRIDGE_ETH:
      console.log("Handling Bridge ETH...")
      await handleBridgeETH(argentWrappedAccountsAddress, to, value, destChainSigner)
      console.log("ETH handled")
      break;
    case BridgeCallType.BRIDGE_NFT:
      console.log("Handling Bridge NFT...")
      await handleBridgeNFT(argentWrappedAccountsAddress, wallet, to, data, baseChainSigner,destChainSigner)
      console.log("NFT handled")
      break;
  }

}

/**
 * Main function. It listens to the BridgeCall event and calls bridgeAction when it is detected
 */
async function main() {
  const {baseChain, destinationChain } = parseNetworks();
  const { signer : baseChainSigner } = getProviderAndSigner(baseChain);
  const argentModuleAddress = parseArgentModuleAddress(baseChain);

  const { provider: destionationChainProvider, signer : destinationChainSigner } = getProviderAndSigner(destinationChain);

  const argentModuleContract = ArgentModule__factory.connect(argentModuleAddress, baseChainSigner);
  const argentWrappedAccountsAddress = parseArgentWrappedAccountsAddress(destinationChain);
  const argentWrappedAccountsBalance = await destionationChainProvider.getBalance(argentWrappedAccountsAddress);

  console.log('ArgentWrappedAccounts balance:', ethers.formatEther(argentWrappedAccountsBalance), 'ETH');

  await argentModuleContract.addListener('BridgeCall',
    (callID: BigInt, wallet: string, callType: BridgeCallType, to: string, value: BigInt, data: string, signature: string, owner: string) => {
      bridgeAction({baseChainSigner: baseChainSigner, destChainSigner: destinationChainSigner, argentWrappedAccountsAddress, callID, wallet, callType, to, value, data, signature, owner});
    })

  console.log('Bridge is listening for BridgeCall events');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});