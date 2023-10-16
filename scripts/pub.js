import fs from "fs";

const target = "public";

const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

delete packageJSON.private;

delete packageJSON.publishConfig?.directory;

fs.writeFileSync(`${target}/package.json`, JSON.stringify(packageJSON, null, 2), "utf8");

const files = ["LICENSE"];

files.forEach((file) => {
  fs.copyFileSync(`${file}`, `${target}/${file}`);
});

/**
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 */
const info = (strings, ...values) => {
  return strings.reduce((prev, cur, index) => prev + cur + (values[index] ? `\x1b[36m${values[index]}\x1b[0m` : ""), "");
};

console.log(
  info`To publish, run: 
  ${"npm publish ./public"}
or
  ${"pnpm publish"}`,
);
