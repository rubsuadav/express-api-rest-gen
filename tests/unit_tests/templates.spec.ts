import ora from "ora";

// local imports
import {
  getAppTemplate,
  getIndexTemplate,
  getMongoDBTemplate,
  getSQLTemplate,
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

describe("getTemplates methods in the CLI", () => {
  describe("getAppTemplate method", () => {
    it("should return the correct app template", () => {
      const expectedTemplate =
        `import express from "express";\n` +
        `import morgan from "morgan";\n` +
        `import cors from "cors";\n\n` +
        `const app = express();\n\n` +
        `app.use(cors());\n` +
        `app.use(morgan("dev"));\n` +
        `app.use(express.json());\n\n` +
        `//ADD YOUR ROUTES HERE\n\n` +
        `export default app;`;

      const result = getAppTemplate();

      expect(typeof result).toBe("string");
      expect(result).toEqual(expectedTemplate);
    });
  });

  describe("getIndexTemplate method", () => {
    it("should return the correct index template for TypeScript", () => {
      const expectedTemplate = `import app from "./app";\n\nimport { connectToDatabase } from "../database";\n\nconst PORT = 3000;\n\nconnectToDatabase();\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`;

      const result = getIndexTemplate("TypeScript");

      expect(typeof result).toBe("string");
      expect(result).toEqual(expectedTemplate);
    });

    it("should return the correct index template for JavaScript", () => {
      const expectedTemplate = `import app from "./app.js";\n\nimport { connectToDatabase } from "../database.js";\n\nconst PORT = 3000;\n\nconnectToDatabase();\n\napp.listen(PORT, () => {\n  console.log(\`Server is running on http://localhost:\${PORT}\`);\n});`;

      const result = getIndexTemplate("JavaScript");

      expect(typeof result).toBe("string");
      expect(result).toEqual(expectedTemplate);
    });
  });

  describe("getMongoDBTemplate method", () => {
    it("should return the correct MongoDB template for TypeScript", async () => {
      const expectedTemplate = `import mongoose from 'mongoose';
    import 'dotenv/config';

    export async function connectToDatabase(): Promise<void> {
      try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
          dbName: process.env.DB_NAME as string,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;

      const spinner = ora();

      const result = await getMongoDBTemplate("TypeScript");

      expect(spinner.start).toHaveBeenCalledTimes(1);

      expect(typeof result).toBe("string");
      expect(result.trim()).toEqual(expectedTemplate.trim());
    });

    it("should return the correct MongoDB template for JavaScript", async () => {
      const expectedTemplate = `
    import mongoose from 'mongoose';
    import 'dotenv/config';

    export async function connectToDatabase() {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          dbName: process.env.DB_NAME,
        });
        console.log('MongoDB connected');
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;

      const spinner = ora();

      const result = await getMongoDBTemplate("JavaScript");

      expect(spinner.start).toHaveBeenCalledTimes(1);

      expect(typeof result).toBe("string");
      expect(result.trim()).toEqual(expectedTemplate.trim());
    });
  });

  describe("getSQLTemplate method", () => {
    it("should return the correct SQL template for TypeScript", async () => {
      const expectedTemplate = `
    import { Sequelize } from 'sequelize';
    import 'dotenv/config';

    const sequelize = new Sequelize(process.env.URI as string);

    export async function connectToDatabase(): Promise<void> {
      try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;

      const spinner = ora();

      const result = await getSQLTemplate("TypeScript");

      expect(spinner.start).toHaveBeenCalledTimes(1);

      expect(typeof result).toBe("string");
      expect(result.trim()).toEqual(expectedTemplate.trim());
    });

    it("should return the correct SQL template for JavaScript", async () => {
      const expectedTemplate = `
    import { Sequelize } from 'sequelize';
    import 'dotenv/config';

    const sequelize = new Sequelize(process.env.URI);

    export async function connectToDatabase() {
      try {
        await sequelize.authenticate();
      } catch (error) {
        console.error('Cannot connect to the database');
      }
    }`;

      const spinner = ora();

      const result = await getSQLTemplate("JavaScript");

      expect(spinner.start).toHaveBeenCalledTimes(1);

      expect(typeof result).toBe("string");
      expect(result.trim()).toEqual(expectedTemplate.trim());
    });
  });
});
