/**
 * Generate change log to the current version.
 */
import fs from "fs/promises";
import { log, createLog, packageJSON } from "./deps.js";

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

await fs.readFile(changelog, "utf-8").then(async (data) => {
  const lines = data.split("\n");
  const changelogLines = [];
  const searchStart = "## ";
  const searchString = searchStart + packageJSON.version;
  let match = false;
  for (const line of lines) {
    if (match) {
      if (line.startsWith(searchStart)) {
        break;
      } else {
        changelogLines.push(line);
      }
    } else {
      if (line.startsWith(searchString)) {
        match = true;
        if (line.trim().length > searchString.length) {
          changelogLines.push(line);
        }
      }
    }
  }
  const text = changelogLines.join("\n").trim();
  await fs.writeFile(changelogRelease, text).then(createLog(`changelog: Updated ${changelogRelease}`));
});
