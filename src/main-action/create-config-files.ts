import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { ESLINT_IGNORE } from "../config-templates/eslint-ignore";
import { ESLINT_SETTINGS } from "../config-templates/eslint-settings";
import { getGitHookTasksConfig } from "../config-templates/git-hook-tasks-config";
import { GIT_IGNORE } from "../config-templates/git-ignore";
import { JEST_SETTINGS } from "../config-templates/jest-settings";
import { getLicense } from "../config-templates/license";
import { NPM_IGNORE } from "../config-templates/npm-ignore";
import { PRETTIER_SETTINGS } from "../config-templates/prettier-settings";
import { TYPESCRIPT_SETTINGS } from "../config-templates/typescript-settings";
import { VSCODE_SETTINGS } from "../config-templates/vscode-settings";
import { ConfFileNames } from "./constants/conf-file-names";

const createEslintIgnoreFile = (filePath: string) => {
  return fs.writeFile(filePath, ESLINT_IGNORE.join("\n"));
};

const createEslintSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(ESLINT_SETTINGS, null, 2));
};

const createPrettierSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(PRETTIER_SETTINGS, null, 2));
};

const createGitIgnoreFile = (filePath: string) => {
  return fs.writeFile(filePath, GIT_IGNORE.join("\n"));
};

const createNpmIgnoreFile = (filePath: string) => {
  return fs.writeFile(filePath, NPM_IGNORE.join("\n"));
};

const createLicenseFile = (filePath: string, name?: string) => {
  return fs.writeFile(filePath, getLicense(name));
};

const createTSSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(TYPESCRIPT_SETTINGS, null, 2));
};

const createVSCodeSettings = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(VSCODE_SETTINGS, null, 2));
};

const createJestSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JEST_SETTINGS);
};

const createGitHookTaskConfigFile = (
  filePath: string,
  packageManager: string
) => {
  return fs.writeFile(
    filePath,
    JSON.stringify(getGitHookTasksConfig(packageManager), null, 2)
  );
};

export const createConfigFiles = (
  cwd: string,
  packageManager: string,
  name?: string
) => {
  console.log(chalk.greenBright("Generating: "), "config files");

  const eslintIgnoreFile = path.resolve(cwd, ConfFileNames.ESLINT_IGNORE);
  const eslintSettingsFile = path.resolve(cwd, ConfFileNames.ESLINT_RC);
  const gitIgnoreFile = path.resolve(cwd, ConfFileNames.GIT_IGNORE);
  const jestSettingsFile = path.resolve(cwd, ConfFileNames.JEST_CONFIG);
  const licenseFile = path.resolve(cwd, ConfFileNames.LICENSE);
  const npmIgnoreFile = path.resolve(cwd, ConfFileNames.NPM_IGNORE);
  const prettierSettingsFile = path.resolve(cwd, ConfFileNames.PRETTIER_RC);
  const tsSettingsFile = path.resolve(cwd, ConfFileNames.TS_CONFIG);
  const vsCodeSettingsFile = path.resolve(cwd, ConfFileNames.VS_CODE_SETTINGS);
  const gitHookTaskConfigFile = path.resolve(
    cwd,
    ConfFileNames.GIT_HOOK_TASKS_CONFIG
  );

  return Promise.all([
    createEslintIgnoreFile(eslintIgnoreFile),
    createEslintSettingsFile(eslintSettingsFile),
    createGitIgnoreFile(gitIgnoreFile),
    createJestSettingsFile(jestSettingsFile),
    createLicenseFile(licenseFile, name),
    createNpmIgnoreFile(npmIgnoreFile),
    createPrettierSettingsFile(prettierSettingsFile),
    createTSSettingsFile(tsSettingsFile),
    createVSCodeSettings(vsCodeSettingsFile),
    createGitHookTaskConfigFile(gitHookTaskConfigFile, packageManager),
  ]);
};
