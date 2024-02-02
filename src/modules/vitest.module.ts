import fs from "fs/promises";
import path from "path";
import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import { isRecord } from "../utils/is-record";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { TESTDIR_TSCONFIG } from "./config-templates/test-dir-tsconfig";
import { VITEST_CONFIG } from "./config-templates/vitest";
import type { Module, ModuleContext } from "./interface";

export class VitestModule implements Module {
  getName(): "vitest" {
    return "vitest";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const testsDir = path.resolve(ctx.projectDir, "__tests__");
    await fs.mkdir(testsDir);
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("vitest")];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => VITEST_CONFIG, ConfFileNames.VITEST),
      new ConfigFile(
        () => TESTDIR_TSCONFIG,
        ConfFileNames.TS_CONFIG,
        "__tests__"
      ),
    ];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("test:unit", "vitest run");
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
