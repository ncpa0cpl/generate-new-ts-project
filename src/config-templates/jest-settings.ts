export const JEST_SETTINGS =
  /** Js */ `
const fs = require("fs");
const path = require("path");

const swcConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, ".swcrc"), "utf-8")
);

/** @type {import("jest").Config} */
const config = {
  testRegex: ".*__tests__/.+(\\.test\\.(ts|js|tsx|jsx))$",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["@swc/jest", swcConfig],
  },
  roots: ["<rootDir>"],
  collectCoverageFrom: ["src/**/*.(ts|js|tsx|jsx)"],
  coverageReporters: ["html", "text"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage/",
    "/__mocks__/",
    "/__tests__/",
    "/dist/",
    "/.husky/",
    "/.vscode/",
  ],
};

module.exports = config;
`.trim() + "\n";
