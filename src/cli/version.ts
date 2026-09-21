import inquirer from "inquirer";
import { execSync } from "child_process";
import chalk from "chalk";

export async function handleVersionFlag(): Promise<void> {
  const args = process.argv.slice(2);
  const actual = execSync("npm list -g express-api-rest-gen", {
    encoding: "utf-8",
  })
    .trim()
    .match(/express-api-rest-gen@([\d.]+)/)![1];
  const latest = execSync("npm view express-api-rest-gen version", {
    encoding: "utf-8",
  }).trim();

  if (args.includes("--version") || args.includes("-v")) {
    console.log(chalk.blue(`Current version: ${actual}`));
    process.exit(0);
  }

  if (latest !== actual) {
    console.log(chalk.yellow(`A new version (${latest}) is available!`));
    const { shouldUpdate } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldUpdate",
        message: `Would you like to update from ${actual} to ${latest}?`,
        default: false,
      },
    ]);

    if (shouldUpdate) {
      console.log(chalk.blue(`Updating to version ${latest}...`));
      execSync("npm i -g express-api-rest-gen@latest");
      console.log(chalk.green(`Successfully updated to ${latest}!`));
    } else {
      process.exit(0);
    }
  }
}
