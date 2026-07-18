import path from "path";
import chalk from "chalk";

import { FOLDERS } from "../utils/constants.ts";
import { checkProjectExists, createFolders } from "../utils/utils.ts";
import { connectDatabase } from "../utils/database.ts";
import { configureTesting } from "../utils/testing.ts";
import {
  createSourceFiles,
  getAvailableCommands,
  installDependenciesAndConfigureTSConfig,
  updatePackage,
} from "./project-files.ts";
import { promptUser } from "./prompts.ts";

export async function generateProject(): Promise<void> {
  const { projectName, language, database, testing } = await promptUser();
  const projectPath = path.join(process.cwd(), projectName);

  if (checkProjectExists(projectPath, projectName)) return;

  await createFolders(projectPath, FOLDERS);
  await createSourceFiles(projectPath, language);
  await installDependenciesAndConfigureTSConfig(projectPath, language);
  await updatePackage(projectPath, language);
  await connectDatabase(projectPath, database, language);
  testing === "Yes" ? await configureTesting(projectPath, language) : null;
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
