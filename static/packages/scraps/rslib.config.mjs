import {Buffer} from 'node:buffer';
import fs from 'node:fs/promises';
import path from 'node:path';

import {pluginReact} from '@rsbuild/plugin-react';
import {defineConfig} from '@rslib/core';
import {pluginYak} from '@yak/react/rsbuild';

const DATA_CSS = /^import "data:text\/css;base64,([A-Za-z0-9+/=]*)";\n?/gm;
// Imports and re-exports, e.g. `import {a} from "./a.js"` or `export * from "./b.js"`
const IMPORT = /^(?:import|export) (?:[^;]*? from )?"([^"]+)";/gm;

/**
 * yak adds the CSS of each module as a `data:text/css` import. Package
 * consumers and Node cannot load these imports, so this plugin moves the CSS
 * into `dist/styles.css` and removes the imports from the JavaScript.
 *
 * The CSS follows the import order: the CSS of a module comes after the CSS of
 * its imports, like in a bundler.
 */
function pluginCollectYakCss() {
  return {
    name: 'collect-yak-css',
    setup(api) {
      api.onAfterBuild(async () => {
        const dist = path.resolve(api.context.distPath);
        const files = (await fs.readdir(dist, {recursive: true}))
          .filter(file => file.endsWith('.js'))
          .map(file => path.join(dist, file))
          .sort();
        const sources = new Map(
          await Promise.all(
            files.map(async file => [file, await fs.readFile(file, 'utf8')])
          )
        );

        const css = [];
        const visited = new Set();
        const visit = file => {
          if (visited.has(file) || !sources.has(file)) {
            return;
          }
          visited.add(file);
          for (const [, specifier] of sources.get(file).matchAll(IMPORT)) {
            if (specifier.startsWith('data:text/css;base64,')) {
              css.push(Buffer.from(specifier.split(',')[1], 'base64').toString());
            } else if (specifier.startsWith('.')) {
              visit(path.resolve(path.dirname(file), specifier));
            }
          }
        };
        files.forEach(visit);

        await Promise.all(
          files
            .filter(file => sources.get(file).includes('"data:text/css;base64,'))
            .map(file => fs.writeFile(file, sources.get(file).replace(DATA_CSS, '')))
        );
        await fs.writeFile(path.join(dist, 'styles.css'), css.join('\n'));
      });
    },
  };
}

export default defineConfig({
  lib: [{format: 'esm', bundle: false, dts: true, syntax: 'es2022'}],
  source: {
    entry: {index: ['./src/**', '!src/**/*.spec.tsx']},
  },
  output: {target: 'web'},
  plugins: [
    pluginReact({swcReactOptions: {importSource: '@emotion/react'}}),
    pluginYak(),
    pluginCollectYakCss(),
  ],
});
