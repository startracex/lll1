/**
 * Copy and modify the files that are required for publishing
 */
import fs from "fs";
import { log } from "node:console";
import path from "path";

const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

const coptFiles = ["LICENSE"];

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

const publishDirectory = packageJSON.publishConfig?.directory || "./public";

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;

fs.writeFileSync(path.join(publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2), "utf8");

coptFiles.forEach((file) => {
  fs.copyFileSync(file, path.join(publishDirectory, file));
});

/**
 * @param {TemplateStringsArray} strings normal
 * @param  {...any} values hightlight
 */
const info = (strings, ...values) => {
  const min = 31;
  const max = 36;
  const colorCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return strings.reduce((prev, cur, index) => prev + cur + (values[index] ? `\x1b[${colorCode}m${values[index]}\x1b[0m` : ""), "");
};

log(
  info`To publish, run: 
  ${`npm publish ${publishDirectory}`}
or
  ${"pnpm publish"}`,
);

fs.readFile(changelog, "utf-8", (err, data) => {
  if (err) {
    log(err);
    return;
  }

  const lines = data.split("\n");
  const changelog = [];
  let match = false;

  for (const line of lines) {
    if (match) {
      if (line.startsWith("## ")) {
        break;
      } else {
        changelog.push(line);
      }
    } else {
      if (line.startsWith(`## ${packageJSON.version}`)) {
        match = true;
        if (line.trim().length > packageJSON.version.length + 3) {
          changelog.push(line);
        }
      }
    }
  }

  fs.writeFile(changelogRelease, changelog.join("\n").trim(), (err) => {
    if (err) {
      log(err);
      return;
    }
  });
});
