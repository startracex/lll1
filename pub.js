import fs from "fs";

const target = "public";
const files = [
  "LICENSE",
  "package.json",
];

files.forEach((file) => {
  fs.copyFileSync(`${file}`, `${target}/${file}`);
});

console.log('\x1b[36m%s\x1b[0m', 'To publish, run: npm publish ./public');