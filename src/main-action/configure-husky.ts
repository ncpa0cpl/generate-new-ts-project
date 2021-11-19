import chalk from "chalk";
import type { PackageManager } from "../bindings/types";

export const configureHusky = async (PM: PackageManager, cwd: string) => {
  console.log(chalk.greenBright("Configuring: "), "husky");

  await PM.run("husky", "install");

  return await Promise.all([
    await PM.run(
      "husky",
      "add",
      ".husky/pre-push",
      await PM.generateCommand("tsc")
    ),
    await PM.run(
      "husky",
      "add",
      ".husky/pre-push",
      await PM.generateCommand("lint")
    ),
    await PM.run(
      "husky",
      "add",
      ".husky/pre-push",
      await PM.generateCommand("test")
    ),
  ]);
};
