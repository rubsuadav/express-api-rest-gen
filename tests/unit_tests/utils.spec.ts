import fs from "fs";
import ora from "ora";

// local imports
import {
  checkProjectExists,
  createFolders,
  validateProjectName,
} from "../../utils/utils";

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

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("validations methods in the CLI", () => {
  describe("validationProjectName method", () => {
    it("should return an error if projectName is not provided", () => {
      const projectName = "";
      const result = validateProjectName(projectName);
      expect(result).toEqual("Project name cannot be empty.");
    });

    it("should return an error if projectName contains special characters", () => {
      const projectName = "my-project@123";
      const result = validateProjectName(projectName);
      expect(result).toEqual(
        "Invalid project name. Project names can only contain letters, numbers, hyphens (-), and underscores (_). No special characters like @, #, $, etc. are allowed.",
      );
    });

    it("should return true if projectName is valid", () => {
      const projectName = "my-project";
      const result = validateProjectName(projectName);
      expect(result).toBe(true);
    });
  });
});

describe("projects methods in the CLI", () => {
  describe("checkProjectExists method", () => {
    it("should return true if the project already exists", () => {
      const projectPath = "./existing-project";
      const projectName = "existing-project";

      // Mock fs.existsSync to simulate that the project already exists
      const existsSyncMock = jest.spyOn(fs, "existsSync").mockReturnValue(true);

      const result = checkProjectExists(projectPath, projectName);

      expect(existsSyncMock).toHaveBeenCalled();
      expect(existsSyncMock).toHaveBeenCalledWith(projectPath);

      expect(result).toBe(true);
    });

    it("should return false if the project does not exist", () => {
      const projectPath = "./new-project";
      const projectName = "new-project";

      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      const result = checkProjectExists(projectPath, projectName);

      expect(result).toBe(false);
    });
  });

  describe("createFolders method", () => {
    it("should create folders successfully", async () => {
      const basePath = "./test-project";
      const folders = ["src", "tests", "config"];

      const spinner = ora();

      // Mock fs.mkdirSync to simulate folder creation
      const mkdirSyncMock = jest.spyOn(fs, "mkdirSync").mockImplementation();

      await expect(createFolders(basePath, folders)).resolves.toBeUndefined();

      expect(spinner.start).toHaveBeenCalledTimes(1);
      expect(mkdirSyncMock).toHaveBeenCalledTimes(folders.length);
      folders.forEach((folder) => {
        expect(mkdirSyncMock).toHaveBeenCalledWith(
          expect.stringContaining(folder),
          { recursive: true },
        );
      });

      expect(spinner.succeed).toHaveBeenCalledTimes(1);
      expect(spinner.succeed).toHaveBeenCalledWith(
        "Project structure created successfully",
      );
      expect(spinner.fail).not.toHaveBeenCalled();
      expect(spinner.stop).not.toHaveBeenCalled();
    });

    it("should handle errors during folder creation", async () => {
      const basePath = "./test-project";
      const folders = ["src", "tests", "config"];

      const spinner = ora();

      // Mock fs.mkdirSync to throw an error
      const mkdirSyncMock = jest
        .spyOn(fs, "mkdirSync")
        .mockImplementation(() => {
          throw new Error("Failed to create folder");
        });

      await expect(createFolders(basePath, folders)).resolves.toBeUndefined();

      expect(spinner.start).toHaveBeenCalledTimes(1);
      expect(mkdirSyncMock).toHaveBeenCalledTimes(1); // It should fail on the first folder

      expect(spinner.succeed).not.toHaveBeenCalled();
      expect(spinner.fail).toHaveBeenCalledTimes(1);
      expect(spinner.fail).toHaveBeenCalledWith(
        "Failed to create project structure",
      );
      expect(spinner.stop).toHaveBeenCalledTimes(1);
    });
  });
});
