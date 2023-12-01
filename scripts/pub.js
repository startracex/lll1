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
 * @param {TemplateStringsArray} strings normal
 * @param  {...any} values hightlight
 */
const info = (strings, ...values) => {
  const min = 31;
  const max = 36;
  const colorCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return strings.reduce((prev, cur, index) => prev + cur + (values[index] ? `\x1b[${colorCode}m${values[index]}\x1b[0m` : ""), "");
};

// eslint-disable-next-line no-console
console.log(
  info`To publish, run: 
  ${"npm publish ./public"}
or
  ${"pnpm publish"}`,
);

