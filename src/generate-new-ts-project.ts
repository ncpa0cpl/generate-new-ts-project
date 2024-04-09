/// <reference types="bun-types" />

import clify from "clify.js";
import {
  AuthorName,
  Modules,
  OutputDir,
  PackageManager,
  ProjectName,
} from "./arguments";
import { mainAction } from "./main-action/main-action";

const SCRIPT_NAME = "generate-new-project";

const SCRIPT_DESCRIPTION = "Generate a new Typescript project.";

clify.configure((main) => {
  main.setDisplayName(SCRIPT_NAME);
  main.setDescription(SCRIPT_DESCRIPTION);

  main.setMainAction(() => {
    const cwd = new OutputDir();
    const packageManager = new PackageManager();
    const projectName = new ProjectName();
    const authorName = new AuthorName();
    const modules = new Modules();

    return {
      run() {
        return mainAction({
          cwd,
          packageManager,
          projectName,
          authorName,
          modules,
        });
      },
    };
  });
});
