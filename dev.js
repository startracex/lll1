import { startDevServer } from "@web/dev-server";
import { cwd } from "node:process";

(async () => {
  const port = 9527;
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
