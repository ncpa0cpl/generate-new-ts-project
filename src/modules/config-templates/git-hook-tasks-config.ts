import type { ConfigFileContext } from "../../utils/config-file";

export const getGitHookTasksConfig = (ctx: ConfigFileContext) => {
  const prePush = [
    {
      name: "TypeScript",
      script: "test:tsc",
    },
    {
      name: "Lint",
      script: "test:lint",
    },
    {
      name: "Formatting",
      script: "test:format",
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
