import chalk from "chalk";

import { generateProject } from "./project";
import { handleVersionFlag } from "./version";

export async function runCli(): Promise<void> {
  await handleVersionFlag();
  try {
    await generateProject();
  } catch (error) {
    console.error(chalk.red("Error generating project:"), error);
    process.exit(1);
  }
}
