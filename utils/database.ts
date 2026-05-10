import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import ora from "ora";

//local imports
import { getMongoDBTemplate, getSQLTemplate } from "./utils";
import { SQLURI } from "./constants";

export function connectDatabase(
  projectPath: string,
  database: string,
  language: string,
): void {
  const spinner = ora(`Configuring ${database} database...`).start();
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
    spinner.succeed("Database config file created");
    getDatabaseTemplate(projectPath, database, language);
  } catch (error) {
    spinner.fail("Failed to configure database");
    spinner.stop();
  }
}

function getDatabaseTemplate(
  projectPath: string,
  database: string,
  language: string,
): void {
  const ext = language === "TypeScript" ? "ts" : "js";

  switch (database) {
    case "MongoDB":
      const spinnerMongo = ora("Installing Mongoose...").start();
      try {
        execSync(`npm i mongoose`, { cwd: projectPath });
        spinnerMongo.succeed("Mongoose installed");
      } catch (error) {
        spinnerMongo.fail("Failed to install Mongoose");
        spinnerMongo.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        getMongoDBTemplate(language),
      );
      break;
    case "PostgreSQL":
      const spinnerPostgres = ora(
        "Installing PostgreSQL driver and sequelize ORM...",
      ).start();
      try {
        execSync(`npm i pg pg-hstore sequelize`, { cwd: projectPath });
        spinnerPostgres.succeed("PostgreSQL driver and sequelize installed");
      } catch (error) {
        spinnerPostgres.fail("Failed to install PostgreSQL dependencies");
        spinnerPostgres.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        getSQLTemplate(language),
      );
      break;
    case "MySQL":
      const spinnerMySQL = ora(
        "Installing MySQL driver and sequelize ORM...",
      ).start();
      try {
        execSync(`npm i mysql2 sequelize`, { cwd: projectPath });
        spinnerMySQL.succeed("MySQL driver and sequelize installed");
      } catch (error) {
        spinnerMySQL.fail("Failed to install MySQL dependencies");
        spinnerMySQL.stop();
      }
      fs.writeFileSync(
        path.join(projectPath, `database.${ext}`),
        getSQLTemplate(language),
      );
      break;
  }
}
