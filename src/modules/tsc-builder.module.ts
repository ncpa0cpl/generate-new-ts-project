import type { PkgJsonFacade } from "../utils/pkg-json-facade";
import type { Module } from "./interface";

export class TscBuilderModule implements Module {
  getName(): "build-tsc" {
    return "build-tsc";
  }

  packageJsonMiddleware(packageJson: PkgJsonFacade): PkgJsonFacade {
    packageJson.addScript("build", "tsc");
    return packageJson;
  }
}
