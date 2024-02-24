/**
 * Synchronize full and usage readme.
 */
import fs from "fs/promises";
import path from "path";
import { createLog, paths } from "./deps.js";

const readme = "./README.md";

const readmePublish = path.join(paths.publishDirectory, readme);

await fs.readFile(readme, "utf8").then(async (data) => {
  const content = data.slice(0, data.indexOf("\n## Development") - 1);
  await fs.writeFile(readmePublish, content).then(createLog(`readme: Updated ${readmePublish}`));
});
