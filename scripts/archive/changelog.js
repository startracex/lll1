/**
 * Generate change log to the current version.
 */
import { readFileSync, writeFileSync } from "fs";
import { createLog, packageJSON } from "../_deps.js";

const changelog = "./CHANGELOG.md";

const changelogRelease = "./CHANGELOG.release.md";

const data = readFileSync(changelog).toString();

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
writeFileSync(changelogRelease, text);
console.log(`changelog: Updated ${changelogRelease}`);
