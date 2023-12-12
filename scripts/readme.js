/**
 * Synchronize full and usage readme.
 */
import fs from "fs/promises";
import { log } from "node:console";
import path from "path";
import { publishDirectory } from "./lib.js";

const readme = "./README.md";

const readmePublish = path.join(publishDirectory, readme);

fs.readFile(readme, "utf8")
  .then(async (data) => {
    const content = data.slice(0, data.indexOf("\n## Development") - 1);

    await fs
      .readFile(readmePublish, "utf8")
      .then(async (data) => {
        if (data === content) {
          log("No changes");
          return;
        }
        await fs.writeFile(readmePublish, content).then(() => {
          log(`Updated ${readmePublish}`);
        });
      })

      .catch(async (err) => {
        if (err.code === "ENOENT") {
          await fs.writeFile(readmePublish, content).then(() => {
            log(`Created ${readmePublish}`);
          });
        } else {
          log(err);
        }
      });
  })

  .catch((err) => {
    log(err);
  });
