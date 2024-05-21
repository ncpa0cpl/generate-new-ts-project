import { ConfFileNames } from "../main-action/constants/conf-file-names";
import type { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import type { Module } from "./interface";

export class OxlintModule implements Module {
  getName(): "oxlint" {
    return "oxlint";
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("oxlint")];
  }

  getConfigFiles(): ConfigFile[] {
    return [];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade) {
    packageJson.addScript("fix:lint", "oxlint --fix ./src");
    packageJson.addScript("test:lint", "oxlint ./src");
    return packageJson;
  }

  beforeWriteFile(filename: string, content: string | object) {
    if (filename === ConfFileNames.GIT_HOOK_TASKS_CONFIG && isRecord(content)) {
      content["hooks"]["pre-push"].push({
        name: "Lint",
        script: "test:lint",
      });
    }
  }
}
