import 'dotenv/config'
import { AlchemyProvider, ethers, JsonRpcProvider, Wallet } from "ethers";
import { ArgentModule__factory, ArgentWrappedAccounts__factory } from './contracts'

type BridgeCallType = {
  id: BigInt,
  wallet: string,
  to: string,
  value: BigInt,
  data: string
}

function parseNetwork(): string {
  return process.argv[2];
}

function parseArgentModuleAddress(): string {
  const network = parseNetwork()

  if(network === 'localhost' && process.env.LOCALHOST_ARGENT_MODULE_ADDRESS){
    return process.env.LOCALHOST_ARGENT_MODULE_ADDRESS;
  } else if(network === 'sepolia' && process.env.SEPOLIA_ARGENT_MODULE_ADDRESS){
    return process.env.SEPOLIA_ARGENT_MODULE_ADDRESS;
  } else {
    throw new Error(`Argent module address not found for network ${network}`);
  }
}

function getProviderAndSigner(network: string): {provider: JsonRpcProvider | AlchemyProvider, signer: Wallet} {
  let provider;
  let signerKey;

  if (network === 'localhost' && process.env.LOCALHOST_ADDRESS && process.env.LOCALHOST_SIGNER_PRIVATE_KEY) {
    provider =  new JsonRpcProvider(`http://${process.env.LOCALHOST_ADDRESS}:8545`);
    signerKey = process.env.LOCALHOST_SIGNER_PRIVATE_KEY;
  } else if (network === 'sepolia' && process.env.SEPOLIA_API_KEY && process.env.SEPOLIA_SIGNER_PRIVATE_KEY) {
    provider =   new AlchemyProvider('sepolia', process.env.SEPOLIA_API_KEY);
    signerKey = process.env.SEPOLIA_SIGNER_PRIVATE_KEY;
  } else if (network === 'mumbai' && process.env.MUMBAI_API_KEY && process.env.MUMBAI_SIGNER_PRIVATE_KEY) {
    provider =   new AlchemyProvider('matic-mumbai', process.env.MUMBAI_API_KEY);
    signerKey = process.env.MUMBAI_SIGNER_PRIVATE_KEY;
  }  else {
    throw new Error(`Provider not found for network ${network}`);
  }

  const signer = new Wallet(signerKey, provider);

  return {
    provider,
    signer
  }
}

/**
 * Effective call when an event is detected
 */
async function bridgeAction({ id, wallet, to, value, data }: BridgeCallType) {
  const { provider, signer } = getProviderAndSigner("mumbai");
  const ArgentWrappedAccountsAddress = process.env.MUMBAI_ARGENT_WRAPPED_ACCOUNTS_ADDRESS as string
  console.log("value", value)
  console.log("to", to)
  // const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(ArgentWrappedAccountsAddress, signer);
  // await argentWrappedAccounts.depositToAccountContract(to, value as ethers.BigNumberish)
}


/**
 * Main function. It listens to the BridgeCall event and calls bridgeAction when it is detected
 */
async function main() {
  const argentModuleAddress = parseArgentModuleAddress();
  const {provider, signer} = getProviderAndSigner(parseNetwork());

  const argentModuleContract = ArgentModule__factory.connect(argentModuleAddress, signer);

  await argentModuleContract.addListener('BridgeCall',
    (id: BigInt, wallet: string, to: string, value: BigInt, data: string) => {
      bridgeAction({id, wallet, to, value, data});
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});