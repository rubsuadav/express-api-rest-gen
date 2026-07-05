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
