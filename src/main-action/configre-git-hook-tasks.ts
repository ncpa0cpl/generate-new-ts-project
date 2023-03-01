import { html, Output } from "termx-markup";
import type { PackageManager } from "../bindings/types";

export const configureGitHookTasks = async (PM: PackageManager) => {
  Output.print(html`
    <span color="lightGreen">Configuring:</span>
    <pre> git-hook-tasks</pre>
  `);
  await PM.run("git-hook-tasks", "install", "-p", PM.getName());
};
