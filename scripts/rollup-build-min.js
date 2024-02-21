import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { rollup } from "rollup";
import _minifyHTML from "rollup-plugin-minify-html-literals";
import typescript2 from "rollup-plugin-typescript2";

const minifyHTML = _minifyHTML.default;

const name = "GodownWebComponents";

const config = {
  input: "src/index.ts",
  plugins: [
    resolve(),
    typescript2({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          declarationMap: false,
        },
      },
    }),
    minifyHTML(),
    terser({
      ecma: 2021,
      module: true,
    }),
  ],
  output: [
    {
      file: "build/es.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "build/umd.js",
      format: "umd",
      name,
      sourcemap: true,
    },
    {
      file: "build/iife.js",
      format: "iife",
      name,
      sourcemap: true,
    },
  ],
};

async function build() {
  for (const output of config.output) {
    const bundle = await rollup(config);
    await bundle.write(output);
  }
}

build();
