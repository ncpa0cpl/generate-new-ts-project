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
    if (!this.options.version || this.options.version === "latest")
      return this.name;

    return `${this.name}@${this.options.version}`;
  }

  private getNameForGithubRegister() {
    if (Dependency.pmType === "yarn" && Dependency.pmVersion.startsWith("3")) {
      return `${this.name!}@${this.options.user!}/${this.name}`;
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
