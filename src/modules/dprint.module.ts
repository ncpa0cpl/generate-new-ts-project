import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { DPRINT_CONFIG } from "./config-templates/dprint";
import type { Module } from "./interface";

export class DprintModule implements Module {
  getName(): "dprint" {
    return "dprint";
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("dprint")];
  }

  getConfigFiles(): ConfigFile[] {
    return [new ConfigFile(() => DPRINT_CONFIG, ConfFileNames.DPRINT)];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade) {
    packageJson.addScript("fix:fmt", "dprint fmt");
    packageJson.addScript("test:fmt", "dprint check");
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
