import path from "path";
import type { PackageManager } from "../bindings/types";
import { DprintModule } from "../modules/dprint.module";
import { EsbuildModule } from "../modules/esbuild.module";
import { EslintModule } from "../modules/eslint.module";
import { GestModule } from "../modules/gest.module";
import type { Module, ModuleContext } from "../modules/interface";
import { JestModule } from "../modules/jest.module";
import { MainModule } from "../modules/main.module";
import { NodepackModule } from "../modules/nodepack.module";
import { OxlintModule } from "../modules/oxlint.module";
import { PrettierModule } from "../modules/prettier.module";
import { TscBuilderModule } from "../modules/tsc-builder.module";
import { VitestModule } from "../modules/vitest.module";
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
    // build tools
    new EsbuildModule(),
    new TscBuilderModule(),
    new NodepackModule(),
    // linting
    new EslintModule(),
    new OxlintModule(),
    // formatting
    new PrettierModule(),
    new DprintModule(),
    // testing
    new JestModule(),
    new VitestModule(),
    new GestModule(),
    // package managers
    new YarnBerryModule(),
  ];

  public static listAvailableModules() {
    return this.Modules.map((m) => m.getName()).join(", ");
  }

  private readonly ctx: ModuleContext;
  private readonly loadedModules: Module[] = [mainMod];

  constructor(options: ModuleControllerOptions) {
    if (options.moduleList === "default") {
      options.moduleList = "dprint,nodepack,vitest";
    }

    const modsToLoad = options.moduleList.split(",").filter((v) => Boolean(v));

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
    Object.freeze(this.ctx);

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

  private prepareFile(cf: ConfigFile) {
    const content = this.loadedModules.reduce((c: string | object, m) => {
      return m.beforeWriteFile?.(cf.filename, c, this.ctx) ?? c;
    }, cf.getContent(this.ctx));

    return {
      filepath: path.join(cf.location, cf.filename),
      content:
        typeof content === "string"
          ? content
          : JSON.stringify(content, null, 2),
    };
  }

  getConfigFiles() {
    return this.loadedModules
      .flatMap((m) => m.getConfigFiles?.(this.ctx))
      .filter((cf): cf is ConfigFile => cf != null)
      .map((cf) => this.prepareFile(cf));
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
