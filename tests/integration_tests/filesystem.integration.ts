import { describe, test, before, after } from "node:test";
import { strictEqual, ok, doesNotReject } from "node:assert";

import fs from "fs";
import path from "path";
import os from "os";

// local imports
import { createFolders, checkProjectExists } from "../../utils/filesystem.ts";
import { FOLDERS } from "../../utils/constants.ts";

describe("createFolders - creates all project src folders", () => {
  let tempDir: string;

  before(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "express-gen-folders-"));
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("all FOLDERS exist after createFolders resolves", async () => {
    await createFolders(tempDir, FOLDERS);
    for (const folder of FOLDERS) {
      const folderPath = path.join(tempDir, folder);
      ok(
        fs.existsSync(folderPath),
        `Expected folder to exist: ${folder}`
      );
    }
  });

  test("created entries are directories, not files", async () => {
    for (const folder of FOLDERS) {
      const folderPath = path.join(tempDir, folder);
      const stat = fs.statSync(folderPath);
      ok(stat.isDirectory(), `Expected a directory at: ${folder}`);
    }
  });
});

describe("createFolders - creates custom nested folder structure", () => {
  let tempDir: string;

  before(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "express-gen-nested-"));
  });

  after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("creates deeply nested folders recursively", async () => {
    const customFolders = ["level1/level2/level3", "another/deep/path"];
    await createFolders(tempDir, customFolders);
    ok(fs.existsSync(path.join(tempDir, "level1/level2/level3")));
    ok(fs.existsSync(path.join(tempDir, "another/deep/path")));
  });

  test("does not throw when called with an empty folder list", async () => {
    await doesNotReject(() => createFolders(tempDir, []));
  });
});

describe("checkProjectExists - real filesystem checks", () => {
  let existingDir: string;

  before(() => {
    existingDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-gen-exists-")
    );
  });

  after(() => {
    fs.rmSync(existingDir, { recursive: true, force: true });
  });

  test("returns true for a directory that was just created", () => {
    const result = checkProjectExists(existingDir, "my-project");
    strictEqual(result, true);
  });

  test("returns false for a path that has never been created", () => {
    const ghostPath = path.join(
      os.tmpdir(),
      `ghost-project-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );
    const result = checkProjectExists(ghostPath, "ghost-project");
    strictEqual(result, false);
  });

  test("returns true after the directory is created and false after it is removed", () => {
    const dynamicDir = path.join(
      os.tmpdir(),
      `dynamic-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    // Does not exist yet
    strictEqual(checkProjectExists(dynamicDir, "dynamic-project"), false);

    // Create it
    fs.mkdirSync(dynamicDir, { recursive: true });
    strictEqual(checkProjectExists(dynamicDir, "dynamic-project"), true);

    // Clean up
    fs.rmdirSync(dynamicDir);
  });
});
