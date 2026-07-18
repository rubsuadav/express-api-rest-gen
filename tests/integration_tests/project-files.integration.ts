import { describe, test, before, after } from "node:test";
import { strictEqual, ok, doesNotThrow, throws } from "node:assert";

import fs from "fs";
import path from "path";
import os from "os";

// local imports
import {
  createSourceFiles,
  updatePackage,
  getAvailableCommands,
} from "../../cli/project-files.ts";

// ---------------------------------------------------------------------------
// createSourceFiles – TypeScript
// ---------------------------------------------------------------------------

describe("createSourceFiles TypeScript - writes app.ts and index.ts", () => {
  let tempDir: string;

  before(async () => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-src-ts-")
    );
    fs.mkdirSync(path.join(tempDir, "src"), { recursive: true });
    await createSourceFiles(tempDir, "TypeScript");
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("src/app.ts file is created", () => {
    ok(fs.existsSync(path.join(tempDir, "src", "app.ts")));
  });

  test("src/index.ts file is created", () => {
    ok(fs.existsSync(path.join(tempDir, "src", "index.ts")));
  });

  test("app.ts contains express import", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "app.ts"),
      "utf-8"
    );
    ok(content.includes("express"));
  });

  test("app.ts exports default app", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "app.ts"),
      "utf-8"
    );
    ok(content.includes("export default app"));
  });

  test("index.ts imports app without .js extension", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "index.ts"),
      "utf-8"
    );
    ok(content.includes('./app"'));
    ok(!content.includes('./app.js"'));
  });

  test("index.ts imports database without .js extension", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "index.ts"),
      "utf-8"
    );
    ok(content.includes('"../database"'));
    ok(!content.includes('"../database.js"'));
  });

  test("index.ts references port 3000", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "index.ts"),
      "utf-8"
    );
    ok(content.includes("3000"));
  });
});

// ---------------------------------------------------------------------------
// createSourceFiles – JavaScript
// ---------------------------------------------------------------------------

describe("createSourceFiles JavaScript - writes app.js and index.js", () => {
  let tempDir: string;

  before(async () => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-src-js-")
    );
    fs.mkdirSync(path.join(tempDir, "src"), { recursive: true });
    await createSourceFiles(tempDir, "JavaScript");
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("src/app.js file is created", () => {
    ok(fs.existsSync(path.join(tempDir, "src", "app.js")));
  });

  test("src/index.js file is created", () => {
    ok(fs.existsSync(path.join(tempDir, "src", "index.js")));
  });

  test("index.js imports app with .js extension", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "index.js"),
      "utf-8"
    );
    ok(content.includes('./app.js"'));
  });

  test("index.js imports database with .js extension", () => {
    const content = fs.readFileSync(
      path.join(tempDir, "src", "index.js"),
      "utf-8"
    );
    ok(content.includes('"../database.js"'));
  });
});

// ---------------------------------------------------------------------------
// updatePackage – TypeScript
// ---------------------------------------------------------------------------

describe("updatePackage TypeScript - updates package.json scripts", () => {
  let tempDir: string;

  before(async () => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-pkg-ts-")
    );
    const initialPkg = {
      name: "test-api",
      version: "1.0.0",
      scripts: { test: "jest" },
    };
    fs.writeFileSync(
      path.join(tempDir, "package.json"),
      JSON.stringify(initialPkg, null, 2)
    );
    await updatePackage(tempDir, "TypeScript");
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("package.json contains build script", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.scripts.build, "npx tsc");
  });

  test("package.json start script runs through build", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    ok(pkg.scripts.start.includes("npm run build"));
  });

  test("package.json dev script uses nodemon", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    ok(pkg.scripts.dev.includes("nodemon"));
  });

  test("package.json removes the original test script", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.scripts.test, undefined);
  });

  test("package.json preserves the project name", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.name, "test-api");
  });
});

// ---------------------------------------------------------------------------
// updatePackage – JavaScript
// ---------------------------------------------------------------------------

describe("updatePackage JavaScript - updates package.json scripts", () => {
  let tempDir: string;

  before(async () => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-pkg-js-")
    );
    const initialPkg = {
      name: "test-api-js",
      version: "1.0.0",
      scripts: { test: "jest" },
    };
    fs.writeFileSync(
      path.join(tempDir, "package.json"),
      JSON.stringify(initialPkg, null, 2)
    );
    await updatePackage(tempDir, "JavaScript");
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("package.json start script points to node src/index.js", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.scripts.start, "node src/index.js");
  });

  test("package.json dev script uses nodemon", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    ok(pkg.scripts.dev.includes("nodemon"));
  });

  test("package.json type is set to module", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.type, "module");
  });

  test("package.json removes the original test script", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(tempDir, "package.json"), "utf-8")
    );
    strictEqual(pkg.scripts.test, undefined);
  });
});

// ---------------------------------------------------------------------------
// getAvailableCommands
// ---------------------------------------------------------------------------

describe("getAvailableCommands - reads and prints scripts from package.json", () => {
  let tempDir: string;

  before(() => {
    tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-cmds-")
    );
    const pkg = {
      name: "test-api",
      version: "1.0.0",
      scripts: {
        start: "node src/index.js",
        dev: "nodemon src/index.js",
        build: "npx tsc",
      },
    };
    fs.writeFileSync(
      path.join(tempDir, "package.json"),
      JSON.stringify(pkg, null, 2)
    );
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("does not throw when package.json has scripts", () => {
    doesNotThrow(() => getAvailableCommands(tempDir));
  });

  test("throws when the directory does not contain a package.json", () => {
    const emptyDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-no-pkg-")
    );
    try {
      throws(() => getAvailableCommands(emptyDir));
    } finally {
      fs.rmSync(emptyDir, { recursive: true, force: true });
    }
  });
});
