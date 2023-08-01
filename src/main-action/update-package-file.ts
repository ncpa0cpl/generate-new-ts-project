import fs from "fs/promises";
import path from "path";
import { html, Output } from "termx-markup";
import { PkgJsonFacade } from "../utils/pkg-json-facade";
import { ConfFileNames } from "./constants/conf-file-names";
import type { ModuleController } from "./module-controller";

export const updatePackageFile = async (
  cwd: string,
  moduleController: ModuleController
) => {
  Output.print(html`
    <span color="lightGreen">Generating:</span>
    <pre> package.json file</pre>
  `);
  const ctx = moduleController.getContext();

  const packageFile = path.resolve(cwd, ConfFileNames.PACKAGE);
  const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

  const prePackageSettings: Record<string, any> = JSON.parse(fileData);

  const packageSettings = new PkgJsonFacade({
    name: ctx.projectName,
    version: "1.0.0",
    main: "./dist/index.js",
    keywords: [],
    repository: {
      type: "git",
      url: "",
    },
    description: "",
    license: "MIT",
    author: { name: ctx.authorName ?? "", email: "" },
    scripts: {
      "fix:lint": "eslint --fix ./src/**/*.{ts}",
      "fix:format": "prettier -w ./src/**/*.{ts}",
      "test:lint": "eslint ./src/**/*.{ts}",
      "test:format": "prettier -c ./src/**/*.{ts}",
      "test:tsc": "tsc --noEmit",
    },
  });

  for (const [k, v] of Object.entries(prePackageSettings)) {
    packageSettings.addIfNotExists(k, v);
  }

  return await moduleController
    .applyPackageJsonMiddleware(packageSettings)
    .then((p) => fs.writeFile(packageFile, p.toJSON()));
};
