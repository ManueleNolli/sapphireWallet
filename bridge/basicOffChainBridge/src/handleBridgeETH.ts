import {ArgentWrappedAccounts__factory} from "./contracts";
import {ethers} from "ethers";


async function handleBridgeETH(argentWrappedAccountsAddress: string, to: string, value: BigInt, signer: ethers.Signer) {
  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(argentWrappedAccountsAddress, signer);
  const tx = await argentWrappedAccounts.depositToAccountContract(to, value as ethers.BigNumberish)
  const receipt= await tx.wait();

  if (receipt == null || receipt.blockNumber == null) {
    console.error('Transaction failed')
    return
  }

  // CHECK Events
  const filter = argentWrappedAccounts.filters.Deposit(argentWrappedAccountsAddress, to);
  const events = await argentWrappedAccounts.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);

  if (events.length === 0) {
    console.error('No handle Bridge ETH Deposit event, something went wrong');
  }
}

export {
    handleBridgeETH
}