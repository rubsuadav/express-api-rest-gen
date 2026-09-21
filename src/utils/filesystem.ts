import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

export function checkProjectExists(
  projectPath: string,
  projectName: string,
): boolean {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Project ${projectName} already exists.`));
    return true;
  }

  return false;
}

export async function createFolders(
  basePath: string,
  folders: string[],
): Promise<void> {
  const spinner = ora({
    text: "Creating project structure...",
    spinner: "speaker",
    color: "blue",
  }).start();

  try {
    folders.forEach((folder: string) => {
      fs.mkdirSync(path.join(basePath, folder), { recursive: true });
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed("Project structure created successfully");
  } catch (error) {
    spinner.fail("Failed to create project structure");
    spinner.stop();
  }
}