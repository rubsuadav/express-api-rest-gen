import fs from "fs";
import chalk from "chalk";
import path from "path";
import { execSync } from "child_process";

//local imports
import { getMongoDBTemplate } from "./utils.js";

export function connectDatabase(projectPath, database, language) {
  const ext = language === "TypeScript" ? "ts" : "js";
  //change to DDBB type
  fs.writeFileSync(
    path.join(projectPath, `.env`),
    "MONGODB_URI=mongodb://127.0.0.1:27017/\nDB_NAME=yourDBNAME"
  );
  //
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
      //TODO
      console.log(`Seleccionado ${database}`);
      return "";
    case "MySQL":
      //TODO
      console.log(`Seleccionado ${database}`);
      return "";
    default:
      return "";
  }
}
