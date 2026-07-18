import { describe, test } from "node:test";
import { strictEqual } from "node:assert";

import path from "path";
import os from "os";

// local imports
import { checkProjectExists } from "../../utils/filesystem.ts";

describe("checkProjectExists", () => {
  test("returns true when the project path already exists", () => {
    // process.cwd() is guaranteed to exist on any system
    const result = checkProjectExists(process.cwd(), "existing-project");
    strictEqual(result, true);
  });

  test("returns true for os.tmpdir() which always exists", () => {
    const result = checkProjectExists(os.tmpdir(), "temp-project");
    strictEqual(result, true);
  });

  test("returns false when the project path does not exist", () => {
    const randomName = `nonexistent-project-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const nonExistentPath = path.join(os.tmpdir(), randomName);
    const result = checkProjectExists(nonExistentPath, "new-project");
    strictEqual(result, false);
  });

  test("returns false for a deeply nested path that does not exist", () => {
    const nonExistentPath = path.join(
      os.tmpdir(),
      "a",
      "b",
      "c",
      `deep-${Date.now()}`,
    );
    const result = checkProjectExists(nonExistentPath, "deep-project");
    strictEqual(result, false);
  });
});
