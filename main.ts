import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import ora from "ora";

// local imports
import {
  BASE_DEPENDENCIES,
  DEV_DEPENDENCIES,
  TS_DEPENDENCIES,
} from "./utils/constants";
import {
  getAppTemplate,
  getIndexTemplate,
  updatePackageJson,
  validateProjectName,
} from "./utils/utils";

export async function handleVersionFlag(): Promise<void> {
  const args = process.argv.slice(2);
  const actual = execSync("npm list -g express-api-rest-gen", {
    encoding: "utf-8",
  })
    .trim()
    .match(/express-api-rest-gen@([\d.]+)/)![1]; // Extract version using regex
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
      console.log(chalk.blue(`Continuing with version ${actual}...`));
    }
  }
}

export async function promptUser(): Promise<{
  projectName: string;
  language: string;
  database: string;
  testing: string;
}> {
  return await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the name of your project:",
      validate: (input: string) =>
        validateProjectName(input) === true || validateProjectName(input),
    },
    {
      type: "list",
      name: "language",
      message: "Do you want to use TypeScript or JavaScript?",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript",
    },
    {
      type: "list",
      name: "database",
      message: "What database do you want to use?",
      choices: ["MongoDB", "PostgreSQL", "MySQL"],
      default: "MongoDB",
    },
    {
      type: "list",
      name: "testing",
      message: "Do you want to configure backend tests?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ]);
}

export async function installDependenciesAndConfigureTSConfig(
  projectPath: string,
  language: string,
): Promise<void> {
  const spinnerInit = ora({
    text: "Initializing npm project...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    execSync("npm init -y", { cwd: projectPath });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinnerInit.succeed("Project initialized");
  } catch (error) {
    spinnerInit.fail("Failed to initialize project");
    spinnerInit.stop();
  }

  const spinnerDeps = ora({
    text: "Installing dependencies...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    execSync(`npm install ${BASE_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    execSync(`npm install --save-dev ${DEV_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    spinnerDeps.succeed("Dependencies installed");
  } catch (error) {
    spinnerDeps.fail("Failed to install dependencies");
    spinnerDeps.stop();
  }

  if (language === "TypeScript") {
    const spinnerTS = ora({
      text: "Installing TypeScript dependencies...",
      spinner: "speaker",
      color: "blue",
    }).start();
    try {
      execSync(`npm install --save-dev ${TS_DEPENDENCIES.join(" ")}`, {
        cwd: projectPath,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      spinnerTS.succeed("TypeScript dependencies installed");
    } catch (error) {
      spinnerTS.fail("Failed to install TypeScript dependencies");
      spinnerTS.stop();
    }

    const spinnerTSConfig = ora({
      text: "Configuring TypeScript...",
      spinner: "speaker",
      color: "blue",
    }).start();
    try {
      execSync(
        "npx tsc --init --outDir ./build --module commonjs --target es6 --esModuleInterop --verbatimModuleSyntax false",
        { cwd: projectPath },
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinnerTSConfig.succeed("TypeScript configured");
    } catch (error) {
      spinnerTSConfig.fail("Failed to configure TypeScript");
      spinnerTSConfig.stop();
    }
  }
}

export async function createSourceFiles(
  projectPath: string,
  language: string,
): Promise<void> {
  const spinner = ora({
    text: "Creating source files...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    const ext = language === "TypeScript" ? "ts" : "js";
    fs.writeFileSync(
      path.join(projectPath, `src/app.${ext}`),
      getAppTemplate(),
    );
    fs.writeFileSync(
      path.join(projectPath, `src/index.${ext}`),
      getIndexTemplate(language),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed("Source files created");
  } catch (error) {
    spinner.fail("Failed to create source files");
    spinner.stop();
  }
}

export async function updatePackage(
  projectPath: string,
  language: string,
): Promise<void> {
  const spinner = ora({
    text: "Creating scripts in package.json...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(updatePackageJson(pkg, language), null, 2),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed("Scripts in package.json created");
  } catch (error) {
    spinner.fail("Failed to create scripts in package.json");
    spinner.stop();
  }
}

export function getAvailableCommands(projectPath: string): void {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectPath, "package.json"), "utf-8"),
  );
  const scripts = packageJson.scripts;
  console.log(chalk.blue(`Available commands:`));
  Object.keys(scripts).forEach((script: string) => {
    console.log(chalk.blue(`- npm run ${script}: ${scripts[script]}`));
  });
}
