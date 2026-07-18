import { describe, test } from "node:test";
import { strictEqual, ok } from "node:assert";

// local imports
import { updatePackageJson } from "../../utils/package-json.ts";

describe("updatePackageJson - TypeScript", () => {
  test("adds build script pointing to npx tsc", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "TypeScript");
    strictEqual(result.scripts.build, "npx tsc");
  });

  test("adds start script that runs the built output", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "TypeScript");
    ok(result.scripts.start.includes("npm run build"));
    ok(result.scripts.start.includes("node build/src/index.js"));
  });

  test("adds dev script using nodemon", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "TypeScript");
    ok(result.scripts.dev.includes("nodemon"));
    ok(result.scripts.dev.includes("src/index.ts"));
  });

  test("does not set type to module for TypeScript", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "TypeScript");
    strictEqual(result.type, undefined);
  });

  test("removes the existing test script", () => {
    const pkg = { scripts: { test: "jest --coverage" } };
    const result = updatePackageJson(pkg, "TypeScript");
    strictEqual(result.scripts.test, undefined);
  });

  test("preserves other existing scripts", () => {
    const pkg = { scripts: { lint: "eslint .", format: "prettier --write ." } };
    const result = updatePackageJson(pkg, "TypeScript");
    strictEqual(result.scripts.lint, "eslint .");
    strictEqual(result.scripts.format, "prettier --write .");
  });

  test("returns the modified pkg object", () => {
    const pkg = { name: "my-api", version: "1.0.0", scripts: {} };
    const result = updatePackageJson(pkg, "TypeScript");
    strictEqual(result.name, "my-api");
    strictEqual(result.version, "1.0.0");
  });
});

describe("updatePackageJson - JavaScript", () => {
  test("adds start script pointing to node src/index.js", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "JavaScript");
    strictEqual(result.scripts.start, "node src/index.js");
  });

  test("adds dev script using nodemon", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "JavaScript");
    ok(result.scripts.dev.includes("nodemon"));
    ok(result.scripts.dev.includes("src/index.js"));
  });

  test("sets type to module", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "JavaScript");
    strictEqual(result.type, "module");
  });

  test("does not add a build script", () => {
    const pkg = { scripts: {} };
    const result = updatePackageJson(pkg, "JavaScript");
    strictEqual(result.scripts.build, undefined);
  });

  test("removes the existing test script", () => {
    const pkg = { scripts: { test: "jest" } };
    const result = updatePackageJson(pkg, "JavaScript");
    strictEqual(result.scripts.test, undefined);
  });

  test("preserves other existing scripts", () => {
    const pkg = { scripts: { lint: "eslint ." } };
    const result = updatePackageJson(pkg, "JavaScript");
    strictEqual(result.scripts.lint, "eslint .");
  });
});
