import ora from "ora";

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

export async function getMongoDBTemplate(language: string): Promise<string> {
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

  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.succeed("MongoDB template generated");
  return text;
}

export async function getSQLTemplate(language: string): Promise<string> {
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

  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.succeed("SQL template generated");
  return text;
}