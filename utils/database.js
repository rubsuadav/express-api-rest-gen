import fs from "fs";
import chalk from "chalk";
import path from "path";
import { execSync } from "child_process";

//local imports
import { getMongoDBTemplate, getSQLTemplate } from "./utils.js";
import { SQLURI } from "./constants.js";

export function connectDatabase(projectPath, database, language) {
  const ext = language === "TypeScript" ? "ts" : "js";
  switch (database) {
    case "MongoDB":
      fs.writeFileSync(
        path.join(projectPath, `.env`),
        "MONGODB_URI=mongodb://127.0.0.1:27017/\nDB_NAME=yourDBNAME"
      );
      break;
    case "PostgreSQL":
      fs.writeFileSync(path.join(projectPath, `.env`), `URI=postgres${SQLURI}`);
      break;
    case "MySQL":
      fs.writeFileSync(path.join(projectPath, `.env`), `URI=mysql${SQLURI}`);
      break;
  }
  fs.writeFileSync(
    path.join(projectPath, `database.${ext}`),
    getDatabaseTemplate(projectPath, database, language)
  );
  console.log(chalk.blue("Archivos de conexión a la base de datos creado."));
}

function getDatabaseTemplate(projectPath, database, language) {
  switch (database) {
    case "MongoDB":
      console.log(chalk.green("Instalando Mongoose..."));
      execSync(`npm i mongoose`, { cwd: projectPath });
      return getMongoDBTemplate(language);
    case "PostgreSQL":
      console.log(
        chalk.green("Instalando driver de PostgreSQL y ORM sequelize...")
      );
      execSync(`npm i pg pg-hstore sequelize`, { cwd: projectPath });
      return getSQLTemplate(language);
    case "MySQL":
      console.log(chalk.green("Instalando driver de MySQL y ORM sequelize..."));
      execSync(`npm i mysql2 sequelize`, { cwd: projectPath });
      return getSQLTemplate(language);
    default:
      return "";
  }
}
