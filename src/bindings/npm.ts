import child_process from "child_process";
import fs from "fs/promises";
import path from "path";
import { parseArgs } from "./parse-args";
import type { PackageManager } from "./types";

export const Npm: PackageManager = class Npm {
  static getName(): "npm" {
    return "npm";
  }

  private static cwd: string = process.cwd();

  private static execute(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      child_process.exec(command, { cwd: Npm.cwd }, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr));
        return resolve(stdout);
      });
    });
  }

  static async init() {
    await fs.writeFile(
      path.resolve(Npm.cwd, "package.json"),
      JSON.stringify(
        {
          packageManager: "npm",
        },
        null,
        2
      )
    );
  }

  static async changeVersion() {
    // no-op
  }

  static async getVersion() {
    return "";
  }

  static setCwd(cwd: string) {
    Npm.cwd = cwd;
  }

  static wd() {
    return Npm.cwd;
  }

  static install(pkg: string) {
    const args: string[] = ["npm", "install"];

    args.push(pkg);

    return Npm.execute(parseArgs(args));
  }

  static installDev(pkg: string) {
    const args: string[] = ["npm", "install", "-D"];

    args.push(pkg);

    return Npm.execute(parseArgs(args));
  }

  static async run(script: string, ...args: string[]) {
    return Npm.execute(await Npm.generateCommand(script, ...args));
  }

  static async generateCommand(script: string, ...args: string[]) {
    const packageFile = path.resolve(Npm.cwd, "package.json");

    const scripts: string[] = [];

    try {
      const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

      const settings: Record<string, any> = JSON.parse(fileData);

      scripts.push(...Object.keys(settings["scripts"]));
    } catch (e) {
      //
    }

    if (scripts.includes(script)) {
      const a = ["npm", "run", script];

      if (args.length > 0) {
        a.push("--");
        a.push(...args);
      }

      return parseArgs(a);
    }

    return parseArgs(["npx", script, ...args]);
  }
};
