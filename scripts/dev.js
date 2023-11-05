import { cwd } from "node:process";
import fs from "fs";
import { log } from "node:console";
import { startDevServer } from "@web/dev-server";

(async () => {
  const port = 9527;
  walkSync(".").map((f) => log(`http://localhost:${port}${f.slice(1)}`));
  await startDevServer({
    config: {
      nodeResolve: { exportConditions: ["development"] },
      rootDir: cwd(),
      port,
      watch: true,
    },
    readCliArgs: false,
    readFileConfig: false,
  });
})();

function walkSync(d) {
  const result = [];
  fs.readdirSync(d, { withFileTypes: true }).forEach((file) => {
    if (file.name === "node_modules") {
      return;
    }
    const filepath = `${d}/${file.name}`;
    if (file.isDirectory()) {
      result.push(...walkSync(filepath));
    } else if (file.isFile()) {
      if (filepath.endsWith(".html")) {
        result.push(filepath);
      }
    }
  });
  return result;
}
