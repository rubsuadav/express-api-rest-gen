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
      `API ${projectName} con Express y con (${language}) generada con éxito`,
    ),
  );
  console.log(
    chalk.blue(`Para empezar a trabajar en tu API REST, sigue estos pasos:`),
  );
  console.log(chalk.blue(`1. cd ${projectName}`));
  console.log(chalk.blue(`2. npm run dev`));
  console.log(
    chalk.blue(`Tu servidor estará corriendo en http://localhost:3000`),
  );
  getAvailableCommands(projectPath);
}

async function main() {
  handleVersionFlag();
  try {
    await generateProject();
  } catch (error) {
    console.error(chalk.red("Error al generar el proyecto:", error));
    process.exit(1);
  }
}

main();
