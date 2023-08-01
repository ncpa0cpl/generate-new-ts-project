import type { ModuleContext } from "../modules/interface";

export interface ConfigFileContext extends ModuleContext {}

export class ConfigFile {
  constructor(
    private readonly getContent: (ctx: ConfigFileContext) => string | object,
    public readonly filename: string,
    public readonly location: string = "."
  ) {}

  getAsString(ctx: ConfigFileContext) {
    const content = this.getContent(ctx);

    if (typeof content === "string") {
      return content;
    }

    return JSON.stringify(content, null, 2);
  }
}
