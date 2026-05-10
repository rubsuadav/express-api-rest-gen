import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";

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

export function installDependenciesAndConfigureTSConfig(
  projectPath: string,
  language: string,
): void {
  execSync("npm init -y", { cwd: projectPath });
  console.log(chalk.green("Installing dependencies..."));
  execSync(`npm install ${BASE_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });
  execSync(`npm install --save-dev ${DEV_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });
  console.log(chalk.blue("Dependencies installed."));

  if (language === "TypeScript") {
    execSync(`npm install --save-dev ${TS_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    execSync(
      "npx tsc --init --outDir ./build --module commonjs --target es6 --esModuleInterop --verbatimModuleSyntax false",
      { cwd: projectPath },
    );
    console.log(chalk.blue("TypeScript configured."));
  }
}

export function createSourceFiles(projectPath: string, language: string): void {
  console.log(chalk.green("Creating source files..."));
  const ext = language === "TypeScript" ? "ts" : "js";
  fs.writeFileSync(path.join(projectPath, `src/app.${ext}`), getAppTemplate());
  fs.writeFileSync(
    path.join(projectPath, `src/index.${ext}`),
    getIndexTemplate(language),
  );
  console.log(chalk.blue("Source files created."));
}

export function updatePackage(projectPath: string, language: string): void {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  console.log(chalk.green("Creating scripts in package.json..."));
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatePackageJson(pkg, language), null, 2),
  );
  console.log(chalk.blue("Scripts in package.json created."));
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
