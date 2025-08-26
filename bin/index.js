#!/usr/bin/env node

import path from "path";

// local imports
import {
  createSourceFiles,
  installDependenciesAndConfigureTSConfig,
  promptUser,
  updatePackage,
} from "../main.js";
import { FOLDERS } from "../utils/constants.js";
import { checkProjectExists, createFolders } from "../utils/utils.js";
import { connectDatabase } from "../utils/database.js";

async function generateProject() {
  const { projectName, language, database } = await promptUser();
  const projectPath = path.join(process.cwd(), projectName);

  if (checkProjectExists(projectPath, projectName)) return;

  createFolders(projectPath, FOLDERS);
  createSourceFiles(projectPath, language);
  installDependenciesAndConfigureTSConfig(projectPath, language);
  updatePackage(projectPath, language);
  connectDatabase(projectPath, database, language);
  console.log(
    `API ${projectName} con Express y con (${language}) generada con éxito en http://localhost:3000`
  );
}

async function main() {
  try {
    await generateProject();
  } catch (error) {
    process.exit(1);
  }
}

main();
