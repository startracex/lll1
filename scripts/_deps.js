import { existsSync, mkdirSync, readFileSync } from "fs";
import { normalize } from "path/posix";

/**
 * @type {{
 *  name: string;
 *  path: string;
 *  className: string;
 *  definition: string;
 * }[]}
 */
export const componentsJSON = JSON.parse(readFileSync("components.json", "utf-8"));

export const packageJSON = JSON.parse(readFileSync("package.json", "utf-8"));

export const tsconfigJSON = JSON.parse(readFileSync("tsconfig.json", "utf-8"));

const p = packageJSON.publishConfig?.directory;
const t = tsconfigJSON.compilerOptions?.outDir;
if (p && t) {
  if (normalize(p) !== normalize(t)) {
    console.error(`Mismatch publish directory
  package.json: publishConfig.directory is ${p}
  tsconfig.json: compilerOptions.outDir is ${t}
`);
    process.exit(1);
  }
}

export const publishDirectory = t || p;

export const highLight = (strings, ...values) => {
  const min = 31;
  const max = 36;
  const colorCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return strings.reduce(
    (prev, cur, index) => prev + cur + (values[index] ? `\x1b[${colorCode}m${values[index]}\x1b[0m` : ""),
    "",
  );
};

export const mustExistDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

mustExistDir(publishDirectory);
