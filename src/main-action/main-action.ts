import chalk from "chalk";
import type { Argument } from "clify.js";
import fs from "fs/promises";
import path from "path";
import { getPackageManager } from "../bindings/get-package-manager";
import { Git } from "../bindings/git";
import { configureGitHookTasks } from "./configre-git-hook-tasks";
import { Dependency, DEV_DEPS } from "./constants/dev-dependencies";
import { createConfigFiles } from "./create-config-files";
import { updatePackageFile } from "./update-package-file";

export type MainActionParams = {
  projectName: Argument<"string", true>;
  authorName: Argument<"string", false>;
  packageManager: Argument<"string", true>;
  cwd: Argument<"string", false>;
  yarnVersion: Argument<"string", false>;
};

export const mainAction = async (params: MainActionParams) => {
  const { projectName, authorName, cwd, packageManager } = params;

  const rootDir = cwd.value ?? process.cwd();

  const projectDir = path.resolve(rootDir, projectName.value);

  const srcDir = path.resolve(projectDir, "src");
  const distDir = path.resolve(projectDir, "dist");
  const vscodeDir = path.resolve(projectDir, ".vscode");
  const testsDir = path.resolve(projectDir, "__tests__");
  const mocksDir = path.resolve(projectDir, "__mocks__");

  const indexFile = path.resolve(srcDir, "index.ts");

  const cwdFiles = await fs.readdir(rootDir);

  if (cwdFiles.includes(projectName.value)) {
    console.error(
      `Directory with the name "${projectName.value}" already exists.`
    );
    process.exit(-1);
  }

  await fs.mkdir(projectDir);

  const PM = getPackageManager(packageManager.value);

  PM.setCwd(projectDir);

  if (params.yarnVersion.isSet)
    await PM.changeVersion(params.yarnVersion.value!);

  await PM.init();

  console.log(
    chalk.greenBright("Generating: "),
    chalk.yellowBright(projectName.value),
    " project files"
  );

  await Promise.all([
    fs.mkdir(srcDir),
    fs.mkdir(distDir),
    fs.mkdir(vscodeDir),
    fs.mkdir(testsDir),
    fs.mkdir(mocksDir),
    createConfigFiles(projectDir, PM, authorName.value),
  ]);

  await fs.writeFile(indexFile, "");

  Dependency.setPackageManagerType(PM.getName(), await PM.getVersion());

  for (const dependency of DEV_DEPS) {
    console.log(
      chalk.greenBright("Installing dependency: "),
      `${dependency.getFriendlyName()}`
    );
    await PM.installDev(dependency.getInstallName());
  }

  await Git.init(projectDir);

  await Promise.all([
    updatePackageFile(projectName.value, projectDir, params.authorName.value),
    configureGitHookTasks(PM),
  ]);

  await Git.add();
};
