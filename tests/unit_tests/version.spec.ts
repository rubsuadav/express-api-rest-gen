import inquirer from "inquirer";
import { execSync } from "child_process";

import { handleVersionFlag } from "../../cli/version";

jest.mock("chalk", () => ({
  blue: jest.fn((text) => text),
  green: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
}));

jest.mock("inquirer", () => ({
  __esModule: true,
  default: {
    prompt: jest.fn(),
  },
}));

jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("handleVersionFlag", () => {
  it("prints the current version and exits when --version is passed", async () => {
    const originalArgv = process.argv;
    process.argv = ["node", "cli", "--version"];

    (execSync as jest.Mock)
      .mockReturnValueOnce("express-api-rest-gen@1.2.3\n")
      .mockReturnValueOnce("1.2.3\n");

    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await handleVersionFlag();

      expect(logSpy).toHaveBeenCalledWith("Current version: 1.2.3");
      expect(exitSpy).toHaveBeenCalledWith(0);
    } finally {
      process.argv = originalArgv;
    }
  });

  it("offers to update when a newer version exists and updates on confirm", async () => {
    const originalArgv = process.argv;
    process.argv = ["node", "cli"];

    (execSync as jest.Mock)
      .mockReturnValueOnce("express-api-rest-gen@1.2.3\n")
      .mockReturnValueOnce("1.3.0\n");
    // @ts-expect-error partial mock for inquirer.prompt
    (inquirer.prompt as jest.Mock).mockResolvedValue({
      shouldUpdate: true,
    });

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      await handleVersionFlag();

      expect(logSpy).toHaveBeenCalledWith(
        "A new version (1.3.0) is available!",
      );
      expect(execSync).toHaveBeenCalledWith(
        "npmd i -g express-api-rest-gen@latest",
      );
      expect(logSpy).toHaveBeenCalledWith("Updating to version 1.3.0...");
      expect(logSpy).toHaveBeenCalledWith("Successfully updated to 1.3.0!");
    } finally {
      process.argv = originalArgv;
    }
  });

  it("exits without updating when the user declines the update", async () => {
    const originalArgv = process.argv;
    process.argv = ["node", "cli"];

    (execSync as jest.Mock)
      .mockReturnValueOnce("express-api-rest-gen@1.2.3\n")
      .mockReturnValueOnce("1.3.0\n");
    // @ts-expect-error partial mock for inquirer.prompt
    (inquirer.prompt as jest.Mock).mockResolvedValue({ shouldUpdate: false });

    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never;
    });

    try {
      await handleVersionFlag();

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(execSync).not.toHaveBeenCalledWith(
        "npm i -g express-api-rest-gen@latest",
      );
    } finally {
      process.argv = originalArgv;
    }
  });
});
