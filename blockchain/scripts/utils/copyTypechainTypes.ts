import fs from "fs-extra";

export default async function copyTypechainTypes(
  sourcePath: string,
  destinationPaths: string[]
) {
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
