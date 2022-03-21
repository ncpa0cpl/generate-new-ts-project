import clify from "clify.js";
import {
  AuthorName,
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

    return {
      run() {
        mainAction({
          cwd,
          packageManager,
          projectName,
          authorName,
        });
      },
    };
  });
});
