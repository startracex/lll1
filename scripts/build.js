import { highLight, packageJSON, publishDirectory, componentsJSON } from "./_deps.js";
import { copyFileSync, writeFileSync } from "fs";
import path from "path/posix";
import { execSync } from "child_process";
import "./readme.js";

const copyFiles = ["LICENSE", "components.json"];

copyFiles.forEach(async (file) => {
  console.log(`copy: ${file}`);
  copyFileSync(file, path.join(publishDirectory, file));
});

console.log("tsc: Compiling to JS");
execSync("tsc");
console.log("tsc: Compilation completed");

delete packageJSON.private;

delete packageJSON.publishConfig;

const exports = {
  ".": "./index.js",
  "./*": "./*",
  "./react": "./react/index.js",
};

componentsJSON.forEach(({ name, definition }) => {
  exports["./" + name] = "./" + definition + ".js";
});

packageJSON.exports = exports;

writeFileSync(path.join(publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2));

console.log(
  highLight`To publish, run:
  ${`npm publish ${publishDirectory}`}
or
  ${"pnpm publish"}`,
);
