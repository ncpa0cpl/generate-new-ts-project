import type { ConfigFileContext } from "../utils/config-file";

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

  if (
    ctx.allLoadedModules.includes("jest") ||
    ctx.allLoadedModules.includes("gest")
  ) {
    prePush.push({
      name: "Unit Tests",
      script: "test:unit",
    });
  }

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
