import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { PRETTIER_IGNORE } from "./config-templates/prettier-ignore";
import { PRETTIER_SETTINGS } from "./config-templates/prettier-settings";
import type { Module } from "./interface";

export class PrettierModule implements Module {
  getName(): "prettier" {
    return "prettier";
  }

  getDevDependencies(): Dependency[] {
    return [
      new Dependency("prettier-plugin-jsdoc"),
      new Dependency("prettier"),
    ];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => PRETTIER_SETTINGS, ConfFileNames.PRETTIER_RC),
      new ConfigFile(() => PRETTIER_IGNORE, ConfFileNames.PRETTIER_IGNORE),
    ];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade) {
    packageJson.addScript("fix:fmt", "prettier -w ./src/**/*.ts");
    packageJson.addScript("test:fmt", "prettier -c ./src/**/*.ts");
    return packageJson;
  }

  beforeWriteFile(filename: string, content: string | object) {
    if (filename === ConfFileNames.GIT_HOOK_TASKS_CONFIG && isRecord(content)) {
      content["hooks"]["pre-push"].push({
        name: "Check Formatting",
        script: "test:fmt",
      });
    }
  }
}
