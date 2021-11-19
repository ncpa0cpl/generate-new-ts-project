export const parseArgs = (args: string[]) =>
  args.map((p) => p.replace(/\s/g, "\\ ")).join(" ");
