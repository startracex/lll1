import { glob } from "glob";
import { fileURLToPath } from "node:url";
import path from "path";
import { rollup } from "rollup";
import typescript2 from "rollup-plugin-typescript2";
import { paths } from "./deps.js";

const entries = Object.fromEntries(
  glob
    .sync("src/**/*.ts", {
      posix: true,
    })
    .map((file) => [file.slice(4, file.length - path.extname(file).length), fileURLToPath(new URL(file, import.meta.url))]),
);

const config = {
  input: entries,
  plugins: [
    typescript2({
      tsconfig: "./tsconfig.json",
    }),
  ],
  external: ["@lit/react", "react", "lit", "lit/decorators.js", "lit/directives/if-defined.js", "lit/directives/class-map.js"],
};

async function build() {
  const bundle = await rollup(config);

  await bundle.write({
    format: "es",
    dir: paths.publishDirectory,
    sourcemap: true,
  });
}

build();
