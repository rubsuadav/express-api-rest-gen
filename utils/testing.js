import { execSync } from "child_process";
import chalk from "chalk";
import path from "path";
import fs from "fs";

export function configureTesting(projectPath, language) {
  const ext = language === "TypeScript" ? "ts" : "js";
  console.log(
    chalk.green("Instalando dependencias necesarias (jest y supertest)...")
  );
  execSync("npm i -D jest supertest", {
    cwd: projectPath,
  });
  if (language === "JavaScript") {
    //TODO, CONFIGURA JEST FOR USING ECMASCRIPT MODULES
  }
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
  updateTestScripts(projectPath);
  console.log(chalk.blue("Scripts en package.json creados."));
}

function updateTsConfig(projectPath) {
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));
  tsconfig.compilerOptions.types.push("jest");
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

function updateTestScripts(projectPath) {
  const packageJsonPath = path.join(projectPath, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  console.log(chalk.yellow("Creando scripts de testing en package.json..."));
  pkg.scripts = {
    ...pkg.scripts,
    test: "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
}
