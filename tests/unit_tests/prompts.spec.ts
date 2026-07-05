import inquirer from "inquirer";

import { promptUser } from "../../cli/prompts";

jest.mock("inquirer", () => ({
  __esModule: true,
  default: {
    prompt: jest.fn(),
  },
}));

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

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

const promptMock = inquirer.prompt;

describe("promptUser", () => {
  it("asks for the expected project configuration", async () => {
    // @ts-expect-error partial mock
    (promptMock as jest.Mock).mockResolvedValue({
      projectName: "api-demo",
      language: "TypeScript",
      database: "MongoDB",
      testing: "Yes",
    });

    const result = await promptUser();

    expect(promptMock).toHaveBeenCalledTimes(1);

    // @ts-expect-error partial mock
    const questions = (promptMock as jest.Mock).mock.calls[0][0];

    expect(questions).toHaveLength(4);
    expect(questions[0]).toMatchObject({
      type: "input",
      name: "projectName",
      message: "Enter the name of your project:",
    });
    expect(questions[1]).toMatchObject({
      type: "list",
      name: "language",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript",
    });
    expect(questions[2]).toMatchObject({
      type: "list",
      name: "database",
      choices: ["MongoDB", "PostgreSQL", "MySQL"],
      default: "MongoDB",
    });
    expect(questions[3]).toMatchObject({
      type: "list",
      name: "testing",
      choices: ["Yes", "No"],
      default: "Yes",
    });

    expect(result).toEqual({
      projectName: "api-demo",
      language: "TypeScript",
      database: "MongoDB",
      testing: "Yes",
    });
  });

  it("wires project name validation through validateProjectName", async () => {
    // @ts-expect-error partial mock
    (promptMock as jest.Mock).mockImplementation(async (questions) => {
      const validate = questions[0].validate as (
        value: string,
      ) => boolean | string;

      expect(validate("ok-name")).toBe(true);
      expect(validate("@")).toBe(
        "Project name must be between 3 and 50 characters long.",
      );

      return {
        projectName: "ok-name",
        language: "JavaScript",
        database: "PostgreSQL",
        testing: "No",
      };
    });

    const result = await promptUser();

    expect(result.projectName).toBe("ok-name");
  });
});
