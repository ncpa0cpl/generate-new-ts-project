export class PkgJsonFacade {
  private readonly packageJson: Record<string, any>;

  constructor(initial: Record<string, any> = {}) {
    this.packageJson = initial;
  }

  addScript(name: string, cmd: string): void {
    Object.defineProperty(this.packageJson.scripts, name, {
      value: cmd,
      enumerable: true,
    });
  }

  addIfNotExists(key: string, value: any): void {
    if (!(key in this.packageJson)) {
      Object.defineProperty(this.packageJson, key, {
        value,
        enumerable: true,
      });
    }
  }

  toJSON(): string {
    return JSON.stringify(this.packageJson, null, 2);
  }
}
