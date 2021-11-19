import clify from "clify.js";
import { OutputDir, PackageManager, ProjectName } from "./arguments";
import { mainAction } from "./main-action/main-action";

const SCRIPT_NAME = "generate-new-project";

const SCRIPT_DESCRIPTION = "Generate a new Typescript project.";

clify.configure((main) => {
  main.setDisplayName(SCRIPT_NAME);
  main.setDescription(SCRIPT_DESCRIPTION);

  main.setMainAction(() => {
    const name = new ProjectName();
    const packageManager = new PackageManager();
    const cwd = new OutputDir();

    return {
      run() {
        mainAction({
          cwd,
          packageManager,
          name,
        });
      },
    };
  });
});
