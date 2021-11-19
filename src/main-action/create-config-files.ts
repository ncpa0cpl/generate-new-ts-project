import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { ESLINT_IGNORE } from "../config-templates/eslint-ignore";
import { ESLINT_SETTINGS } from "../config-templates/eslint-settings";
import { GIT_IGNORE } from "../config-templates/git-ignore";
import { JEST_SETTINGS } from "../config-templates/jest-settings";
import { PRETTIER_SETTINGS } from "../config-templates/prettier-settings";
import { TYPESCRIPT_SETTINGS } from "../config-templates/typescript-settings";
import { VSCODE_SETTINGS } from "../config-templates/vscode-settings";

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

const createTSSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(TYPESCRIPT_SETTINGS, null, 2));
};

const createVSCodeSettings = (filePath: string) => {
  return fs.writeFile(filePath, JSON.stringify(VSCODE_SETTINGS, null, 2));
};

const createJestSettingsFile = (filePath: string) => {
  return fs.writeFile(filePath, JEST_SETTINGS);
};

export const createConfigFiles = (cwd: string) => {
  console.log(chalk.greenBright("Generating: "), "config files");

  const eslintIgnoreFile = path.resolve(cwd, ".eslintignore");
  const eslintSettingsFile = path.resolve(cwd, ".eslintrc.json");
  const prettierSettingsFile = path.resolve(cwd, ".prettierrc.json");
  const gitIgnoreFile = path.resolve(cwd, ".gitignore");
  const tsSettingsFile = path.resolve(cwd, "tsconfig.json");
  const vsCodeSettingsFile = path.resolve(cwd, ".vscode/settings.json");
  const jestSettingsFile = path.resolve(cwd, "jest.config.js");

  return Promise.all([
    createEslintIgnoreFile(eslintIgnoreFile),
    createEslintSettingsFile(eslintSettingsFile),
    createPrettierSettingsFile(prettierSettingsFile),
    createGitIgnoreFile(gitIgnoreFile),
    createTSSettingsFile(tsSettingsFile),
    createVSCodeSettings(vsCodeSettingsFile),
    createJestSettingsFile(jestSettingsFile),
  ]);
};
