import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import ora from "ora";

//local imports
import {
  TEST_CONFIG,
  TEST_DEPENDENCIES,
  TEST_TS_DEPENDENCIES,
} from "./constants.ts";

export async function configureTesting(
  projectPath: string,
  language: string,
): Promise<void> {
  const spinnerDeps = ora({
    text: "Installing testing dependencies (jest and supertest)...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    execSync(`npm i -D ${TEST_DEPENDENCIES.join(" ")}`, {
      cwd: projectPath,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    spinnerDeps.succeed("Testing dependencies installed");
  } catch (error) {
    spinnerDeps.fail("Failed to install testing dependencies");
    spinnerDeps.stop();
  }

  if (language === "TypeScript") {
    const spinnerTS = ora({
      text: "Installing TypeScript testing dependencies...",
      spinner: "speaker",
      color: "blue",
    }).start();
    try {
      execSync(
        `npm i -D ${TEST_TS_DEPENDENCIES.join(" ")}  && npx ts-jest config:init"`,
        {
          cwd: projectPath,
        },
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinnerTS.succeed("TypeScript testing dependencies installed");
    } catch (error) {
      spinnerTS.fail("Failed to install TypeScript testing dependencies");
      spinnerTS.stop();
    }
    updateTsConfig(projectPath);
  }

  await updateTestScripts(projectPath, language);
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

async function updateTestScripts(
  projectPath: string,
  language: string,
): Promise<void> {
  const spinner = ora({
    text: "Updating test scripts in package.json...",
    spinner: "speaker",
    color: "blue",
  }).start();
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed("Test scripts added to package.json");
  } catch (error) {
    spinner.fail("Failed to update test scripts");
    spinner.stop();
  }
}
