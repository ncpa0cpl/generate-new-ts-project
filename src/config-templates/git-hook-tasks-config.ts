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
        name: "ESLint",
        script: "test:lint",
      },
      {
        name: "Prettier",
        script: "test:prettier",
      },
      {
        mustRunAlone: true,
        name: "Jest Tests",
        script: "test:jest",
      },
    ],
    "pre-commit": [],
    "post-commit": [],
  },
});
