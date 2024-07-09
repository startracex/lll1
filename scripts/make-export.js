import { writeFileSync } from "fs";
import { relative, dirname } from "path/posix";
import { componentsJSON } from "./_deps.js";

componentsJSON.forEach(({ path, name, className, definition }) => {
  path = relative(dirname(definition), path);
  const genFile = `import ${className} from "./${path}.js";
${className}.define();
export default ${className};
export * from "./${path}.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-${name}": ${className};
  }
}
`;
  writeFileSync("src/" + definition + ".ts", genFile);
});

writeFileSync(
  "src/index.ts",
  componentsJSON.reduce((acc, { definition }) => {
    return acc + `export * from "./${definition}.js";\n`;
  }, ""),
);

writeFileSync(
  "src/react/index.ts",
  `"use client";\n/* eslint-disable */\n` +
    componentsJSON.reduce((acc, cur) => {
      return `import _${cur.className} from "../${cur.definition}.js";
${acc}
export const ${cur.className} = create({
  elementClass: _${cur.className},
});
`;
    }, `import { create } from "./create.js";\n`),
);
