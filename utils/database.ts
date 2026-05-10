import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ora from "ora";

//local imports
import { getMongoDBTemplate, getSQLTemplate } from "./utils";
import { SQLURI } from "./constants";

export async function connectDatabase(
  projectPath: string,
  database: string,
  language: string,
): Promise<void> {
  const spinner = ora({
    text: `Configuring ${database} database...`,
    spinner: "speaker",
    color: "blue",
  }).start();
  try {
    switch (database) {
      case "MongoDB":
        fs.writeFileSync(
          path.join(projectPath, `.env`),
          "MONGODB_URI=mongodb://127.0.0.1:27017/\nDB_NAME=yourDBNAME",
        );
        break;
      case "PostgreSQL":
        fs.writeFileSync(
          path.join(projectPath, `.env`),
          `URI=postgres${SQLURI}`,
        );
        break;
      case "MySQL":
        fs.writeFileSync(path.join(projectPath, `.env`), `URI=mysql${SQLURI}`);
        break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed("Database config file created");
    await getDatabaseTemplate(projectPath, database, language);
  } catch (error) {
    spinner.fail("Failed to configure database");
    spinner.stop();
  }
}

async function getDatabaseTemplate(
  projectPath: string,
  database: string,
  language: string,
): Promise<void> {
  const ext = language === "TypeScript" ? "ts" : "js";

  switch (database) {
    case "MongoDB":
      const spinnerMongo = ora({
        text: "Installing Mongoose...",
        spinner: "speaker",
        color: "blue",
      }).start();
      try {
        execSync(`npm i mongoose`, { cwd: projectPath });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        spinnerMongo.succeed("Mongoose installed");
      } catch (error) {
        spinnerMongo.fail("Failed to install Mongoose");
        spinnerMongo.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        await getMongoDBTemplate(language),
      );
      break;
    case "PostgreSQL":
      const spinnerPostgres = ora({
        text: "Installing PostgreSQL driver and sequelize ORM...",
        spinner: "speaker",
        color: "blue",
      }).start();
      try {
        execSync(`npm i pg pg-hstore sequelize`, { cwd: projectPath });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        spinnerPostgres.succeed("PostgreSQL driver and sequelize installed");
      } catch (error) {
        spinnerPostgres.fail("Failed to install PostgreSQL dependencies");
        spinnerPostgres.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        await getSQLTemplate(language),
      );
      break;
    case "MySQL":
      const spinnerMySQL = ora({
        text: "Installing MySQL driver and sequelize ORM...",
        spinner: "speaker",
        color: "blue",
      }).start();
      try {
        execSync(`npm i mysql2 sequelize`, { cwd: projectPath });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        spinnerMySQL.succeed("MySQL driver and sequelize installed");
      } catch (error) {
        spinnerMySQL.fail("Failed to install MySQL dependencies");
        spinnerMySQL.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        await getSQLTemplate(language),
      );
      break;
  }
}
