import { existsSync, mkdirSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";

export const log = console.log;

export const createLog =
  (...a) =>
  () =>
    log(...a);

export const panic = (...a) => {
  log("PANIC: ", ...a);
  process.exit(1);
};

export const packageJSON = JSON.parse(await fs.readFile("package.json"));

export const tsconfigJSON = JSON.parse(await fs.readFile("tsconfig.json"));

const pd = packageJSON.publishConfig?.directory;

const td = tsconfigJSON.compilerOptions?.outDir;

if (pd && td) {
  if (path.normalize(pd) !== path.normalize(td)) {
    panic(`Mismatch publish directory
  package.json: publishConfig.directory is ${path.normalize(pd)}
  tsconfig.json: compilerOptions.outDir is ${path.normalize(td)}
`);
  }
}

/**
 * @type {string}
 */
const publishDirectory = td || pd;

if (!existsSync(publishDirectory)) {
  mkdirSync(publishDirectory);
}

await fs
  .access(publishDirectory)
  .catch(async () => {
    await fs.mkdir(publishDirectory);
  });

const webComponents = "web-components";

export const paths = {
  publishDirectory,
  webComponents,
  componentsDirectory: `src/${webComponents}`,
};

export const elementsFiles = (
  await glob(`${paths.componentsDirectory}/*/*-*.ts`, {
    posix: true,
  })
).sort();

export const categoryElements = elementsFiles.reduce((acc, str) => {
  const lastSlashIndex = str.lastIndexOf("/");
  const category = str.slice(paths.componentsDirectory.length + 1, lastSlashIndex);
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(str.slice(lastSlashIndex + 1, -".ts".length));
  return acc;
}, {});

/**
 * Highlight variables in templates, with a random color
 * @param {TemplateStringsArray} strings Normal
 * @param  {...any} values Hightlight
 */
export const info = (strings, ...values) => {
  const min = 31;
  const max = 36;
  const colorCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return strings.reduce((prev, cur, index) => prev + cur + (values[index] ? `\x1b[${colorCode}m${values[index]}\x1b[0m` : ""), "");
};

/**
 * Get files in dir which endsWith "."+ext.
 * @param {string} dir Directory.
 * @param {string} ext Extensions.
 * @param {string[]} skip Skip Directories.
 * @returns {Promise<string[]>}
 */
export async function walkExt(dir, ext, skip = ["node_modules", ".git"]) {
  const result = [];
  for (const file of await fs.readdir(dir, { withFileTypes: true })) {
    if (skip.includes(file.name)) {
      continue;
    }
    const filepath = dir === "." ? file.name : `${dir}/${file.name}`;

    if (file.isDirectory()) {
      result.push(...(await walkExt(filepath, ext)));
    } else {
      if (filepath.endsWith(ext)) {
        result.push(filepath);
      }
    }
  }
  return result;
}
