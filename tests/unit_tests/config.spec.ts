import { FOLDERS, TEST_CONFIG } from "../../utils/constants";
import { updatePackageJson } from "../../utils/package-json";

describe("configuration values", () => {
  it("exposes the expected project folders", () => {
    expect(FOLDERS).toEqual([
      "src/models",
      "src/controllers",
      "src/utils",
      "src/middlewares",
      "src/routes",
      "src/validators",
      "src/tests",
    ]);
  });

  it("updates package scripts for TypeScript projects", () => {
    const pkg = updatePackageJson({ scripts: { test: "jest" } }, "TypeScript");

    expect(pkg.scripts.test).toBeUndefined();
    expect(pkg.scripts.build).toBe("npx tsc");
    expect(pkg.scripts.start).toBe("npm run build && node build/src/index.js");
    expect(pkg.scripts.dev).toBe(
      "set NODE_ENV=development && nodemon src/index.ts",
    );
  });

  it("exposes the JS testing command constant", () => {
    expect(TEST_CONFIG).toContain("jest");
  });
});
