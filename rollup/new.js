import resolve from 'rollup-plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';
import { terser } from 'rollup-plugin-terser';
export default {
  input: '../esm/index.js',
  plugins: [
    includePaths({
      include: {
        '@ungap/assign': '../node_modules/@ungap/degap/assign.js',
        '@ungap/element-matches': '../node_modules/@ungap/degap/element-matches.js',
        '@ungap/weakset': '../node_modules/@ungap/degap/weakset.js',
        '@ungap/custom-event': '../node_modules/@ungap/degap/custom-event.js',
      },
    }),
    resolve({module: true}),
    terser()
  ],
  output: {
    exports: 'named',
    file: '../js/new.js',
    format: 'iife',
    name: 'TodoMVC'
  }
};
