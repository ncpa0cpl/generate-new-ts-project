const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const os = require("os");

const p = (loc) => path.resolve(__dirname, "..", loc);

const isDev = process.argv.includes("--dev");
const watch = process.argv.includes("--watch");

async function main() {
  try {
    const outFilePath = p("dist/generate-new-ts-project.js");
    await esbuild.build({
      entryPoints: [p("src/generate-new-ts-project.ts")],
      outfile: outFilePath,
      bundle: true,
      minify: !isDev,
      keepNames: true,
      platform: "node",
      treeShaking: !isDev,
      tsconfig: p("tsconfig.json"),
    });

    // add shebang
    const fileContents = fs.readFileSync(outFilePath, "utf8");
    fs.writeFileSync(outFilePath, "#!/usr/bin/env node\n" + fileContents);

    // add executable permissions id on unix-like systems
    if (os.platform() !== "win32") {
      fs.chmodSync(outFilePath, "755");
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
