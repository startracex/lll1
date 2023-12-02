/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const publishDirectory = "./public";

const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

const files = ["LICENSE"];

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;
fs.writeFileSync(path.join(publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2), "utf8");

files.forEach((file) => {
  fs.copyFileSync(`${file}`, path.join(publishDirectory, file));
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

console.log(
  info`To publish, run: 
  ${`npm publish ${publishDirectory}`}
or
  ${"pnpm publish"}`,
);

fs.readFile(changelog, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
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
      }
    }
  }

  fs.writeFile(changelogRelease, changelog.join("\n").trim(), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});
