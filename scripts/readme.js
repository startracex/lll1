/**
 * Synchronize full and usage readme.
 */
import fs from "fs";
import { log } from "node:console";
import path from "path";

const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

const publishDirectory = packageJSON.publishConfig?.directory || "./public";

const readme = "./README.md";

const readmePublish = path.join(publishDirectory, readme);

fs.readFile(readme, "utf8", (err, data) => {
  if (err) {
    log(err);
    return;
  }

  const content = data.slice(0, data.indexOf("\n## Development") - 1);

  fs.readFile(readmePublish, "utf8", (err, oldContent) => {
    if (err) {
      fs.writeFile(readmePublish, content, "utf8", () => {
        log(`Created ${readmePublish}`);
      });
      return;
    }
    if (content === oldContent) {
      log("No changes");
      return;
    }
    fs.writeFile(readmePublish, content, "utf8", () => {
      log(`Updated ${readmePublish}`);
    });
  });
});
