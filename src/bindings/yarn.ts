import child_process from "child_process";
import type { PackageManager } from "./types";

export const Yarn: PackageManager = class Yarn {
  static getName(): "yarn" {
    return "yarn";
  }

  private static version?: string;
  private static cwd: string = process.cwd();

  private static async execute(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      child_process.exec(command, { cwd: Yarn.cwd }, (err, stdout) => {
        if (err) return reject(err);
        return resolve(stdout);
      });
    });
  }

  static async getVersion(): Promise<string> {
    if (Yarn.version) return Yarn.version;

    this.version = await Yarn.run("-v");
    return this.version;
  }

  static async changeVersion(version: string) {
    await Yarn.run("set", "version", version);
    this.version = undefined;
    await Yarn.getVersion();
  }

  static setCwd(cwd: string) {
    Yarn.cwd = cwd;
  }

  static wd() {
    return Yarn.cwd;
  }

  static async init() {
    const version = await Yarn.getVersion();

    if (version.startsWith("3")) {
      return Yarn.run("init");
    }
  }

  static install(pkg: string) {
    const args: string[] = [];

    args.push(pkg);

    return Yarn.run("add", ...args);
  }

  static installDev(pkg: string) {
    const args: string[] = ["-D"];

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
