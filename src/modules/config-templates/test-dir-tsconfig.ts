export const TESTDIR_TSCONFIG = {
  extends: "../tsconfig.json",
  include: ["../**/*"],
  compilerOptions: {
    rootDir: "..",
    noEmit: true,
  },
};
