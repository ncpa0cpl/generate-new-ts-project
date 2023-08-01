import type { PackageManager } from "../bindings/types";
import type { ConfigFile } from "../utils/config-file";
import type { Dependency } from "../utils/deps";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";

export interface ModuleContext {
  projectDir: string;
  projectName: string;
  authorName?: string;
  packageManager: PackageManager;
  allLoadedModules: string[];
}

export interface Module {
  getName(): string;
  beforeStart?(ctx: ModuleContext): void | Promise<void>;
  afterEnd?(ctx: ModuleContext): void | Promise<void>;
  getDependencies?(ctx: ModuleContext): Dependency[];
  getDevDependencies?(ctx: ModuleContext): Dependency[];
  getConfigFiles?(ctx: ModuleContext): ConfigFile[];
  packageJsonMiddleware?: (
    packageJson: PkgJsonFacade,
    ctx: ModuleContext
  ) => PkgJsonFacade | Promise<PkgJsonFacade>;
}
