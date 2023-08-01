export const getYarnRc = () => {
  return (
    `
enableGlobalCache: true

nodeLinker: node-modules

enableMessageNames: false

enableProgressBars: true
`.trim() + "\n"
  );
};
