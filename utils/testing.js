import { execSync } from "child_process";
import chalk from "chalk";
import path from "path";
import fs from "fs";

//local imports
import { TEST_CONFIG } from "./constants.js";

export function configureTesting(projectPath, language) {
  console.log(
    chalk.green(
      "Instalando dependencias necesarias de test (jest y supertest)..."
    )
  );
  execSync("npm i -D jest supertest", {
    cwd: projectPath,
  });
  if (language === "TypeScript") {
    execSync(
      "npm i -D ts-jest @types/jest @types/supertest && npx ts-jest config:init",
      {
        cwd: projectPath,
      }
    );
    updateTsConfig(projectPath);
  }
  console.log(chalk.blue("Dependencias instaladas."));
  updateTestScripts(projectPath, language);
  console.log(chalk.blue("Scripts en package.json creados."));
}

function updateTsConfig(projectPath) {
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  const tsconfig = JSON.parse(
    fs
      .readFileSync(tsconfigPath, "utf-8")
      .replace(/\/\/.*$/gm, "") // drop single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // drop multi-line comments
      .replace(/,\s*([}\]])/g, "$1") // drop trailing commas
  );
  tsconfig.compilerOptions.types.push("jest");
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

function updateTestScripts(projectPath, language) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  console.log(chalk.yellow("Creando scripts de testing en package.json..."));
  pkg.scripts = {
    ...pkg.scripts,
    test: language === "TypeScript" ? "jest" : `${TEST_CONFIG}`,
    "test:watch":
      language === "TypeScript" ? "jest --watch" : `${TEST_CONFIG} --watch`,
    "test:coverage":
      language === "TypeScript"
        ? "jest --coverage"
        : `${TEST_CONFIG} --coverage`,
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
}
