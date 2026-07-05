import fs from "fs";
import { execSync } from "child_process";

import { connectDatabase } from "../../utils/database";

jest.mock("../../utils/utils", () => ({
  getMongoDBTemplate: jest.fn().mockResolvedValue("mongo-template"),
  getSQLTemplate: jest.fn().mockResolvedValue("sql-template"),
}));

jest.mock("chalk", () => ({
  red: jest.fn().mockImplementation((text) => text),
  green: jest.fn().mockImplementation((text) => text),
  blue: jest.fn().mockImplementation((text) => text),
  yellow: jest.fn().mockImplementation((text) => text),
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

describe("connectDatabase", () => {
  it("creates MongoDB env and template files", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await connectDatabase("/project", "MongoDB", "TypeScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".env"),
      "MONGODB_URI=mongodb://127.0.0.1:27017/\nDB_NAME=yourDBNAME",
    );
    expect(execSync).toHaveBeenCalledWith("npm i mongoose", {
      cwd: "/project",
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("database.ts"),
      "mongo-template",
    );
  });

  it("creates PostgreSQL env and template files", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await connectDatabase("/project", "PostgreSQL", "JavaScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".env"),
      "URI=postgres://user:password@host:port/yourDBNAME",
    );
    expect(execSync).toHaveBeenCalledWith("npm i pg pg-hstore sequelize", {
      cwd: "/project",
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("database.js"),
      "sql-template",
    );
  });

  it("creates MySQL env and template files", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    await connectDatabase("/project", "MySQL", "JavaScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".env"),
      "URI=mysql://user:password@host:port/yourDBNAME",
    );
    expect(execSync).toHaveBeenCalledWith("npm i mysql2 sequelize", {
      cwd: "/project",
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("database.js"),
      "sql-template",
    );
  });

  it("still writes the database template when installing dependencies fails", async () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    (execSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error("install failed");
    });

    await connectDatabase("/project", "MongoDB", "JavaScript");

    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".env"),
      "MONGODB_URI=mongodb://127.0.0.1:27017/\nDB_NAME=yourDBNAME",
    );
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining("database.js"),
      "mongo-template",
    );
  });
});
