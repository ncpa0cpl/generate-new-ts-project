import fs from "fs/promises";
import path from "path";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { ESBUILD_SCRIPT } from "./config-templates/esbuild-script";
import type { Module, ModuleContext } from "./interface";

export class EsbuildModule implements Module {
  getName(): "esbuild" {
    return "esbuild";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const scriptsDir = path.resolve(ctx.projectDir, "scripts");
    await fs.mkdir(scriptsDir);
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("esbuild")];
  }

  getConfigFiles(): ConfigFile[] {
    return [new ConfigFile(() => ESBUILD_SCRIPT, "build.mjs", "scripts")];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("build", "node ./scripts/build.mjs");
    return packageJson;
  }
}
