import fs from "fs/promises";
import path from "path";
import { html, Output } from "termx-markup";
import { ConfFileNames } from "./constants/conf-file-names";

export const updatePackageFile = async (
  projectName: string,
  dir: string,
  authorName?: string
) => {
  Output.print(html`
    <span color="lightGreen">Generating:</span>
    <pre> package.json file</pre>
  `);

  const packageFile = path.resolve(dir, ConfFileNames.PACKAGE);

  const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

  const prePackageSettings: Record<string, any> = JSON.parse(fileData);

  const packageSettings = {
    name: projectName,
    version: "1.0.0",
    main: "./dist/index.js",
    keywords: [],
    repository: {
      type: "git",
      url: "",
    },
    description: "",
    license: "MIT",
    author: { name: authorName ?? "", email: "" },
    scripts: {
      "fix:lint": "eslint --fix ./src/**/*.{ts}",
      "fix:format": "prettier -w ./src/**/*.{ts}",
      "test:unit": "jest --coverage",
      "test:lint": "eslint ./src/**/*.{ts}",
      "test:format": "prettier -c ./src/**/*.{ts}",
      "test:tsc": "tsc --noEmit",
      build: "tsc",
    },
    dependencies: {},
    devDependencies: {},
  };

  for (const [k, v] of Object.entries(prePackageSettings)) {
    if (!(k in packageSettings)) {
      Object.assign(packageSettings, { [k]: v });
    }
  }

  return await fs.writeFile(
    packageFile,
    JSON.stringify(packageSettings, null, 2)
  );
};
