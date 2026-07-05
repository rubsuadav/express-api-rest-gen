import fs from "fs";
import path from "path";
import os from "os";

import { execSync } from "child_process";

import { configureTesting } from "../../utils/testing";

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

function createTempProject(): string {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), "express-api-rest-gen-"),
  );
  fs.writeFileSync(
    path.join(tempRoot, "package.json"),
    JSON.stringify({ scripts: {} }, null, 2),
  );
  return tempRoot;
}

describe("configureTesting", () => {
  it("adds Jest scripts for JavaScript projects", async () => {
    const projectPath = createTempProject();

    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation(((
      callback: TimerHandler,
    ) => {
      if (typeof callback === "function") callback();
      return 0 as unknown as NodeJS.Timeout;
    }) as unknown as typeof setTimeout);

    await configureTesting(projectPath, "JavaScript");

    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json"), "utf8"),
    );

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("npm i -D jest supertest"),
      expect.objectContaining({ cwd: projectPath }),
    );
    expect(pkg.scripts.test).toBe(
      "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    );
    expect(pkg.scripts["test:watch"]).toBe(
      "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
    );
    expect(pkg.scripts["test:coverage"]).toBe(
      "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage",
    );
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  it("updates tsconfig and Jest scripts for TypeScript projects", async () => {
    const projectPath = createTempProject();
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

    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation(((
      callback: TimerHandler,
    ) => {
      if (typeof callback === "function") callback();
      return 0 as unknown as NodeJS.Timeout;
    }) as unknown as typeof setTimeout);

    await configureTesting(projectPath, "TypeScript");

    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectPath, "package.json"), "utf8"),
    );
    const tsconfig = JSON.parse(
      fs.readFileSync(path.join(projectPath, "tsconfig.json"), "utf8"),
    );

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("ts-jest config:init"),
      expect.objectContaining({ cwd: projectPath }),
    );
    expect(pkg.scripts.test).toBe("jest");
    expect(pkg.scripts["test:watch"]).toBe("jest --watch");
    expect(pkg.scripts["test:coverage"]).toBe("jest --coverage");
    expect(tsconfig.compilerOptions.types).toContain("jest");
    expect(setTimeoutSpy).toHaveBeenCalled();
  });
});
