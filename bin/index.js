#!/usr/bin/env node

import path from "path";
import chalk from "chalk";

// local imports
import {
  createSourceFiles,
  handleVersionFlag,
  installDependenciesAndConfigureTSConfig,
  promptUser,
  updatePackage,
  getAvailableCommands,
} from "../main.js";
import { FOLDERS } from "../utils/constants.js";
import { checkProjectExists, createFolders } from "../utils/utils.js";
import { connectDatabase } from "../utils/database.js";
import { configureTesting } from "../utils/testing.js";

async function generateProject() {
  const { projectName, language, database, testing } = await promptUser();
  const projectPath = path.join(process.cwd(), projectName);

  if (checkProjectExists(projectPath, projectName)) return;

  createFolders(projectPath, FOLDERS);
  createSourceFiles(projectPath, language);
  installDependenciesAndConfigureTSConfig(projectPath, language);
  updatePackage(projectPath, language);
  connectDatabase(projectPath, database, language);
  testing === "Yes" ? configureTesting(projectPath, language) : null;
  console.log(
    chalk.green(
      `API ${projectName} created with Express and (${language}) successfully`,
    ),
  );
  console.log(
    chalk.blue(`To start working on your REST API, follow these steps:`),
  );
  console.log(chalk.blue(`1. cd ${projectName}`));
  console.log(chalk.blue(`2. npm run dev`));
  console.log(
    chalk.blue(`Your server will be running at http://localhost:3000`),
  );
  getAvailableCommands(projectPath);
}

async function main() {
  await handleVersionFlag();
  try {
    await generateProject();
  } catch (error) {
    console.error(chalk.red("Error generating the project:", error));
    process.exit(1);
  }
}

main();
