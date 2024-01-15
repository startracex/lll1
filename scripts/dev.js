/**
 * Start the development server.
 */

import { createServer } from "vite";
import { cwd } from "node:process";
import { log } from "node:console";
import { startDevServer } from "@web/dev-server";
import { walkExt } from "./lib.js";

/**
 * Use web/dev-server or vite.
 *
 * @type {"web"|"vite"}
 */
const server = "web";

(async () => {
  const port = 9527;

  (await walkExt(".", ".html")).forEach((we) => {
    log(`http://localhost:${port}/${we}`);
  });

  if (server === "web") {
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
  } else {
    await (await createServer()).listen(port);
  }
})();
