/**
 * Copy and modify the files that are required for publishing
 */
import { info, packageJSON, publishDirectory } from "./lib.js";
import fs from "fs/promises";
import { log } from "node:console";
import path from "path";

const coptFiles = ["LICENSE"];

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;

await fs.writeFile(path.join(publishDirectory, "package.json"), JSON.stringify(packageJSON, null, 2));

coptFiles.forEach(async (file) => {
  await fs.copyFile(file, path.join(publishDirectory, file));
});

log(
  info`To publish, run:
  ${`npm publish ${publishDirectory}`}
or
  ${"pnpm publish"}`,
);

fs.readFile(changelog, "utf-8")
  .then(async (data) => {
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

    await fs.writeFile(changelogRelease, changelog.join("\n").trim()).catch((err) => {
      if (err) {
        log(err);
        return;
      }
    });
  })

  .catch((err) => {
    log(err);
  });
