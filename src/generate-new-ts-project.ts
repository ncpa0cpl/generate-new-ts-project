/// <reference types="bun-types" />

import clify from "clify.js";
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

    return () => {
      const od = outDir.get();

      if (!od) {
        throw new Error("Output directory not provided.");
      }

      return mainAction({
        rootDir: path.resolve(od),
        packageManager,
        projectName,
        authorName,
        modules,
      });
    };
  });
});

program.run();
