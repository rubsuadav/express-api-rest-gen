import { describe, test } from "node:test";
import { strictEqual, ok } from "node:assert";

// local imports
import { validateProjectName } from "../../utils/validation.ts";

describe("validateProjectName", () => {
  test("returns error message for empty string", () => {
    const result = validateProjectName("");
    strictEqual(result, "Project name cannot be empty.");
  });

  test("returns error message for whitespace-only string", () => {
    const result = validateProjectName("   ");
    strictEqual(result, "Project name cannot be empty.");
  });

  test("returns error for name with exactly 2 characters (below minimum)", () => {
    const result = validateProjectName("ab");
    strictEqual(
      result,
      "Project name must be between 3 and 50 characters long.",
    );
  });

  test("returns error for name with 51 characters (above maximum)", () => {
    const result = validateProjectName("a".repeat(51));
    strictEqual(
      result,
      "Project name must be between 3 and 50 characters long.",
    );
  });

  test("returns error for name containing @ character", () => {
    const result = validateProjectName("my@project");
    ok(typeof result === "string");
    ok(result.includes("Invalid project name"));
  });

  test("returns error for name containing # character", () => {
    const result = validateProjectName("my#project");
    ok(typeof result === "string");
    ok(result.includes("Invalid project name"));
  });

  test("returns error for name containing $ character", () => {
    const result = validateProjectName("my$project");
    ok(typeof result === "string");
    ok(result.includes("Invalid project name"));
  });

  test("returns error for name containing spaces", () => {
    const result = validateProjectName("my project");
    ok(typeof result === "string");
    ok(result.includes("Invalid project name"));
  });

  test("returns true for a valid lowercase name", () => {
    strictEqual(validateProjectName("myproject"), true);
  });

  test("returns true for a valid name with hyphen", () => {
    strictEqual(validateProjectName("my-project"), true);
  });

  test("returns true for a valid name with underscore", () => {
    strictEqual(validateProjectName("my_project"), true);
  });

  test("returns true for a valid name with numbers", () => {
    strictEqual(validateProjectName("project123"), true);
  });

  test("returns true for a valid mixed-case name", () => {
    strictEqual(validateProjectName("MyProject"), true);
  });

  test("returns true for name at exactly minimum length (3 chars)", () => {
    strictEqual(validateProjectName("abc"), true);
  });

  test("returns true for name at exactly maximum length (50 chars)", () => {
    strictEqual(validateProjectName("a".repeat(50)), true);
  });

  test("returns true for complex valid name with hyphens and underscores", () => {
    strictEqual(validateProjectName("my-express_api-v2"), true);
  });
});
