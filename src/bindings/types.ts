export type PackageManager = {
  /** Changes the current working directory. */
  setCwd(cwd: string): void;
  /** Installs a dependency. */
  install(pkg: string): Promise<void>;
  /** Installs a devDependency. */
  installDev(pkg: string): Promise<void>;
  /** Generates a bash command that will run the specified script. */
  generateCommand(script: string, ...args: string[]): Promise<string>;
  /** Runs a script. */
  run(script: string, ...args: string[]): Promise<void>;
};
