import { AlchemyProvider, ethers, JsonRpcProvider, Wallet } from "ethers";

function getProviderAndSigner(network: string): {provider: JsonRpcProvider | AlchemyProvider, signer: Wallet} {
  let provider;
  let signerKey;

  if (network === 'local' && process.env.LOCALHOST_ADDRESS && process.env.LOCALHOST_SIGNER_PRIVATE_KEY) {
    provider =  new JsonRpcProvider(`http://${process.env.LOCALHOST_ADDRESS}:8545`);
    signerKey = process.env.LOCALHOST_SIGNER_PRIVATE_KEY;
  } else if (network === 'sepolia' && process.env.SEPOLIA_API_KEY && process.env.SEPOLIA_SIGNER_PRIVATE_KEY) {
    provider =   new AlchemyProvider('sepolia', process.env.SEPOLIA_API_KEY);
    signerKey = process.env.SEPOLIA_SIGNER_PRIVATE_KEY;
  } else if (network === 'amoy' && process.env.AMOY_API_KEY && process.env.AMOY_SIGNER_PRIVATE_KEY) {
    provider = new ethers.JsonRpcProvider(`https://polygon-amoy.g.alchemy.com/v2/${process.env.AMOY_API_KEY}`);
    signerKey = process.env.AMOY_SIGNER_PRIVATE_KEY;
  }  else {
    throw new Error(`Provider not found for network ${network}`);
  }

  const signer = new Wallet(signerKey, provider);

  return {
    provider,
    signer
  }
}

export {
    getProviderAndSigner
}