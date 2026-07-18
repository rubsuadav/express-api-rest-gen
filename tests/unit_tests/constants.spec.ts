import { describe, test } from "node:test";
import { strictEqual, ok } from "node:assert";

// local imports
import {
  FOLDERS,
  BASE_DEPENDENCIES,
  DEV_DEPENDENCIES,
  TS_DEPENDENCIES,
  SQLURI,
  TEST_DEPENDENCIES,
  TEST_TS_DEPENDENCIES,
  TEST_CONFIG,
} from "../../utils/constants.ts";

describe("FOLDERS", () => {
  test("is an array", () => {
    ok(Array.isArray(FOLDERS));
  });

  test("has exactly 7 folders", () => {
    strictEqual(FOLDERS.length, 7);
  });

  test("contains src/models", () => {
    ok(FOLDERS.includes("src/models"));
  });

  test("contains src/controllers", () => {
    ok(FOLDERS.includes("src/controllers"));
  });

  test("contains src/utils", () => {
    ok(FOLDERS.includes("src/utils"));
  });

  test("contains src/middlewares", () => {
    ok(FOLDERS.includes("src/middlewares"));
  });

  test("contains src/routes", () => {
    ok(FOLDERS.includes("src/routes"));
  });

  test("contains src/validators", () => {
    ok(FOLDERS.includes("src/validators"));
  });

  test("contains src/tests", () => {
    ok(FOLDERS.includes("src/tests"));
  });

  test("all entries are strings starting with src/", () => {
    for (const folder of FOLDERS) {
      ok(typeof folder === "string");
      ok(folder.startsWith("src/"), `Expected "${folder}" to start with "src/"`);
    }
  });
});

describe("BASE_DEPENDENCIES", () => {
  test("is an array", () => {
    ok(Array.isArray(BASE_DEPENDENCIES));
  });

  test("has exactly 3 dependencies", () => {
    strictEqual(BASE_DEPENDENCIES.length, 3);
  });

  test("contains express", () => {
    ok(BASE_DEPENDENCIES.includes("express"));
  });

  test("contains cors", () => {
    ok(BASE_DEPENDENCIES.includes("cors"));
  });

  test("contains dotenv", () => {
    ok(BASE_DEPENDENCIES.includes("dotenv"));
  });
});

describe("DEV_DEPENDENCIES", () => {
  test("is an array", () => {
    ok(Array.isArray(DEV_DEPENDENCIES));
  });

  test("has exactly 2 dependencies", () => {
    strictEqual(DEV_DEPENDENCIES.length, 2);
  });

  test("contains morgan", () => {
    ok(DEV_DEPENDENCIES.includes("morgan"));
  });

  test("contains nodemon", () => {
    ok(DEV_DEPENDENCIES.includes("nodemon"));
  });
});

describe("TS_DEPENDENCIES", () => {
  test("is an array", () => {
    ok(Array.isArray(TS_DEPENDENCIES));
  });

  test("has exactly 6 dependencies", () => {
    strictEqual(TS_DEPENDENCIES.length, 6);
  });

  test("contains typescript", () => {
    ok(TS_DEPENDENCIES.includes("typescript"));
  });

  test("contains ts-node", () => {
    ok(TS_DEPENDENCIES.includes("ts-node"));
  });

  test("contains @types/node", () => {
    ok(TS_DEPENDENCIES.includes("@types/node"));
  });

  test("contains @types/express", () => {
    ok(TS_DEPENDENCIES.includes("@types/express"));
  });

  test("contains @types/cors", () => {
    ok(TS_DEPENDENCIES.includes("@types/cors"));
  });

  test("contains @types/morgan", () => {
    ok(TS_DEPENDENCIES.includes("@types/morgan"));
  });
});

describe("SQLURI", () => {
  test("is a non-empty string", () => {
    ok(typeof SQLURI === "string");
    ok(SQLURI.length > 0);
  });

  test("includes :// scheme separator", () => {
    ok(SQLURI.includes("://"));
  });

  test("includes user:password placeholder", () => {
    ok(SQLURI.includes("user:password"));
  });

  test("includes host:port placeholder", () => {
    ok(SQLURI.includes("host:port"));
  });

  test("includes yourDBNAME placeholder", () => {
    ok(SQLURI.includes("yourDBNAME"));
  });
});

describe("TEST_DEPENDENCIES", () => {
  test("is an array", () => {
    ok(Array.isArray(TEST_DEPENDENCIES));
  });

  test("has exactly 2 dependencies", () => {
    strictEqual(TEST_DEPENDENCIES.length, 2);
  });

  test("contains jest", () => {
    ok(TEST_DEPENDENCIES.includes("jest"));
  });

  test("contains supertest", () => {
    ok(TEST_DEPENDENCIES.includes("supertest"));
  });
});

describe("TEST_TS_DEPENDENCIES", () => {
  test("is an array", () => {
    ok(Array.isArray(TEST_TS_DEPENDENCIES));
  });

  test("has exactly 3 dependencies", () => {
    strictEqual(TEST_TS_DEPENDENCIES.length, 3);
  });

  test("contains ts-jest", () => {
    ok(TEST_TS_DEPENDENCIES.includes("ts-jest"));
  });

  test("contains @types/jest", () => {
    ok(TEST_TS_DEPENDENCIES.includes("@types/jest"));
  });

  test("contains @types/supertest", () => {
    ok(TEST_TS_DEPENDENCIES.includes("@types/supertest"));
  });
});

describe("TEST_CONFIG", () => {
  test("is a non-empty string", () => {
    ok(typeof TEST_CONFIG === "string");
    ok(TEST_CONFIG.length > 0);
  });

  test("references the jest binary path", () => {
    ok(TEST_CONFIG.includes("jest"));
  });

  test("uses node to run jest", () => {
    ok(TEST_CONFIG.startsWith("node"));
  });
});
