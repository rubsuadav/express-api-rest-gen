import fs from "fs";
import os from "os";
import path from "path";

import { execSync } from "child_process";

import { generateProject } from "../../cli/project";
import { promptUser } from "../../cli/prompts";
import { checkProjectExists } from "../../utils/utils";

jest.mock("../../cli/prompts", () => ({
  promptUser: jest.fn(),
}));

jest.mock("../../utils/utils", () => {
  const actual = jest.requireActual("../../utils/utils");

  return {
    ...actual,
    checkProjectExists: jest.fn(),
  };
});

jest.mock("chalk", () => ({
  red: jest.fn((text) => text),
  green: jest.fn((text) => text),
  blue: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
}));

jest.mock("ora", () => {
  const spinner = {
    start: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
    stop: jest.fn(),
  };

  spinner.start.mockReturnValue(spinner);
  spinner.succeed.mockReturnValue(spinner);
  spinner.fail.mockReturnValue(spinner);

  return {
    __esModule: true,
    default: jest.fn().mockReturnValue(spinner),
  };
});

jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

function mockImmediateTimers(): void {
  jest.spyOn(global, "setTimeout").mockImplementation(((
    callback: TimerHandler,
  ) => {
    if (typeof callback === "function") callback();
    return 0 as unknown as NodeJS.Timeout;
  }) as unknown as typeof setTimeout);
}

describe("generateProject integration flow", () => {
  it("builds a TypeScript project end to end in a temporary workspace", async () => {
    const workspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-api-rest-gen-"),
    );
    const projectName = "api-ts";
    const projectPath = path.join(workspaceRoot, projectName);

    fs.mkdirSync(projectPath);
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      JSON.stringify({ scripts: {} }, null, 2),
    );
    fs.writeFileSync(
      path.join(projectPath, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            types: ["node"],
          },
        },
        null,
        2,
      ),
    );

    (promptUser as jest.Mock).mockResolvedValue({
      projectName,
      language: "TypeScript",
      database: "MongoDB",
      testing: "Yes",
    });
    (checkProjectExists as jest.Mock).mockReturnValue(false);
    (execSync as jest.Mock).mockImplementation(() => undefined);
    mockImmediateTimers();

    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(workspaceRoot);
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await generateProject();

      const pkg = JSON.parse(
        fs.readFileSync(path.join(projectPath, "package.json"), "utf8"),
      );
      const tsconfig = JSON.parse(
        fs.readFileSync(path.join(projectPath, "tsconfig.json"), "utf8"),
      );

      expect(fs.existsSync(path.join(projectPath, "src", "app.ts"))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, "src", "index.ts"))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(projectPath, ".env"))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, "database.ts"))).toBe(true);
      expect(pkg.scripts.test).toBe("jest");
      expect(pkg.scripts["test:coverage"]).toBe("jest --coverage");
      expect(tsconfig.compilerOptions.types).toContain("jest");
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "API api-ts created with Express and (TypeScript) successfully",
        ),
      );
    } finally {
      cwdSpy.mockRestore();
    }
  });

  it("builds a JavaScript project without test setup", async () => {
    const workspaceRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "express-api-rest-gen-"),
    );
    const projectName = "api-js";
    const projectPath = path.join(workspaceRoot, projectName);

    fs.mkdirSync(projectPath);
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      JSON.stringify({ scripts: { test: "jest" } }, null, 2),
    );

    (promptUser as jest.Mock).mockResolvedValue({
      projectName,
      language: "JavaScript",
      database: "MySQL",
      testing: "No",
    });
    (checkProjectExists as jest.Mock).mockReturnValue(false);
    (execSync as jest.Mock).mockImplementation(() => undefined);
    mockImmediateTimers();

    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(workspaceRoot);

    try {
      await generateProject();

      const pkg = JSON.parse(
        fs.readFileSync(path.join(projectPath, "package.json"), "utf8"),
      );

      expect(fs.existsSync(path.join(projectPath, "src", "app.js"))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, "src", "index.js"))).toBe(
        true,
      );
      expect(fs.existsSync(path.join(projectPath, ".env"))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, "database.js"))).toBe(true);
      expect(pkg.type).toBe("module");
      expect(pkg.scripts.test).toBeUndefined();
      expect(pkg.scripts.start).toBe("node src/index.js");
    } finally {
      cwdSpy.mockRestore();
    }
  });
});
