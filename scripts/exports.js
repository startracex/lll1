/**
 * Export components.
 */
import fs from "fs/promises";
import { categoryElements, log, paths } from "./deps.js";

const notice = "/// script generated\n";

function stringExport(path, s = "*") {
  return `export ${s} from "${path}";\n`;
}

let componentsIndex = "";
let reactIndex = `"use client";
import { create } from "./create.js";
`;

const enableCategoryIndex = false;

Object.entries(categoryElements).forEach(async ([key, value]) => {
  let categoryIndex = "";
  value.forEach((element) => {
    const exportName = element[0].toUpperCase() + element.slice(1).replace(/-([a-z])/g, (str) => str[1].toUpperCase());
    if (!enableCategoryIndex) {
      componentsIndex += stringExport(`./${key}/${element}.js`, `{ ${exportName} }`);
    } else {
      componentsIndex += stringExport(`./${key}/index.js`);
    }
    categoryIndex += stringExport(`./${element}.js`);

    reactIndex += `
export const ${exportName} = create({
  elementClass: (await import("../${paths.webComponents}/${key}/${element}.js")).default,
});
`;
  });

  if (enableCategoryIndex) {
    await fs.writeFile(`${paths.componentsDirectory}/${key}/index.ts`, notice + categoryIndex);
  }
});

await fs.writeFile(`${paths.componentsDirectory}/index.ts`, notice + componentsIndex);

await fs.writeFile(`src/react/index.ts`, notice + reactIndex);

log("exports: Updated exports index");
