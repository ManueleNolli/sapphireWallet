import { ethers } from 'hardhat'

async function mintSapphireNFTs() {
  const sapphireNFTsAddress = '0xB9CA1dC04B2c4AadC007D5B2f3642756d24cd5dD'
  const sapphireNFTs = await ethers.getContractAt('SapphireNFTs', sapphireNFTsAddress)

  const to = '0x2485cf7c3dbe2b0803c74EF4d6986fbcBA2A15aE'

  // mint
  const mintTx0 = await sapphireNFTs.safeMint(to, '/0')
  console.log('mintTx0', mintTx0)
  await mintTx0.wait()

  const mintTx1 = await sapphireNFTs.safeMint(to, '/1')
  await mintTx1.wait()

  const mintTx2 = await sapphireNFTs.safeMint(to, '/2')
  await mintTx2.wait()
  //
  const mintTx3 = await sapphireNFTs.safeMint(to, '/3')
  await mintTx3.wait()

  const mintTx4 = await sapphireNFTs.safeMint(to, '/4')
  await mintTx4.wait()

  console.log('Done!')

  const tokenURI = await sapphireNFTs.tokenURI(0)
  console.log('tokenURI Example', tokenURI)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mintSapphireNFTs().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
