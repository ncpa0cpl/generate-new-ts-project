import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { getYarnRc } from "./config-templates/yarnrc";
import type { Module, ModuleContext } from "./interface";

export class YarnBerryModule implements Module {
  getName(): "yarn3" {
    return "yarn3";
  }

  getConfigFiles(): ConfigFile[] {
    return [new ConfigFile(getYarnRc, ConfFileNames.YARN_RC)];
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    return await ctx.packageManager.changeVersion("stable");
  }
}
