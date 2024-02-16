import 'dotenv/config'
import { AlchemyProvider, JsonRpcProvider, Wallet } from 'ethers'
import { ArgentModule__factory } from './contracts'


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

function getProviderAndSigner(): {provider: JsonRpcProvider | AlchemyProvider, signer: Wallet} {
  const network = parseNetwork()
  let provider;
  let signerKey;

  if (network === 'localhost' && process.env.LOCALHOST_ADDRESS && process.env.LOCALHOST_SIGNER_PRIVATE_KEY) {
    provider =  new JsonRpcProvider(`http://${process.env.LOCALHOST_ADDRESS}:8545`);
    signerKey = process.env.LOCALHOST_SIGNER_PRIVATE_KEY;
  } else if (network === 'sepolia' && process.env.SEPOLIA_API_KEY && process.env.SEPOLIA_SIGNER_PRIVATE_KEY) {
    provider =   new AlchemyProvider('sepolia', process.env.SEPOLIA_API_KEY);
    signerKey = process.env.SEPOLIA_SIGNER_PRIVATE_KEY;
  } else {
    throw new Error(`Provider not found for network ${network}`);
  }

  const signer = new Wallet(signerKey, provider);

  return {
    provider,
    signer
  }
}

async function main() {
  const argentModuleAddress = parseArgentModuleAddress();
  const {provider, signer} = getProviderAndSigner();

  const argentModuleContract = ArgentModule__factory.connect(argentModuleAddress, signer);

  let blockNumber = await provider.getBlockNumber();
  console.log("Start block number: ", blockNumber);
  let checkedBlockNumber = blockNumber - 1;

  await argentModuleContract.addListener('BridgeCall',
    (from, to, value, data, blockNumber, transactionHash, logIndex, event) => {
      console.log("BridgeCall event: ", from, to, value, data, blockNumber, transactionHash, logIndex, event);
    })

  console.log("Listening for BridgeCall events")

  // while(true){
  //
  //   if (blockNumber > checkedBlockNumber) {
  //     console.log("Some new blocks found")
  //     for (let i = checkedBlockNumber + 1; i <= blockNumber; i++) {
  //       // CHECKING BLOCK
  //
  //       // Check argent module BridgeCall event
  //       const filter = argentModuleContract.filters.BridgeCall
  //       const events = await provider.getLogs({
  //         ...filter,
  //         fromBlock: i,
  //         toBlock: i
  //       })
  //
  //     }
  //
  //     checkedBlockNumber = blockNumber;
  //   }
  //
  //   // WAIT 1 SECOND
  //   await new Promise((resolve) => setTimeout(resolve, 12000));
  //
  //   // GETTING NEW BLOCK NUMBER
  //   blockNumber = await provider.getBlockNumber();
  //   console.log("Retrieved block number: ", blockNumber);
  // }


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});