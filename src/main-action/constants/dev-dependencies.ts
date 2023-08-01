import { Dependency } from "../../utils/deps";

export const DEV_DEPS = [
  new Dependency("@swc/core"),
  new Dependency("@swc/jest"),
  new Dependency("@types/jest"),
  new Dependency("@typescript-eslint/eslint-plugin"),
  new Dependency("@typescript-eslint/parser"),
  new Dependency("eslint-config-prettier"),
  new Dependency("eslint-plugin-prettier"),
  new Dependency("eslint"),
  new Dependency("husky"),
  new Dependency("jest"),
  new Dependency("git-hook-tasks", { register: "github", user: "ncpa0cpl" }),
  new Dependency("prettier-plugin-jsdoc"),
  new Dependency("prettier"),
  new Dependency("typescript"),
];
