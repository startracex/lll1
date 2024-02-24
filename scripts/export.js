/**
 * Export components.
 */
import fs from "fs/promises";
import { categoryElements, log, paths } from "./deps.js";
import convertTemplate from "./templates/converter.js";
import * as templates from "./templates/templates.js";

let componentsIndex = "";
let reactIndex = templates.react_export_Header;

Object.entries(categoryElements).forEach(([key, value]) => {
  value.forEach(async (element) => {
    const exportName = element[0].toUpperCase() + element.slice(1).replace(/-([a-z])/g, (str) => str[1].toUpperCase());
    componentsIndex += convertTemplate(templates.exportItem, [`{ ${exportName} }`, `./${key}/${element}.js`]);
    reactIndex += convertTemplate(templates.react_exportItem, [exportName, `../${paths.webComponents}/${key}/${element}.js`]);
  });
});

await fs.writeFile(`${paths.componentsDirectory}/index.ts`, componentsIndex);

await fs.writeFile(`src/react/index.ts`, reactIndex);

log("exports: Updated exports index");
