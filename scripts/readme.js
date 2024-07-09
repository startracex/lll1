/**
 * Synchronize full and usage readme.
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path/posix";
import { publishDirectory } from "./_deps.js";

const readme = "./README.md";

const readmePublish = path.join(publishDirectory, readme);

const data = readFileSync(readme).toString();
const content = data.slice(0, data.indexOf("\n## Development") - 1);
writeFileSync(readmePublish, content);
console.log(`readme: Updated ${readmePublish}`);
