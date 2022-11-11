export type PackageManager = {
  getName(): "npm" | "yarn";
  /** Changes the current working directory. */
  setCwd(cwd: string): void;
  /** Installs a dependency. */
  install(pkg: string): Promise<any>;
  /** Installs a devDependency. */
  installDev(pkg: string): Promise<any>;
  /** Generates a bash command that will run the specified script. */
  generateCommand(script: string, ...args: string[]): Promise<string>;
  /** Runs a script. */
  run(script: string, ...args: string[]): Promise<any>;
  /** Initializes a new project if applicable. */
  init(): Promise<any>;
  /** Only supported by yarn, changes the version of the package manager. */
  changeVersion(version: string): Promise<any>;
  /** Only supported by Yarn, returns the current package manager version. */
  getVersion(): Promise<string>;
};
