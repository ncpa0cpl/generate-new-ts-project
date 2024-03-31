import { BunPM } from "./bun";
import { Npm } from "./npm";
import type { PackageManager } from "./types";
import { Yarn } from "./yarn";

export const getPackageManager = (pm: string): PackageManager => {
  switch (pm) {
    case "npm":
      return Npm;
    case "yarn":
      return Yarn;
    case "bun":
      return BunPM;
  }

  console.error(`Invalid package manager argument: (${pm})`);
  process.exit(1);
};
