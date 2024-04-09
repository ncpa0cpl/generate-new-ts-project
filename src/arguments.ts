import { Argument } from "clify.js";
import { ModuleController } from "./main-action/module-controller";

export const PackageManager = Argument.define({
  flagChar: "-p",
  keyword: "--package-manager",
  dataType: "string",
  default: "yarn",
  require: true,
  description:
    "Package manager used to install dependencies. (yarn, bun or npm)",
});

export const ProjectName = Argument.define({
  flagChar: "-n",
  keyword: "--name",
  dataType: "string",
  require: true,
  description: "The name of the project.",
});

export const OutputDir = Argument.define({
  flagChar: "-o",
  keyword: "--output-dir",
  dataType: "string",
  description: "Path to the directory in which the Project should be located.",
});

export const AuthorName = Argument.define({
  flagChar: "-a",
  keyword: "--author",
  dataType: "string",
  description: "Name of the author.",
});

export const Modules = Argument.define({
  flagChar: "-m",
  keyword: "--modules",
  dataType: "string",
  description: `Comma separated list of modules. Available modules: ${ModuleController.listAvailableModules()}`,
});
