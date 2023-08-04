import type { PackageManager } from "../bindings/types";
import { EsbuildModule } from "../modules/esbuild.module";
import { GestModule } from "../modules/gest.module";
import type { Module, ModuleContext } from "../modules/interface";
import { JestModule } from "../modules/jest.module";
import { MainModule } from "../modules/main.module";
import { NodepackModule } from "../modules/nodepack.module";
import { TscBuilderModule } from "../modules/tsc-builder.module";
import { YarnBerryModule } from "../modules/yarn-berry.module";
import type { ConfigFile } from "../utils/config-file";
import type { Dependency } from "../utils/deps";
import type { PkgJsonFacade } from "../utils/pkg-json-facade";

export interface ModuleControllerOptions {
  packageManager: PackageManager;
  moduleList: string;
  projectName: string;
  authorName?: string;
}

const mainMod = new MainModule();

export class ModuleController {
  private static Modules = [
    new JestModule(),
    new GestModule(),
    new YarnBerryModule(),
    new TscBuilderModule(),
    new NodepackModule(),
    new EsbuildModule(),
  ];

  private readonly ctx: ModuleContext;
  private readonly loadedModules: Module[] = [mainMod];

  constructor(options: ModuleControllerOptions) {
    const modsToLoad = options.moduleList.split(",").filter(Boolean);

    for (const mod of modsToLoad) {
      const module = ModuleController.Modules.find((m) => m.getName() === mod);

      if (!module) {
        console.error(`'${mod}' is not a valid module`);
        process.exit(1);
      }

      if (!this.loadedModules.includes(module)) {
        this.loadedModules.push(module);
      }
    }

    this.ctx = {
      allLoadedModules: this.loadedModules.map((m) => m.getName()),
      packageManager: options.packageManager,
      projectName: options.projectName,
      authorName: options.authorName,
      projectDir: "",
    };
  }

  getContext(): ModuleContext {
    return this.ctx;
  }

  async beforeStart(cwd: string) {
    this.ctx.projectDir = cwd;

    for (const mod of this.loadedModules) {
      if (mod.beforeStart) await mod.beforeStart(this.ctx);
    }
  }

  async afterEnd() {
    for (const mod of this.loadedModules) {
      if (mod.afterEnd) await mod.afterEnd(this.ctx);
    }
  }

  getDependencies() {
    return this.loadedModules
      .flatMap((m) => m.getDependencies?.(this.ctx))
      .filter((d): d is Dependency => d != null);
  }

  getDevDependencies() {
    return this.loadedModules
      .flatMap((m) => m.getDevDependencies?.(this.ctx))
      .filter((d): d is Dependency => d != null);
  }

  getConfigFiles() {
    return this.loadedModules
      .flatMap((m) => m.getConfigFiles?.(this.ctx))
      .filter((d): d is ConfigFile => d != null);
  }

  async applyPackageJsonMiddleware(packageJson: PkgJsonFacade) {
    let pckg = packageJson;
    for (const mod of this.loadedModules) {
      if (mod.packageJsonMiddleware) {
        pckg = await mod.packageJsonMiddleware(pckg, this.ctx);
      }
    }
    return pckg;
  }
}