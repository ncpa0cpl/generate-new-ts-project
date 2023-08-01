export const addScript = (
  packageJson: Record<string, any>,
  name: string,
  cmd: string
): void => {
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  Object.defineProperty(packageJson.scripts, name, {
    value: cmd,
  });
};
