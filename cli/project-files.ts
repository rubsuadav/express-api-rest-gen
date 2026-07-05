import fs from "fs";
import path from "path";
import ora from "ora";

import {
  BASE_DEPENDENCIES,
  DEV_DEPENDENCIES,
  TS_DEPENDENCIES,
} from "../utils/constants";
import {
  getAppTemplate,
  getIndexTemplate,
  updatePackageJson,
} from "../utils/utils";

export async function installDependenciesAndConfigureTSConfig(
  projectPath: string,
  language: string,
): Promise<void> {
  const { execSync } = await import("child_process");

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
        "npx tsc --init --rootDir . --outDir ./build --module commonjs --target es6 --esModuleInterop --verbatimModuleSyntax false --declarationDir ./build/types",
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
  console.log("Available commands:");
  Object.keys(scripts).forEach((script: string) => {
    console.log(`- npm run ${script}: ${scripts[script]}`);
  });
}
