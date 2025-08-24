import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

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
  ]);
}

export function installDependenciesAndConfigureTSConfig(projectPath, language) {
  execSync("npm init -y", { cwd: projectPath });
  execSync(`npm install ${BASE_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });
  execSync(`npm install --save-dev ${DEV_DEPENDENCIES.join(" ")}`, {
    cwd: projectPath,
  });

  if (language === "TypeScript") {
    execSync(`npm install --save-dev ${TS_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    execSync(
      "npx tsc --init --outDir ./build --module commonjs --target es6 --esModuleInterop --verbatimModuleSyntax false",
      { cwd: projectPath }
    );
  }
}

export function createSourceFiles(projectPath, language) {
  const ext = language === "TypeScript" ? "ts" : "js";
  fs.writeFileSync(path.join(projectPath, `src/app.${ext}`), getAppTemplate());
  fs.writeFileSync(
    path.join(projectPath, `src/index.${ext}`),
    getIndexTemplate(language)
  );
}

export function updatePackage(projectPath, language) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(updatePackageJson(pkg, language), null, 2)
  );
}
