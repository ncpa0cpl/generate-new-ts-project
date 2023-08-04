export const ESLINT_IGNORE = [
  // directories
  "/__mocks__",
  "/__tests__",
  "/.vscode",
  "/coverage",
  "/dist",
  "/node_modules",
  "/tests",
  // files
  "/.eslintignore",
  "/.eslintrc.json",
  "/.gitignore",
  "/.prettierrc.json",
  "/jest.config.js",
  "/package-lock.json",
  "/tsconfig.json",
  "/webpack.config.js",
  "/yarn-error.log",
  "/yarn.lock",
  // config files in root
  "/*.js",
  "/*.mjs",
  "/*.cjs",
  "/scripts",
].join("\n");
