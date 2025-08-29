export const FOLDERS = [
  "src/models",
  "src/controllers",
  "src/utils",
  "src/middlewares",
  "src/routes",
  "src/validators",
  "src/tests",
];

export const BASE_DEPENDENCIES = ["express", "cors", "dotenv"];
export const DEV_DEPENDENCIES = ["morgan", "nodemon"];
export const TS_DEPENDENCIES = [
  "typescript",
  "ts-node",
  "@types/node",
  "@types/express",
  "@types/cors",
  "@types/morgan",
];

export const SQLURI = "://user:password@host:port/yourDBNAME";
export const TEST_CONFIG =
  "node --experimental-vm-modules node_modules/jest/bin/jest.js";
