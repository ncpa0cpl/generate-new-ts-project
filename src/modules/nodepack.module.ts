import fs from "fs/promises";
import path from "path";
import { ConfigFile } from "../utils/config-file";
import { Dependency } from "../utils/deps";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import { NODEPACK_SCRIPT } from "./config-templates/nodepack-script";
import type { Module, ModuleContext } from "./interface";

export class NodepackModule implements Module {
  getName(): "nodepack" {
    return "nodepack";
  }

  async beforeStart(ctx: ModuleContext): Promise<void> {
    const scriptsDir = path.resolve(ctx.projectDir, "scripts");
    await fs.mkdir(scriptsDir);
  }

  getDevDependencies(): Dependency[] {
    return [new Dependency("esbuild"), new Dependency("@ncpa0cpl/nodepack")];
  }

  getConfigFiles(): ConfigFile[] {
    return [new ConfigFile(() => NODEPACK_SCRIPT, "build.mjs", "scripts")];
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("build", "node ./scripts/build.mjs");
    return packageJson;
  }
}
