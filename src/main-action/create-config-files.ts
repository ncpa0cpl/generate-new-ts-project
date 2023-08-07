import fs from "fs/promises";
import path from "path";
import { html, Output } from "termx-markup";
import type { ModuleController } from "./module-controller";

export const createConfigFiles = async (
  cwd: string,
  modules: ModuleController
) => {
  Output.print(
    html`
      <span color="lightGreen">Generating:</span>
      <pre> config files</pre>
    `
  );

  const writeOps = modules.getConfigFiles().map(async (cf) => {
    await fs.writeFile(path.resolve(cwd, cf.filepath), cf.content);
  });

  return Promise.all(writeOps);
};
