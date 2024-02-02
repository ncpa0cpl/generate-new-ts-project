import type { ConfigFileContext } from "../../utils/config-file";

export const getGitHookTasksConfig = (ctx: ConfigFileContext) => {
  const prePush = [
    {
      name: "TypeScript",
      script: "test:tsc",
    },
  ];

  return {
    packageManager: ctx.packageManager.getName(),
    parallel: true,
    hooks: {
      "pre-push": prePush,
      "pre-commit": [],
      "post-commit": [],
    },
  };
};
