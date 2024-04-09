export type DependencyOptions =
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
  static pmType: "npm" | "yarn" | "bun";
  static pmVersion: string;

  static setPackageManagerType(type: "npm" | "yarn" | "bun", version = "") {
    this.pmType = type;
    this.pmVersion = version;
  }

  constructor(private name: string, private options: DependencyOptions = {}) {
    this.options.register ??= "npm";
    this.options.version ??= "latest";
  }

  private getNameForNpmRegister() {
    if (!this.options.version || this.options.version === "latest")
      return this.name;

    return `${this.name}@${this.options.version}`;
  }

  private getNameForGithubRegister() {
    let name: string;
    if (Dependency.pmType === "yarn" && Dependency.pmVersion.startsWith("3")) {
      name = `${this.name!}@${this.options.user!}/${this.name}`;
    } else {
      name = `git+https://github.com/${this.options.user!}/${this.name}`;
    }
    if (this.options.version && this.options.version !== "latest") {
      name += `#${this.options.version}`;
    }
    return name;
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
