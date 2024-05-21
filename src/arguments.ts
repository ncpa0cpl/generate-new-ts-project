import { defineOption } from "clify.js";
import { ModuleController } from "./main-action/module-controller";

export const PackageManager = defineOption({
  char: "p",
  name: "package-manager",
  type: "string",
  default: "yarn",
  required: true,
  description:
    "Package manager used to install dependencies. (yarn, bun or npm)",
  validate(value) {
    if (!["yarn", "bun", "npm"].includes(value)) {
      return {
        expected: "yarn | bun | npm",
        received: value,
      };
    }
    return "ok";
  },
});

export const ProjectName = defineOption({
  char: "n",
  name: "name",
  type: "string",
  required: true,
  description: "The name of the project.",
});

export const AuthorName = defineOption({
  char: "a",
  name: "author",
  type: "string",
  description: "Name of the author.",
});

export const Modules = defineOption({
  char: "m",
  name: "modules",
  type: "string",
  description: `Comma separated list of modules. Available modules: ${ModuleController.listAvailableModules()}`,
});
