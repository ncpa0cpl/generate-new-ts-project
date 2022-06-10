import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { ConfFileNames } from "./constants/conf-file-names";

export const updatePackageFile = async (
  projectName: string,
  dir: string,
  authorName?: string
) => {
  console.log(chalk.greenBright("Generating: "), "package file");

  const packageFile = path.resolve(dir, ConfFileNames.PACKAGE);

  const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

  const packageSettings: Record<string, any> = JSON.parse(fileData);

  packageSettings["name"] = projectName;
  packageSettings["version"] = "1.0.0";
  packageSettings["main"] = "./dist/index.js";
  packageSettings["scripts"] = {
    "fix:lint": "eslint --fix .",
    "fix:prettier": "prettier -w ./src .",
    "test:jest": "jest --coverage",
    "test:lint": "eslint .",
    "test:prettier": "prettier -c ./src && prettier -c ./__tests__",
    "test:tsc": "tsc --noEmit",
    build: "tsc",
  };
  packageSettings["keywords"] = [];
  packageSettings["repository"] = {
    url: "",
  };
  packageSettings["description"] = "";
  packageSettings["license"] = "MIT";
  packageSettings["author"] = {
    name: authorName ?? "",
    email: "",
  };

  return await fs.writeFile(
    packageFile,
    JSON.stringify(packageSettings, null, 2)
  );
};
