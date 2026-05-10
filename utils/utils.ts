import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

export function validateProjectName(name: string): boolean | string {
  // npm package names can only contain lowercase letters, numbers, hyphens, and underscores
  // Pattern: /^[a-z0-9_-]+$/i allows letters, numbers, hyphens, and underscores
  const validNamePattern = /^[a-z0-9_-]+$/i;

  if (!name || name.trim().length === 0) {
    return "Project name cannot be empty.";
  }

  if (!validNamePattern.test(name)) {
    return "Invalid project name. Project names can only contain letters, numbers, hyphens (-), and underscores (_). No special characters like @, #, $, etc. are allowed.";
  }

  return true;
}

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

export function createFolders(basePath: string, folders: string[]): void {
  const spinner = ora({
    text: "Creating project structure...",
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    folders.forEach((folder: string) => {
      fs.mkdirSync(path.join(basePath, folder), { recursive: true });
    });
    spinner.succeed("Project structure created successfully");
  } catch (error) {
    spinner.fail("Failed to create project structure");
    spinner.stop();
  }
}

export function getAppTemplate(): string {
  return (
    `import express from "express";\n` +
    `import morgan from "morgan";\n` +
    `import cors from "cors";\n\n` +
    `const app = express();\n\n` +
    `app.use(cors());\n` +
    `app.use(morgan("dev"));\n` +
    `app.use(express.json());\n\n` +
    `//ADD YOUR ROUTES HERE\n\n` +
    `export default app;`
  );
}

export function getIndexTemplate(language: string): string {
  return language === "TypeScript"
    ? `import app from "./app";\n\nimport { connectToDatabase } from "../database";\n\nconst PORT = 3000;\n\nconnectToDatabase();\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`
    : `import app from "./app.js";\n\nimport { connectToDatabase } from "../database.js";\n\nconst PORT = 3000;\n\nconnectToDatabase();\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`;
}

export function updatePackageJson(pkg: any, language: string): any {
  if (pkg.scripts?.test) delete pkg.scripts.test;

  if (language === "TypeScript") {
    pkg.scripts = {
      ...pkg.scripts,
      build: "npx tsc",
      start: "node build/src/index.js",
      dev: "set NODE_ENV=development && nodemon src/index.ts",
    };
  } else {
    pkg.scripts = {
      ...pkg.scripts,
      start: "node src/index.js",
      dev: "set NODE_ENV=development && nodemon src/index.js",
    };
    pkg.type = "module";
  }
  return pkg;
}

export function getMongoDBTemplate(language: string): string {
  const spinner = ora({
    text: "Generating MongoDB connection template...",
    spinner: "speaker",
    color: "blue",
  }).start();
  const text =
    language === "TypeScript"
      ? `
    import mongoose from 'mongoose';
    import 'dotenv/config';

    export async function connectToDatabase(): Promise<void> {
      try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
          dbName: process.env.DB_NAME as string,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`
      : `
    import mongoose from 'mongoose';
    import 'dotenv/config';

    export async function connectToDatabase() {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          dbName: process.env.DB_NAME,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;
  spinner.succeed("MongoDB template generated");
  return text;
}

export function getSQLTemplate(language: string): string {
  const spinner = ora({
    text: "Generating SQL connection template...",
    spinner: "speaker",
    color: "blue",
  }).start();
  const text =
    language === "TypeScript"
      ? `
    import { Sequelize } from 'sequelize';
    import 'dotenv/config';

    const sequelize = new Sequelize(process.env.URI as string);

    export async function connectToDatabase(): Promise<void> {
      try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`
      : `
    import { Sequelize } from 'sequelize';
    import 'dotenv/config';

    const sequelize = new Sequelize(process.env.URI);

    export async function connectToDatabase() {
      try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;
  spinner.succeed("SQL template generated");
  return text;
}
