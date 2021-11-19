import { Npm } from "./npm";
import type { PackageManager } from "./types";
import { Yarn } from "./yarn";

export const getPackageManager = (pm: string): PackageManager => {
  if (pm === "yarn") return Yarn;
  if (pm === "npm") return Npm;

  console.error(`Invalid package manager argument: (${pm})`);
  process.exit(-1);
};
