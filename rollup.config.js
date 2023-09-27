import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
export default {
  plugins: [
    resolve(),
    minifyHTML(),
    terser({
      ecma: 2020,
      module: true,
    }),
  ],
  input: "public/index.js",
  output: [
    {
      file: 'build/es.js',
      format: "es",
      sourcemap: true
    },
    {
      file: 'build/umd.js',
      format: "umd",
      name: "GodownWebComponents",
      sourcemap: true
    },
    {
      file: 'build/iife.js',
      format: "iife",
      name: "GodownWebComponents",
      sourcemap: true
    }
  ],
};