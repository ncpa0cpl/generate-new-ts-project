import fs from "fs/promises";
import path from "path";
import { ConfFileNames } from "../main-action/constants/conf-file-names";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { GEST_CONFIG } from "./config-templates/gest-config";
import { TESTDIR_TSCONFIG } from "./config-templates/test-dir-tsconfig";
import type { Module, ModuleContext } from "./interface";

export class GestModule implements Module {
  getName(): "gest" {
    return "gest";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const testsDir = path.resolve(ctx.projectDir, "__tests__");
    await fs.mkdir(testsDir);
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("@reactgjs/gest")];
  }

  getConfigFiles(): ConfigFile[] {
    return [
      new ConfigFile(() => GEST_CONFIG, ConfFileNames.GEST_CONFIG),
      new ConfigFile(
        () => TESTDIR_TSCONFIG,
        ConfFileNames.TS_CONFIG,
        "__tests__"
      ),
    ];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("test:unit", "gest");
    return packageJson;
  }
}
