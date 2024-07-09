import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { rollup } from "rollup";
import _minifyHTML from "rollup-plugin-minify-html-literals";
import typescript2 from "rollup-plugin-typescript2";
import { readFileSync } from "fs";
const minifyHTML = _minifyHTML.default;

const name = "godown";

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
  const maxFileLen = Math.max(...config.output.map(({ file }) => file.length));

  for (const output of config.output) {
    const start = process.hrtime();
    const { file } = output;

    const bundle = await rollup(config);
    await bundle.write(output);

    const outData = readFileSync(file).toString();

    const spacesIndex = outData.indexOf(/\s{2,}/);
    const end = process.hrtime(start);
    const time = (end[0] + end[1] / 1e9).toFixed(2);
    const size = (outData.length / 1024).toFixed(2);

    console.log(
      `${file + " ".repeat(maxFileLen - file.length)}  ${time}s  ${size}KB  ${spacesIndex < 0 ? "no" : "contains"} consecutive spaces`,
    );
  }
}

await build();
