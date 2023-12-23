/**
 * Generate change log to the current version
 */
import fs from "fs/promises";
import { log } from "node:console";
import { packageJSON } from "./lib.js";

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

await fs
  .readFile(changelog, "utf-8")
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

  .then(() => {
    log(`changelog: Generated ${changelogRelease}`);
  })

  .catch((err) => {
    log(err);
  });
