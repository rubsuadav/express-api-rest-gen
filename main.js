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
} from "./utils/constants.js";
import {
  getAppTemplate,
  getIndexTemplate,
  updatePackageJson,
} from "./utils/utils.js";

export function handleVersionFlag() {
  const args = process.argv.slice(2);
  const actual = execSync("npm list -g express-api-rest-gen", {
    encoding: "utf-8",
  })
    .trim()
    .match(/express-api-rest-gen@([\d.]+)/)[1]; // Extract version using regex
  const latest = execSync("npm view express-api-rest-gen version", {
    encoding: "utf-8",
  }).trim();
  if (args.includes("--version") || args.includes("-v")) {
    console.log(chalk.blue(`Current version: ${actual}`));
    process.exit(0);
  }
  if (latest !== actual) {
    console.log(
      chalk.yellow(`A new version (${latest}) is available! Update with:`),
    );
    console.log(chalk.yellow(`npm i -g express-api-rest-gen@latest`));
    process.exit(0);
  }
}

export async function promptUser() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the name of your project:",
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

export function installDependenciesAndConfigureTSConfig(projectPath, language) {
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

export function createSourceFiles(projectPath, language) {
  console.log(chalk.green("Creating source files..."));
  const ext = language === "TypeScript" ? "ts" : "js";
  fs.writeFileSync(path.join(projectPath, `src/app.${ext}`), getAppTemplate());
  fs.writeFileSync(
    path.join(projectPath, `src/index.${ext}`),
    getIndexTemplate(language),
  );
  console.log(chalk.blue("Source files created."));
}

export function updatePackage(projectPath, language) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  console.log(chalk.green("Creating scripts in package.json..."));
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatePackageJson(pkg, language), null, 2),
  );
  console.log(chalk.blue("Scripts in package.json created."));
}

export function getAvailableCommands(projectPath) {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectPath, "package.json"), "utf-8"),
  );
  const scripts = packageJson.scripts;
  console.log(chalk.blue(`Available commands:`));
  Object.keys(scripts).forEach((script) => {
    console.log(chalk.blue(`- npm run ${script}: ${scripts[script]}`));
  });
}
