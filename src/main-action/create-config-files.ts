import fs from "fs/promises";
import path from "path";
import { html, Output } from "termx-markup";
import type { ModuleContext } from "../modules/interface";
import type { ConfigFile } from "../utils/config-file";

export const createConfigFiles = async (
  cwd: string,
  confFiles: ConfigFile[],
  ctx: ModuleContext
) => {
  Output.print(
    html`
      <span color="lightGreen">Generating:</span>
      <pre> config files</pre>
    `
  );

  const writeOps = confFiles.map(async (cf) => {
    const content = cf.getAsString(ctx);
    const filepath = path.resolve(cwd, cf.location, cf.filename);

    await fs.writeFile(filepath, content);
  });

  return Promise.all(writeOps);
};
