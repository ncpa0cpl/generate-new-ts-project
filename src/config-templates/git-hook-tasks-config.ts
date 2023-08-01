export const getGitHookTasksConfig = (packageManager: string) => ({
  packageManager,
  parallel: true,
  hooks: {
    "pre-push": [
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
      {
        name: "Unit Tests",
        script: "test:unit",
      },
    ],
    "pre-commit": [],
    "post-commit": [],
  },
});
