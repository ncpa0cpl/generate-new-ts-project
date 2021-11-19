import chalk from "chalk";
import type { Argument } from "clify.js";
import fs from "fs/promises";
import path from "path";
import { getPackageManager } from "../bindings/get-package-manager";
import { Git } from "../bindings/git";
import { configureHusky } from "./configure-husky";
import { createConfigFiles } from "./create-config-files";
import { updatePackageFile } from "./update-package-file";

export type MainActionParams = {
  name: Argument<"string", true>;
  packageManager: Argument<"string", true>;
  cwd: Argument<"string", false>;
};

const deps = [
  "typescript",
  "eslint",
  "prettier",
  "eslint-config-prettier",
  "eslint-plugin-prettier",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "prettier-plugin-jsdoc",
  "jest",
  "ts-jest",
  "@types/jest",
  "husky",
];

export const mainAction = async (params: MainActionParams) => {
  const { name, cwd, packageManager } = params;

  const rootDir = cwd.value ?? process.cwd();

  const projectDir = path.resolve(rootDir, name.value);

  const srcDir = path.resolve(projectDir, "src");
  const distDir = path.resolve(projectDir, "dist");
  const vscodeDir = path.resolve(projectDir, ".vscode");
  const testsDir = path.resolve(projectDir, "__tests__");
  const mocksDir = path.resolve(projectDir, "__mocks__");

  const indexFile = path.resolve(srcDir, "index.ts");

  const PM = getPackageManager(packageManager.value);

  PM.setCwd(projectDir);

  const cwdFiles = await fs.readdir(rootDir);

  if (cwdFiles.includes(name.value)) {
    console.error(`Directory with the name "${name.value}" already exists.`);
    process.exit(-1);
  }

  console.log(chalk.greenBright("Generating: "), `${name.value} project files`);

  await fs.mkdir(projectDir);

  await Promise.all([
    fs.mkdir(srcDir),
    fs.mkdir(distDir),
    fs.mkdir(vscodeDir),
    fs.mkdir(testsDir),
    fs.mkdir(mocksDir),
    createConfigFiles(projectDir),
  ]);

  await fs.writeFile(indexFile, "");

  for (const dependency of deps) {
    console.log(chalk.greenBright("Installing dependency: "), `${dependency}`);
    await PM.install(dependency, true);
  }

  await Git.init(projectDir);

  await Promise.all([
    updatePackageFile(name.value, projectDir),
    configureHusky(PM, projectDir),
  ]);

  await Git.add();
};
