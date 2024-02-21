/**
 * Start the development server.
 */

import { startDevServer } from "@web/dev-server";
import { log } from "node:console";
import { cwd } from "node:process";
import { walkExt } from "./deps.js";

(async () => {
  const port = 9527;

  (await walkExt(".", ".html")).forEach((we) => {
    log(`http://localhost:${port}/${we}`);
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
