export const FOLDERS: string[] = [
  "src/models",
  "src/controllers",
  "src/utils",
  "src/middlewares",
  "src/routes",
  "src/validators",
  "src/tests",
];

export const BASE_DEPENDENCIES: string[] = ["express", "cors", "dotenv"];
export const DEV_DEPENDENCIES: string[] = ["morgan", "nodemon"];
export const TS_DEPENDENCIES: string[] = [
  "typescript",
  "ts-node",
  "@types/node",
  "@types/express",
  "@types/cors",
  "@types/morgan",
];

export const SQLURI: string = "://user:password@host:port/yourDBNAME";

// Testing constants
export const TEST_DEPENDENCIES: string[] = ["jest", "supertest"];
export const TEST_TS_DEPENDENCIES: string[] = [
  "ts-jest",
  "@types/jest",
  "@types/supertest",
];
export const TEST_CONFIG: string =
  "node --experimental-vm-modules node_modules/jest/bin/jest.js";
