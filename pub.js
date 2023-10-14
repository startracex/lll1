import fs from "fs";

const target = "public";

const packageJSON = JSON.parse(fs.readFileSync("package.json", "utf8"));

delete packageJSON.private;

fs.writeFileSync(`${target}/package.json`, JSON.stringify(packageJSON, null, 2), "utf8");

const files = ["LICENSE"];

files.forEach((file) => {
  fs.copyFileSync(`${file}`, `${target}/${file}`);
});

console.log("\x1b[36m%s\x1b[0m", "To publish, run: npm publish ./public");
