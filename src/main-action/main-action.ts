import type { Argument } from "clify.js";
import fs from "fs/promises";
import path from "path";
import { html, Output } from "termx-markup";
import { getPackageManager } from "../bindings/get-package-manager";
import { Git } from "../bindings/git";
import { Dependency } from "../utils/deps";
import { createConfigFiles } from "./create-config-files";
import { ModuleController } from "./module-controller";
import { updatePackageFile } from "./update-package-file";

export type MainActionParams = {
  projectName: Argument<"string", true>;
  authorName: Argument<"string", false>;
  packageManager: Argument<"string", true>;
  cwd: Argument<"string", false>;
  modules: Argument<"string", false>;
};

export const mainAction = async (params: MainActionParams) => {
  const { projectName, authorName, cwd, packageManager, modules } = params;

  const PM = getPackageManager(packageManager.value);
  const moduleController = new ModuleController({
    moduleList: modules.value ?? "",
    packageManager: PM,
    projectName: projectName.value,
    authorName: authorName.value,
  });

  const rootDir = cwd.value ?? process.cwd();

  const projectDir = path.resolve(rootDir, projectName.value);

  const srcDir = path.resolve(projectDir, "src");
  const distDir = path.resolve(projectDir, "dist");

  const indexFile = path.resolve(srcDir, "index.ts");

  const cwdFiles = await fs.readdir(rootDir);

  if (cwdFiles.includes(projectName.value)) {
    console.error(
      `Directory with the name "${projectName.value}" already exists.`
    );
    process.exit(1);
  }

  await fs.mkdir(projectDir);

  PM.setCwd(projectDir);
  await PM.init();

  await moduleController.beforeStart(projectDir);

  await Git.init(projectDir);

  Output.print(html`
    <span color="lightGreen">Generating:</span>
    <pre color="lightYellow"> ${projectName.value} </pre>
    <span>project files</span>
  `);

  await Promise.all([
    fs.mkdir(srcDir),
    fs.mkdir(distDir),
    createConfigFiles(projectDir, moduleController),
  ]);

  await fs.writeFile(indexFile, "");

  Dependency.setPackageManagerType(PM.getName(), await PM.getVersion());

  for (const dependency of moduleController.getDependencies()) {
    Output.print(html`
      <span color="lightGreen">Installing dependency:</span>
      <pre> ${dependency.getFriendlyName()}</pre>
    `);
    await PM.install(dependency.getInstallName());
  }

  for (const dependency of moduleController.getDevDependencies()) {
    Output.print(html`
      <span color="lightGreen">Installing development dependency:</span>
      <pre> ${dependency.getFriendlyName()}</pre>
    `);
    await PM.installDev(dependency.getInstallName());
  }

  await updatePackageFile(projectDir, moduleController);

  await moduleController.afterEnd();

  await Git.add();
};
