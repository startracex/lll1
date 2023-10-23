import _minifyHTML from "rollup-plugin-minify-html-literals";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const minifyHTML = _minifyHTML.default;
export default {
  plugins: [
    resolve(),
    typescript(),
    minifyHTML(),
    terser({
      ecma: 2020,
      module: true,
    }),
  ],
  input: "src/index.ts",
  output: [
    {
      file: "build/es.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "build/umd.js",
      format: "umd",
      name: "GodownWebComponents",
      sourcemap: true,
    },
    {
      file: "build/iife.js",
      format: "iife",
      name: "GodownWebComponents",
      sourcemap: true,
    },
  ],
};
