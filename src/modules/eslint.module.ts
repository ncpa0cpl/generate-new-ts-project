import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { ESLINT_IGNORE } from "./config-templates/eslint-ignore";
import { ESLINT_SETTINGS } from "./config-templates/eslint-settings";
import type { Module } from "./interface";

export class EslintModule implements Module {
  getName(): "eslint" {
    return "eslint";
  }

  getDevDependencies(): Dependency[] {
    return [
      new Dependency("@typescript-eslint/eslint-plugin"),
      new Dependency("@typescript-eslint/parser"),
      new Dependency("eslint-config-prettier"),
      new Dependency("eslint-plugin-prettier"),
      new Dependency("eslint"),
    ];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => ESLINT_SETTINGS, ConfFileNames.ESLINT_RC),
      new ConfigFile(() => ESLINT_IGNORE, ConfFileNames.ESLINT_IGNORE),
    ];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade) {
    packageJson.addScript("fix:lint", "eslint --fix ./src/**/*.ts");
    packageJson.addScript("test:lint", "eslint ./src/**/*.ts");
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
