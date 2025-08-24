import fs from "fs";
import path from "path";
import chalk from "chalk";

export function checkProjectExists(projectPath, projectName) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`El proyecto ${projectName} ya existe.`));
    return true;
  }
  return false;
}

export function createFolders(basePath, folders) {
  folders.forEach((folder) => {
    console.log(chalk.green(`Creando carpeta: ${folder}`));
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });
  console.log(chalk.blue("Carpetas creadas con éxito."));
}

export function getAppTemplate() {
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

export function getIndexTemplate(language) {
  return language === "TypeScript"
    ? `import app from "./app";\n\nconst PORT = 3000;\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`
    : `import app from "./app.js";\n\nconst PORT = 3000;\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`;
}

export function updatePackageJson(pkg, language) {
  if (pkg.scripts?.test) delete pkg.scripts.test;

  if (language === "TypeScript") {
    pkg.scripts = {
      ...pkg.scripts,
      build: "npx tsc",
      start: "node build/index.js",
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
