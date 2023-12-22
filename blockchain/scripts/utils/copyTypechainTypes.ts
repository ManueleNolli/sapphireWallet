import fs from "fs-extra";

const sourcePath = "typechain-types"
const destinationPaths = [
    "../mobileapp/src/contracts",
    "../backend/wallet-factory/src/contracts",
    "../backend/sapphire-relayer/src/contracts",
]

async function copyTypechainTypes() {
  if (destinationPaths.length === 0) {
    console.error("No destination paths specified!");
    return;
  }

  // Copy the files
  for (const destinationPath of destinationPaths) {
    try {
      console.log(`Copying ${sourcePath} to ${destinationPath}...`);
      await fs.remove(destinationPath);
      await fs.ensureDir(destinationPath);
      await fs.copy(sourcePath, destinationPath);
      console.log(`Copied ${sourcePath} to ${destinationPath}!`);
    } catch (e) {
      console.error("Error copying TypeChain types:", e);
    }
  }
}

copyTypechainTypes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
