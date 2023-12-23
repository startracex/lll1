/**
 * Export components
 */
import fs from "fs/promises";
import { log } from "console";
import { walkExt } from "./lib.js";

const skip = ["lib", "react"];
const walked = await walkExt("src", "ts", skip);
const matchTS = walked.filter((f) => f.split("/").length > 2);

const exportMap = matchTS.reduce((acc, str) => {
  const lastSlashIndex = str.lastIndexOf("/");
  const indexroot = str.slice(0, lastSlashIndex);
  if (!acc.has(indexroot)) {
    acc.set(indexroot, []);
  }
  str = str.slice(lastSlashIndex, str.length - ".ts".length);
  if (!str.endsWith("index") && !str.endsWith("std")) {
    acc.get(indexroot).push(str);
  }
  return acc;
}, new Map());

exportMap.forEach(async (items, indexroot) => {
  const content = items.map((str) => `export * from ".${str}.js";`).join("\n") + "\n";
  await fs.writeFile(`${indexroot}/index.ts`, content).then(() => log(` Done\t${indexroot}/index.ts`));
});