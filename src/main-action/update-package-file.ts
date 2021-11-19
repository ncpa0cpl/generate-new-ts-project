import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

export const updatePackageFile = async (name: string, dir: string) => {
  console.log(chalk.greenBright("Generating: "), "package file");

  const packageFile = path.resolve(dir, "package.json");

  const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

  const packageSettings: Record<string, any> = JSON.parse(fileData);

  packageSettings["name"] = name;
  packageSettings["version"] = "1.0.0";
  packageSettings["main"] = "./dist/index.js";
  packageSettings["scripts"] = {
    build: "tsc",
    lint: "eslint .",
    tsc: "tsc --noEmit",
    test: "jest --coverage",
  };

  return await fs.writeFile(
    packageFile,
    JSON.stringify(packageSettings, null, 2)
  );
};
