import { rollup } from "rollup";
import typescript2 from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import _minifyHTML from "rollup-plugin-minify-html-literals";
const minifyHTML = _minifyHTML.default;

const config = {
  input: "src/index.ts",
  plugins: [
    typescript2({
      tsconfig: "./tsconfig.json",
    }),
    minifyHTML(),
    terser({
      ecma: 2021,
      module: true,
    }),
  ],
  external: [
    "@lit/react",
    "react",
    "lit",
    "lit/decorators.js",
    "lit/directives/if-defined.js",
    "lit/directives/class-map.js",
  ],
};

async function build() {
  const bundle = await rollup(config);
  await bundle.write({
    format: "es",
    dir: "./build",
    sourcemap: true,
  });
}

await build();
