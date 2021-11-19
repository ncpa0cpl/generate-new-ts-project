import child_process from "child_process";
import { parseArgs } from "./parse-args";

export class Git {
  private static cwd: string = process.cwd();

  private static async execute(command: string) {
    await new Promise<void>((resolve, reject) => {
      child_process.exec(command, { cwd: Git.cwd }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  static setCwd(cwd: string) {
    Git.cwd = cwd;
  }

  static init(dirPath: string) {
    Git.setCwd(dirPath);
    return Git.execute(parseArgs(["git", "init"]));
  }

  static add(...files: string[]) {
    if (files.length === 0) files.push(".");

    Git.execute(parseArgs(["git", "add", ...files]));
  }
}
