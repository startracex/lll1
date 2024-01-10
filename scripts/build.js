/**
 * Run changelog script.
 * Run readme script.
 * Copy and modify the files that are required for publishing.
 */
import "./changelog.js";
import "./readme.js";

import { info, packageJSON, publishDirectory } from "./lib.js";
import fs from "fs/promises";
import { log } from "node:console";
import path from "path";

const coptFiles = ["LICENSE"];

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;

await fs.writeFile(path.join(publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2));

coptFiles.forEach(async (file) => {
  log(`copy: ${file}`);
  await fs.copyFile(file, path.join(publishDirectory, file));
});

log(
  info`To publish, run:
  ${`npm publish ${publishDirectory}`}
or
  ${"pnpm publish"}`,
);
