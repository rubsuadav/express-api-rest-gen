import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import ora from "ora";

//local imports
import {
  TEST_CONFIG,
  TEST_DEPENDENCIES,
  TEST_TS_DEPENDENCIES,
} from "./constants";

export function configureTesting(projectPath: string, language: string): void {
  const spinnerDeps = ora(
    "Installing testing dependencies (jest and supertest)...",
  ).start();
  try {
    execSync(`npm i -D ${TEST_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    spinnerDeps.succeed("Testing dependencies installed");
  } catch (error) {
    spinnerDeps.fail("Failed to install testing dependencies");
    spinnerDeps.stop();
  }

  if (language === "TypeScript") {
    const spinnerTS = ora(
      "Installing TypeScript testing dependencies...",
    ).start();
    try {
      execSync(
        `npm i -D ${TEST_TS_DEPENDENCIES.join(" ")}  && npx ts-jest config:init"`,
        {
          cwd: projectPath,
        },
      );
      spinnerTS.succeed("TypeScript testing dependencies installed");
    } catch (error) {
      spinnerTS.fail("Failed to install TypeScript testing dependencies");
      spinnerTS.stop();
    }
    updateTsConfig(projectPath);
  }

  updateTestScripts(projectPath, language);
}

function updateTsConfig(projectPath: string): void {
  const tsconfigPath = path.join(projectPath, "tsconfig.json");
  const tsconfig = JSON.parse(
    fs
      .readFileSync(tsconfigPath, "utf-8")
      .replace(/\/\/.*$/gm, "") // drop single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // drop multi-line comments
      .replace(/,\s*([}\]])/g, "$1"), // drop trailing commas
  );
  tsconfig.compilerOptions.types.push("jest");
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

function updateTestScripts(projectPath: string, language: string): void {
  const spinner = ora("Updating test scripts in package.json...").start();
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
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
    spinner.succeed("Test scripts added to package.json");
  } catch (error) {
    spinner.fail("Failed to update test scripts");
    spinner.stop();
  }
}
