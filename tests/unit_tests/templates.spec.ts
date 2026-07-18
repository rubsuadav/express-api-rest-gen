import { describe, test } from "node:test";
import { ok } from "node:assert/strict";

// local imports
import {
  getAppTemplate,
  getIndexTemplate,
  getMongoDBTemplate,
  getSQLTemplate,
} from "../../utils/templates.ts";

describe("getAppTemplate", () => {
  test("returns a string", () => {
    const result = getAppTemplate();
    ok(typeof result === "string");
    ok(result.length > 0);
  });

  test("includes express import", () => {
    const result = getAppTemplate();
    ok(result.includes('import express from "express"'));
  });

  test("includes cors import", () => {
    const result = getAppTemplate();
    ok(result.includes('import cors from "cors"'));
  });

  test("includes morgan import", () => {
    const result = getAppTemplate();
    ok(result.includes('import morgan from "morgan"'));
  });

  test("exports app as default", () => {
    const result = getAppTemplate();
    ok(result.includes("export default app"));
  });

  test("configures cors, morgan and json middlewares", () => {
    const result = getAppTemplate();
    ok(result.includes("app.use(cors())"));
    ok(result.includes('app.use(morgan("dev"))'));
    ok(result.includes("app.use(express.json())"));
  });
});

describe("getIndexTemplate", () => {
  test("TypeScript template returns a string", () => {
    ok(typeof getIndexTemplate("TypeScript") === "string");
  });

  test("TypeScript template imports app without .js extension", () => {
    const result = getIndexTemplate("TypeScript");
    ok(result.includes('./app"'));
    ok(!result.includes('./app.js"'));
  });

  test("TypeScript template imports database without .js extension", () => {
    const result = getIndexTemplate("TypeScript");
    ok(result.includes('"../database"'));
    ok(!result.includes('"../database.js"'));
  });

  test("JavaScript template imports app with .js extension", () => {
    const result = getIndexTemplate("JavaScript");
    ok(result.includes('./app.js"'));
  });

  test("JavaScript template imports database with .js extension", () => {
    const result = getIndexTemplate("JavaScript");
    ok(result.includes('"../database.js"'));
  });

  test("both templates listen on port 3000", () => {
    ok(getIndexTemplate("TypeScript").includes("3000"));
    ok(getIndexTemplate("JavaScript").includes("3000"));
  });

  test("both templates call connectToDatabase", () => {
    ok(getIndexTemplate("TypeScript").includes("connectToDatabase()"));
    ok(getIndexTemplate("JavaScript").includes("connectToDatabase()"));
  });

  test("both templates call app.listen", () => {
    ok(getIndexTemplate("TypeScript").includes("app.listen"));
    ok(getIndexTemplate("JavaScript").includes("app.listen"));
  });
});

describe("getMongoDBTemplate", () => {
  test("returns a string for TypeScript", async () => {
    const result = await getMongoDBTemplate("TypeScript");
    ok(typeof result === "string");
    ok(result.length > 0);
  });

  test("TypeScript template includes Promise<void> return type", async () => {
    const result = await getMongoDBTemplate("TypeScript");
    ok(result.includes("Promise<void>"));
  });

  test("TypeScript template includes mongoose import", async () => {
    const result = await getMongoDBTemplate("TypeScript");
    ok(result.includes("mongoose"));
  });

  test("TypeScript template uses type assertion for env variables", async () => {
    const result = await getMongoDBTemplate("TypeScript");
    ok(result.includes("as string"));
  });

  test("JavaScript template does not include Promise<void>", async () => {
    const result = await getMongoDBTemplate("JavaScript");
    ok(!result.includes("Promise<void>"));
  });

  test("JavaScript template includes mongoose import", async () => {
    const result = await getMongoDBTemplate("JavaScript");
    ok(result.includes("mongoose"));
  });

  test("both templates export connectToDatabase function", async () => {
    ok((await getMongoDBTemplate("TypeScript")).includes("connectToDatabase"));
    ok((await getMongoDBTemplate("JavaScript")).includes("connectToDatabase"));
  });
});

describe("getSQLTemplate", () => {
  test("returns a string for TypeScript", async () => {
    const result = await getSQLTemplate("TypeScript");
    ok(typeof result === "string");
    ok(result.length > 0);
  });

  test("TypeScript template includes Promise<void> return type", async () => {
    const result = await getSQLTemplate("TypeScript");
    ok(result.includes("Promise<void>"));
  });

  test("TypeScript template includes Sequelize import", async () => {
    const result = await getSQLTemplate("TypeScript");
    ok(result.includes("Sequelize"));
  });

  test("TypeScript template uses type assertion for URI env variable", async () => {
    const result = await getSQLTemplate("TypeScript");
    ok(result.includes("as string"));
  });

  test("JavaScript template does not include Promise<void>", async () => {
    const result = await getSQLTemplate("JavaScript");
    ok(!result.includes("Promise<void>"));
  });

  test("JavaScript template includes Sequelize import", async () => {
    const result = await getSQLTemplate("JavaScript");
    ok(result.includes("Sequelize"));
  });

  test("both templates export connectToDatabase function", async () => {
    ok((await getSQLTemplate("TypeScript")).includes("connectToDatabase"));
    ok((await getSQLTemplate("JavaScript")).includes("connectToDatabase"));
  });

  test("both templates call sequelize.authenticate()", async () => {
    ok(
      (await getSQLTemplate("TypeScript")).includes("sequelize.authenticate()"),
    );
    ok(
      (await getSQLTemplate("JavaScript")).includes("sequelize.authenticate()"),
    );
  });
});
