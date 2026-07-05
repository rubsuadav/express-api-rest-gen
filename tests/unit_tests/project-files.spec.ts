import fs from "fs";
import { execSync } from "child_process";

import {
  createSourceFiles,
  getAvailableCommands,
  installDependenciesAndConfigureTSConfig,
  updatePackage,
} from "../../cli/project-files";

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

jest.mock("../../utils/utils", () => ({
  ...jest.requireActual("../../utils/utils"),
  getAppTemplate: jest.fn(() => "app-template"),
  getIndexTemplate: jest.fn(() => "index-template"),
}));

jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("installDependenciesAndConfigureTSConfig", () => {
  it("installs base dependencies and configures TypeScript", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation(((
      callback: TimerHandler,
    ) => {
      if (typeof callback === "function") callback();
      return 0 as unknown as NodeJS.Timeout;
    }) as unknown as typeof setTimeout);

    await installDependenciesAndConfigureTSConfig("/project", "TypeScript");

    expect(execSync).toHaveBeenCalledWith(
      "npm init -y",
      expect.objectContaining({ cwd: "/project" }),
    );
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("npm install express cors dotenv"),
      expect.objectContaining({ cwd: "/project" }),
    );
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("npm install --save-dev morgan nodemon"),
      expect.objectContaining({ cwd: "/project" }),
    );
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("npm install --save-dev typescript ts-node"),
      expect.objectContaining({ cwd: "/project" }),
    );
    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining("npx tsc --init"),
      expect.objectContaining({ cwd: "/project" }),
    );

    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  it("installs only the base dependencies for JavaScript", async () => {
    await installDependenciesAndConfigureTSConfig("/project", "JavaScript");

    expect(execSync).toHaveBeenCalledTimes(3);
    expect(execSync).not.toHaveBeenCalledWith(
      expect.stringContaining("typescript ts-node"),
      expect.any(Object),
    );
  });
});

describe("createSourceFiles", () => {
  it("creates TypeScript source files", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await createSourceFiles("/project", "TypeScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("src\\app.ts"),
      "app-template",
    );
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("src\\index.ts"),
      "index-template",
    );
  });

  it("creates JavaScript source files", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await createSourceFiles("/project", "JavaScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("src\\app.js"),
      "app-template",
    );
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("src\\index.js"),
      "index-template",
    );
  });
});

describe("updatePackage", () => {
  it("rewrites package scripts for TypeScript", async () => {
    const readFileSyncMock = jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(JSON.stringify({ scripts: { test: "jest" } }));
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await updatePackage("/project", "TypeScript");

    expect(readFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("package.json"),
      "utf8",
    );
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("package.json"),
      expect.stringContaining('"build": "npx tsc"'),
    );
  });

  it("rewrites package scripts for JavaScript and sets module type", async () => {
    const readFileSyncMock = jest
      .spyOn(fs, "readFileSync")
      .mockReturnValue(JSON.stringify({ scripts: { test: "jest" } }));
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await updatePackage("/project", "JavaScript");

    expect(readFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("package.json"),
      "utf8",
    );
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("package.json"),
      expect.stringContaining('"type": "module"'),
    );
  });
});

describe("getAvailableCommands", () => {
  it("prints the available scripts from package.json", () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        scripts: {
          dev: "tsx bin/index.ts",
          test: "jest",
        },
      }),
    );

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    getAvailableCommands("/project");

    expect(logSpy).toHaveBeenCalledWith("Available commands:");
    expect(logSpy).toHaveBeenCalledWith("- npm run dev: tsx bin/index.ts");
    expect(logSpy).toHaveBeenCalledWith("- npm run test: jest");
  });
});
