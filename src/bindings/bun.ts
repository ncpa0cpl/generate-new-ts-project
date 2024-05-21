import child_process from "child_process";
import fs from "fs/promises";
import path from "path";
import { parseArgs } from "./parse-args";
import type { PackageManager } from "./types";

const BUN_CMDS = [
  "run",
  "test",
  "x",
  "repl",
  "install",
  "add",
  "remove",
  "update",
  "link",
  "unlink",
  "pm",
  "build",
  "init",
  "create",
  "upgrade",
];

export const BunPM: PackageManager = class BunPM {
  static getName(): "bun" {
    return "bun";
  }

  private static cwd: string = process.cwd();

  private static async execute(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      child_process.exec(command, { cwd: BunPM.cwd }, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr));
        return resolve(stdout);
      });
    });
  }

  static async getVersion(): Promise<string> {
    return "";
  }

  static async changeVersion(version: string) {}

  static setCwd(cwd: string) {
    BunPM.cwd = cwd;
  }

  static wd() {
    return BunPM.cwd;
  }

  static async init() {
    await fs.writeFile(
      path.resolve(BunPM.cwd, "package.json"),
      JSON.stringify(
        {
          packageManager: "bun",
        },
        null,
        2
      )
    );
  }

  static install(pkg: string) {
    const args: string[] = [];

    args.push(pkg);

    return BunPM.run("add", ...args);
  }

  static installDev(pkg: string) {
    const args: string[] = ["-d"];

    args.push(pkg);

    return BunPM.run("add", ...args);
  }

  static async run(script: string, ...args: string[]) {
    return BunPM.execute(await BunPM.generateCommand(script, ...args));
  }

  static async generateCommand(script: string, ...args: string[]) {
    const packageFile = path.resolve(BunPM.cwd, "package.json");

    const scripts: string[] = [];

    try {
      const fileData = await fs.readFile(packageFile, { encoding: "utf-8" });

      const settings: Record<string, any> = JSON.parse(fileData);

      scripts.push(...Object.keys(settings["scripts"]));
    } catch {
      //
    }

    if (scripts.includes(script)) {
      return parseArgs(["bun", "run", script, ...args]);
    }

    if (BUN_CMDS.includes(script)) {
      return parseArgs(["bun", script, ...args]);
    }

    return parseArgs(["bun", "x", script, ...args]);
  }
};
