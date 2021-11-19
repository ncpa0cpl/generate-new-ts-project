import child_process from "child_process";
import type { PackageManager } from "./types";

export const Yarn: PackageManager = class Yarn {
  private static cwd: string = process.cwd();

  private static async execute(command: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      child_process.exec(command, { cwd: Yarn.cwd }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  static setCwd(cwd: string) {
    Yarn.cwd = cwd;
  }

  static install(pkg: string, dev = true) {
    const args: string[] = [];

    if (dev) {
      args.push("-D");
    }

    args.push(pkg);

    return Yarn.run("add", ...args);
  }

  static async run(script: string, ...args: string[]) {
    return Yarn.execute(await Yarn.generateCommand(script, ...args));
  }

  static async generateCommand(script: string, ...args: string[]) {
    return ["yarn", script, ...args]
      .map((p) => p.replace(" ", "\\ "))
      .join(" ");
  }
};
