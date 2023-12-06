import { cwd } from "node:process";
import { log } from "node:console";
import { startDevServer } from "@web/dev-server";
import { walkExt } from "./lib.js";

(async () => {
  const port = 9527;

  (await walkExt(".", ".html")).forEach((we) => {
    log(`http://localhost:${port}${we}`);
  });

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
