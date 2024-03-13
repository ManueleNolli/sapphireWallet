
function parseNetworks(): {baseChain: string, destinationChain: string} {
  const baseChain = process.argv[2];
  const destinationChain = process.argv[3];

  if(!baseChain || !destinationChain){
    throw new Error(`Base chain and destination chain are required, got ${baseChain} and ${destinationChain}\nUsage: yarn start <baseChain> <destinationChain>`);
  }

  return {
    baseChain,
    destinationChain
  }
}

function parseArgentModuleAddress(network: string): string {
  if(network === 'local' && process.env.LOCALHOST_ARGENT_MODULE_ADDRESS){
    return process.env.LOCALHOST_ARGENT_MODULE_ADDRESS;
  } else if(network === 'sepolia' && process.env.SEPOLIA_ARGENT_MODULE_ADDRESS){
    return process.env.SEPOLIA_ARGENT_MODULE_ADDRESS;
  } else if(network === 'mumbai' && process.env.MUMBAI_ARGENT_MODULE_ADDRESS){
    return process.env.MUMBAI_ARGENT_MODULE_ADDRESS;
  }  else {
    throw new Error(`Argent module address not found for network ${network}`);
  }
}

function parseArgentWrappedAccountsAddress(network: string): string {
  if(network === 'local' && process.env.LOCALHOST_ARGENT_WRAPPED_ACCOUNTS_ADDRESS){
    return process.env.LOCALHOST_ARGENT_WRAPPED_ACCOUNTS_ADDRESS;
  } else if(network === 'sepolia' && process.env.SEPOLIA_ARGENT_WRAPPED_ACCOUNTS_ADDRESS){
    return process.env.SEPOLIA_ARGENT_WRAPPED_ACCOUNTS_ADDRESS;
  } else if(network === 'mumbai' && process.env.MUMBAI_ARGENT_WRAPPED_ACCOUNTS_ADDRESS){
    return process.env.MUMBAI_ARGENT_WRAPPED_ACCOUNTS_ADDRESS;
  }  else {
    throw new Error(`Argent wrapped accounts address not found for network ${network}`);
  }
}

export {
    parseNetworks,
    parseArgentModuleAddress,
    parseArgentWrappedAccountsAddress
}