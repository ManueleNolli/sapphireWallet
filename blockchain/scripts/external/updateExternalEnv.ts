import fs from "fs-extra";

export type EnvValue = {
  key: string;
  value: string;
};

/**
 * Read the env.
 * If the key is present, update the value.
 * If the key is not present, insert the key-value pair.
 */
export default async function updateExternalEnv(
  envPath: string,
  envValues: EnvValue[]
) {
  const env = fs.readFileSync(envPath, "utf-8");
  const lines = env.split("\n");

  for (const envValue of envValues) {
    const index = lines.findIndex((line) => line.startsWith(envValue.key));
    if (index != -1) {
      lines[index] = `${envValue.key}="${envValue.value}"`;
    } else {
      lines.push(`${envValue.key}="${envValue.value}"`);
    }
  }

  const newEnv = lines.join("\n");
  await fs.writeFile(envPath, newEnv);
}
