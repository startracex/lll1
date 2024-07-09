import { writeFileSync } from "fs";
import { globSync } from "glob";

function makeMeta(filePath) {
  const path = filePath.replace(".ts", "");
  const name = path.split("/").pop();
  const className = name[0].toUpperCase() + name.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  return {
    name,
    className,
    path,
    definition:  name,
  };
}

const files = globSync("web-components/**/*.ts", {
  ignore: ["web-components/*"],
  posix: true,
  cwd: "src",
}).reverse();

const componentsJSON = files.map(makeMeta);

writeFileSync("components.json", JSON.stringify(componentsJSON, null, 2));
