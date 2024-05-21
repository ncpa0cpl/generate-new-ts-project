/// <reference types="bun-types" />

import * as clify from "clify.js";
import path from "path";
import { AuthorName, Modules, PackageManager, ProjectName } from "./arguments";
import { mainAction } from "./main-action/main-action";

const SCRIPT_NAME = "generate-new-project";

const SCRIPT_DESCRIPTION = "Generate a new Typescript project.";

const program = clify.configure((cmd) => {
  cmd.setName(SCRIPT_NAME);
  cmd.setDescription(SCRIPT_DESCRIPTION);

  cmd.main((main) => {
    const packageManager = main.option(PackageManager);
    const projectName = main.option(ProjectName);
    const authorName = main.option(AuthorName);
    const modules = main.option(Modules);
    const outDir = main.input();

    return () =>
      mainAction({
        rootDir: path.resolve(outDir.get()),
        packageManager,
        projectName,
        authorName,
        modules,
      });
  });
});

program.run();