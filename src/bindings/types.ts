export type PackageManager = {
  generateCommand(script: string, ...args: string[]): Promise<string>;
  setCwd(cwd: string): void;
  install(pkg: string, dev?: boolean): Promise<void>;
  run(script: string, ...args: string[]): Promise<void>;
};
