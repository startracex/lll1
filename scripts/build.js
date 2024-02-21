/**
 * Run changelog script.
 * Run readme script.
 * Copy and modify the files that are required for publishing.
 */
import { categoryElements, createLog, info, log, packageJSON, panic, paths } from "./deps.js";
import "./changelog.js";
import "./readme.js";
import "./exports.js";
import fs from "fs/promises";
import { glob } from "glob";
import { exec } from "node:child_process";
import path from "path";

const copyFiles = ["LICENSE"];

copyFiles.forEach(async (file) => {
  log(`copy: ${file}`);
  await fs.copyFile(file, path.join(paths.publishDirectory, file));
});

packageJSON.exports = {
  ".": "./index.js",
  "./*": "./*",
};

const tsTops = (await glob("src/*.ts", { posix: true })).map((file) => file.replace("src/", "").replace(".ts", ""));
for (const file of tsTops) {
  packageJSON.exports[`./${file}`] = `./${file}.js`;
}

const genFiles = [];
for (const [key, value] of Object.entries(categoryElements)) {
  for (const elementName of value) {
    if (tsTops.includes(elementName)) {
      panic(`Duplicate files: ./src/${elementName}.ts`);
    }
    const genFile = `src/${elementName}.ts`;
    genFiles.push(genFile);
    await fs.writeFile(genFile, `export { default } from "./${paths.webComponents}/${key}/${elementName}.js";`);
    packageJSON.exports[`./${elementName}`] = `./${elementName}.js`;
  }
}

log("gen: Generate top-level exports");

await new Promise((resolve) => {
  exec("tsc", async () => {
    log("tsc: Compilation completed");
    await Promise.all(
      genFiles.map(async (file) => {
        await fs.rm(file);
      }),
    );

    log("gen: Cleanup");
    resolve();
  });
});

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;

await fs.writeFile(path.join(paths.publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2)).then(createLog("package: Updated package.json"));

log(
  info`To publish, run:
  ${`npm publish ${paths.publishDirectory}`}
or
  ${"pnpm publish"}`,
);
