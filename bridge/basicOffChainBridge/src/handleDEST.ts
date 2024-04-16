import { ArgentWrappedAccounts__factory } from './contracts'
import { ethers } from 'ethers'


async function handleDEST(argentWrappedAccountsAddress: string, wallet: string, owner: string, data: string, signature: string, signer: ethers.Signer) {
  const argentWrappedAccounts = ArgentWrappedAccounts__factory.connect(argentWrappedAccountsAddress, signer)
  const tx = await argentWrappedAccounts.execute(wallet, owner, data, signature)
  console.log("Transaction sent", tx)
  const receipt = await tx.wait()
  console.log("Transaction mined", receipt)

  if (receipt == null || receipt.blockNumber == null) {
    console.error('Transaction failed')
    return
  }

  // CHECK Events
  const filter = argentWrappedAccounts.filters.TransactionExecuted(wallet)
  const events = await argentWrappedAccounts.queryFilter(filter, receipt.blockNumber, receipt.blockNumber)

  if (events.length === 0) {
    console.error('No handle DEST event, something went wrong')
  } else {
    const event = events[0]
    if (!event.args.success) {
      console.error('DEST event, Transaction failed')
    }
  }
}

export {
  handleDEST
}