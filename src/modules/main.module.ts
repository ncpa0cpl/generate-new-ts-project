import fs from "fs/promises";
import path from "path";
import { configureGitHookTasks } from "../main-action/configre-git-hook-tasks";
import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { ESLINT_IGNORE } from "./config-templates/eslint-ignore";
import { ESLINT_SETTINGS } from "./config-templates/eslint-settings";
import { getGitHookTasksConfig } from "./config-templates/git-hook-tasks-config";
import { getLicense } from "./config-templates/license";
import { NPM_CONFIG } from "./config-templates/npm-config";
import { NPM_IGNORE } from "./config-templates/npm-ignore";
import { PRETTIER_IGNORE } from "./config-templates/prettier-ignore";
import { PRETTIER_SETTINGS } from "./config-templates/prettier-settings";
import { TSCONFIG } from "./config-templates/typescript-settings";
import { VSCODE_SETTINGS } from "./config-templates/vscode-settings";
import type { Module, ModuleContext } from "./interface";

export class MainModule implements Module {
  getName(): "Main" {
    return "Main";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const vscodeDir = path.resolve(ctx.projectDir, ".vscode");
    await fs.mkdir(vscodeDir);
  }

  getDevDependencies(): Dependency[] {
    return [
      new Dependency("@typescript-eslint/eslint-plugin"),
      new Dependency("@typescript-eslint/parser"),
      new Dependency("eslint-config-prettier"),
      new Dependency("eslint-plugin-prettier"),
      new Dependency("eslint"),
      new Dependency("husky"),
      new Dependency("prettier-plugin-jsdoc"),
      new Dependency("prettier"),
      new Dependency("typescript"),
      new Dependency("git-hook-tasks", {
        register: "github",
        user: "ncpa0cpl",
      }),
    ];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => TSCONFIG, ConfFileNames.TS_CONFIG),
      new ConfigFile(() => PRETTIER_SETTINGS, ConfFileNames.PRETTIER_RC),
      new ConfigFile(() => PRETTIER_IGNORE, ConfFileNames.PRETTIER_IGNORE),
      new ConfigFile(() => ESLINT_SETTINGS, ConfFileNames.ESLINT_RC),
      new ConfigFile(() => ESLINT_IGNORE, ConfFileNames.ESLINT_IGNORE),
      new ConfigFile(() => NPM_CONFIG, ConfFileNames.NPM_CONFIG),
      new ConfigFile(() => NPM_IGNORE, ConfFileNames.NPM_IGNORE),
      new ConfigFile(getLicense, ConfFileNames.LICENSE),
      new ConfigFile(
        getGitHookTasksConfig,
        ConfFileNames.GIT_HOOK_TASKS_CONFIG
      ),
      new ConfigFile(
        () => VSCODE_SETTINGS,
        ConfFileNames.VS_CODE_SETTINGS,
        ".vscode"
      ),
    ];
  }

  async afterEnd(ctx: ModuleContext): Promise<void> {
    await configureGitHookTasks(ctx.packageManager);
  }
}
