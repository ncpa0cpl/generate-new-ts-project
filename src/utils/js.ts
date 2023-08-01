export const js = (...args: any[]): string => {
  const b = args[0];
  let c = "",
    a = 0,
    d = 0;
  for (c = b[0], a = 1, d = args.length; a < d; a++) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    c += String(args[a]) + b[a];
  }
  return c.trim() + "\n";
};
