export const SWC_CONFIG = {
  jsc: {
    keepClassNames: true,
    parser: {
      syntax: "typescript",
      tsx: true,
      decorators: true,
      dynamicImport: false,
    },
    target: "es2022",
    baseUrl: ".",
  },
  module: {
    type: "es6",
    strict: true,
  },
};
