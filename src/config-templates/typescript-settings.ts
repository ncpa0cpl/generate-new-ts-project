export const TYPESCRIPT_SETTINGS = {
  compilerOptions: {
    target: "ESNext",
    module: "ES6",
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
    isolatedModules: true,
    noImplicitAny: true,
  },
};
