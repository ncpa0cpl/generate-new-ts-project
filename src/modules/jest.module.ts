import fs from "fs/promises";
import path from "path";
import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { JEST_SETTINGS } from "./config-templates/jest-settings";
import { SWC_CONFIG } from "./config-templates/swc-config";
import { TESTDIR_TSCONFIG } from "./config-templates/test-dir-tsconfig";
import type { Module, ModuleContext } from "./interface";

export class JestModule implements Module {
  getName(): "jest" {
    return "jest";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const testsDir = path.resolve(ctx.projectDir, "__tests__");
    await fs.mkdir(testsDir);
  }

  getDevDependencies(): Dependency[] {
    return [
      new Dependency("@swc/core"),
      new Dependency("@swc/jest"),
      new Dependency("@types/jest"),
      new Dependency("jest"),
    ];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => JEST_SETTINGS, ConfFileNames.JEST_CONFIG),
      new ConfigFile(() => SWC_CONFIG, ConfFileNames.SWC_CONFIG),
      new ConfigFile(
        () => TESTDIR_TSCONFIG,
        ConfFileNames.TS_CONFIG,
        "__tests__"
      ),
    ];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("test:unit", "jest --coverage");
    return packageJson;
  }

  beforeWriteFile(filename: string, content: string | object) {
    if (filename === ConfFileNames.GIT_HOOK_TASKS_CONFIG && isRecord(content)) {
      content["hooks"]["pre-push"].push({
        name: "Unit Tests",
        script: "test:unit",
      });
    }
  }
}
