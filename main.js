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
    console.log(`express-api-rest-gen version: ${actual}`);
    process.exit(0);
  }
  if (latest !== actual) {
    console.log(`A new version (${latest}) is available! Update with:`);
    console.log("npm i -g express-api-rest-gen");
    process.exit(0);
  }
}

export async function promptUser() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "¿Nombre de tu API REST de Express?",
    },
    {
      type: "list",
      name: "language",
      message: "¿Quieres usar TypeScript o JavaScript?",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript",
    },
    {
      type: "list",
      name: "database",
      message: "¿Qué base de datos quieres usar?",
      choices: ["MongoDB", "PostgreSQL", "MySQL"],
      default: "MongoDB",
    },
    {
      type: "list",
      name: "testing",
      message: "¿Quieres configurar los tests de backend?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ]);
}

export function installDependenciesAndConfigureTSConfig(projectPath, language) {
  execSync("npm init -y", { cwd: projectPath });
  console.log(chalk.green("Instalando dependencias..."));
  execSync(`npm install ${BASE_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });
  execSync(`npm install --save-dev ${DEV_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });
  console.log(chalk.blue("Dependencias instaladas."));

  if (language === "TypeScript") {
    execSync(`npm install --save-dev ${TS_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    execSync(
      "npx tsc --init --outDir ./build --module commonjs --target es6 --esModuleInterop --verbatimModuleSyntax false",
      { cwd: projectPath }
    );
    console.log(chalk.blue("TypeScript configurado."));
  }
}

export function createSourceFiles(projectPath, language) {
  console.log(chalk.green("Creando archivos fuente..."));
  const ext = language === "TypeScript" ? "ts" : "js";
  fs.writeFileSync(path.join(projectPath, `src/app.${ext}`), getAppTemplate());
  fs.writeFileSync(
    path.join(projectPath, `src/index.${ext}`),
    getIndexTemplate(language)
  );
  console.log(chalk.blue("Archivos fuente creados."));
}

export function updatePackage(projectPath, language) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  console.log(chalk.green("Creando scripts en package.json..."));
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatePackageJson(pkg, language), null, 2)
  );
  console.log(chalk.blue("Scripts en package.json creados."));
}
