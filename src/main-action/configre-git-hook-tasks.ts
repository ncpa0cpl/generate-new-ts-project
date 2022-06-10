import chalk from "chalk";
import type { PackageManager } from "../bindings/types";

export const configureGitHookTasks = async (PM: PackageManager) => {
  console.log(chalk.greenBright("Configuring: "), "git-hook-tasks");
  await PM.run("git-hook-tasks", "install", "-p", PM.getName());
};
