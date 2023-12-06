import fs from "fs/promises";

export const packageJSON = JSON.parse(await fs.readFile("package.json"));

export const publishDirectory = packageJSON.publishConfig.directory;

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
 * Get files in dir which endsWith "."+ext
 * @param {string} dir Directory
 * @param {string} ext Extensions
 * @returns {Promise<string[]>}
 */
export async function walkExt(dir, ext) {
  const result = [];
  for (const file of await fs.readdir(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "src", "public"].includes(file.name)) {
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
