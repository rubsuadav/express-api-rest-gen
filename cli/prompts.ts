import inquirer from "inquirer";

import { validateProjectName } from "../utils/utils.ts";

export async function promptUser(): Promise<{
  projectName: string;
  language: string;
  database: string;
  testing: string;
}> {
  return await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter the name of your project:",
      validate: (input: string) =>
        validateProjectName(input) === true || validateProjectName(input),
    },
    {
      type: "list",
      name: "language",
      message: "Do you want to use TypeScript or JavaScript?",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript",
    },
    {
      type: "list",
      name: "database",
      message: "What database do you want to use?",
      choices: ["MongoDB", "PostgreSQL", "MySQL"],
      default: "MongoDB",
    },
    {
      type: "list",
      name: "testing",
      message: "Do you want to configure backend tests?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ]);
}
