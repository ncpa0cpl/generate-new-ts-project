export const TYPESCRIPT_SETTINGS = {
  compilerOptions: {
    target: "es6",
    module: "commonjs",
    jsx: "react",
    declaration: true,
    outDir: "./dist",
    rootDir: "./src",
    downlevelIteration: true,
    strict: true,
    noUnusedLocals: true,
    noUncheckedIndexedAccess: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
  },
};
