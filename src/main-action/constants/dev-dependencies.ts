type DependencyOptions =
  | {
      version?: string;
      register: "github";
      user: string;
    }
  | {
      version?: string;
      register?: "npm";
      user?: undefined;
    };

export class Dependency {
  static pmType: "npm" | "yarn";
  static pmVersion: string;

  static setPackageManagerType(type: "npm" | "yarn", version = "") {
    this.pmType = type;
    this.pmVersion = version;
  }

  constructor(private name: string, private options: DependencyOptions = {}) {
    this.options.register ??= "npm";
    this.options.version ??= "latest";
  }

  private getNameForNpmRegister() {
    return `${this.name}@${this.options.version}`;
  }

  private getNameForGithubRegister() {
    if (Dependency.pmType === "yarn" && Dependency.pmVersion.startsWith("3")) {
      return `${this.options.user!}@${this.options.user!}/${this.name}`;
    } else {
      return `${this.options.user!}/${this.name}`;
    }
  }

  getFriendlyName() {
    if (this.options.version === "latest") {
      return this.name;
    }

    return `${this.name} v${this.options.version}`;
  }

  getInstallName() {
    if (this.options.register === "github") {
      return this.getNameForGithubRegister();
    } else {
      return this.getNameForNpmRegister();
    }
  }
}

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
