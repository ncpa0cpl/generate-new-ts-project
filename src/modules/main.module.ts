import fs from "fs/promises";
import path from "path";
import { configureGitHookTasks } from "../main-action/configre-git-hook-tasks";
import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { getGitHookTasksConfig } from "./config-templates/git-hook-tasks-config";
import { GIT_IGNORE } from "./config-templates/git-ignore";
import { getLicense } from "./config-templates/license";
import { NPM_CONFIG } from "./config-templates/npm-config";
import { NPM_IGNORE } from "./config-templates/npm-ignore";
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

    const currentPm = ctx.packageManager.getName();
    switch (currentPm) {
      case "yarn": {
        await ctx.packageManager.changeVersion("classic");
        break;
      }
      case "bun": {
        await ctx.packageManager.run("init", "--yes");
        break;
      }
    }
  }

  getDevDependencies(ctx: ModuleContext): Dependency[] {
    const deps: Dependency[] = [
      new Dependency("typescript"),
      new Dependency("husky", {
        version: "~8",
      }),
      new Dependency("git-hook-tasks", {
        register: "github",
        user: "ncpa0cpl",
        version: "4215793",
      }),
    ];

    return deps;
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => GIT_IGNORE, ConfFileNames.GIT_IGNORE),
      new ConfigFile(() => TSCONFIG, ConfFileNames.TS_CONFIG),
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
    if (ctx.packageManager.getName() !== "bun") {
      await configureGitHookTasks(ctx.packageManager);
    } else {
      await ctx.packageManager.run("husky", "install");
      await ctx.packageManager.run(
        "husky",
        "add",
        ".husky/pre-push",
        `"${await ctx.packageManager.generateCommand(
          "git-hook-tasks pre-push"
        )}"`
      );
      const f = Bun.file(path.join(ctx.packageManager.wd(), ".husky/pre-push"));
      await Bun.write(f, await f.text().then((t) => t.replace(/\\/g, "")));
    }
  }
}
