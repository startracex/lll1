/**
 * Generate change log to the current version.
 */
import fs from "fs/promises";
import { log, createLog, packageJSON } from "./deps.js";

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

await fs
  .readFile(changelog, "utf-8")
  .then(async (data) => {
    const lines = data.split("\n");
    const changelog = [];
    const searchStart = "## ";
    const searchString = searchStart + packageJSON.version;
    let match = false;
    for (const line of lines) {
      if (match) {
        if (line.startsWith(searchStart)) {
          break;
        } else {
          changelog.push(line);
        }
      } else {
        if (line.startsWith(searchString)) {
          match = true;
          if (line.trim().length > searchString.length) {
            changelog.push(line);
          }
        }
      }
    }

    const text = changelog.join("\n").trim();
    return text;
  })

  .then(async (text) => {
    await fs
      .readFile(changelogRelease, "utf-8")
      .then(async (oldText) => {
        if (oldText === text) {
          log("changelog: No changes");
        } else {
          await fs.writeFile(changelogRelease, text).then(createLog(`changelog: Modified ${changelogRelease}`));
        }
      })
      .catch(async (err) => {
        if (err.code === "ENOENT") {
          await fs.writeFile(changelogRelease, text).then(createLog(`changelog: Generated ${changelogRelease}`));
        } else {
          log(err);
        }
      });
  });
